/**
 * DateInvite — Email Notification Dispatcher
 * 
 * Responsible for delivering transactional response notifications via Resend.
 * 
 * Guarantees:
 * 1. Server-side only execution.
 * 2. Idempotency: Uses deterministic key `dateinvite-response/${responseId}` to prevent duplicates.
 * 3. Graceful degradation: Never throws errors that could roll back or break database persistence.
 * 4. Privacy: Uses only public invitation slug in URLs (never internal DB IDs).
 * 5. Safe logging: Never logs API keys, tokens, or raw credentials.
 */

import type { SendInvitationResponsePayload, SendEmailResult, ResponseEmailData } from '@/types';
import { getResendClient, getSenderEmail, getAppBaseUrl } from './resend';
import {
  generateResponseEmailHtml,
  generateResponseEmailText,
  RESPONSE_EMAIL_SUBJECT,
} from './invitation-response-email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sends a transactional notification email to the invitation creator
 * when a recipient submits a YES questionnaire response.
 */
export async function sendInvitationResponseEmail(
  payload: SendInvitationResponsePayload
): Promise<SendEmailResult> {
  // 1. Validate response answer (D005: only YES responses trigger notification)
  if (payload.answer !== 'yes') {
    return {
      success: false,
      error: 'Only YES responses trigger creator email notification.',
    };
  }

  // 2. Validate creator email format
  const creatorEmail = payload.creatorEmail?.trim().toLowerCase();
  if (!creatorEmail || !EMAIL_REGEX.test(creatorEmail)) {
    console.warn('[DateInvite] notification email skipped: invalid or missing creator email');
    return {
      success: false,
      error: 'Invalid or missing creator email address.',
    };
  }

  // 3. Validate required identifiers
  if (!payload.responseId || payload.responseId.trim().length === 0) {
    console.warn('[DateInvite] notification email skipped: missing responseId for idempotency');
    return {
      success: false,
      error: 'Missing response ID.',
    };
  }

  if (!payload.invitationSlug || payload.invitationSlug.trim().length === 0) {
    console.warn('[DateInvite] notification email skipped: missing invitationSlug');
    return {
      success: false,
      error: 'Missing invitation slug.',
    };
  }

  // 4. Obtain Resend client
  const resend = getResendClient();
  if (!resend) {
    console.warn('[DateInvite] notification email skipped: RESEND_API_KEY is not configured.');
    return {
      success: false,
      error: 'RESEND_API_KEY is not configured in environment.',
    };
  }

  // 5. Construct public invitation URL using slug (never internal DB IDs)
  const baseUrl = getAppBaseUrl();
  const invitationUrl = `${baseUrl}/invite/${encodeURIComponent(payload.invitationSlug)}`;

  // 6. Build template data
  const emailData: ResponseEmailData = {
    creatorName: payload.creatorName?.trim() || 'there',
    recipientName: payload.recipientName?.trim() || 'Someone',
    dateType: payload.dateType || 'Not specified',
    preferredDay: payload.preferredDay || 'Not specified',
    preferredTime: payload.preferredTime || 'Not specified',
    dateVibe: payload.dateVibe || 'Not specified',
    message: payload.message?.trim() || null,
    invitationUrl,
  };

  const html = generateResponseEmailHtml(emailData);
  const text = generateResponseEmailText(emailData);

  // 7. Deterministic idempotency key based on persisted response ID
  const idempotencyKey = `dateinvite-response/${payload.responseId}`;
  const from = getSenderEmail();

  try {
    const { data, error } = await resend.emails.send(
      {
        from,
        to: creatorEmail,
        subject: RESPONSE_EMAIL_SUBJECT,
        html,
        text,
        headers: {
          'Idempotency-Key': idempotencyKey,
          'X-Entity-Ref-ID': payload.responseId,
        },
      },
      {
        idempotencyKey,
      }
    );

    if (error) {
      console.error('[DateInvite] notification email failed to send:', error.message || error.name);
      return {
        success: false,
        error: error.message || 'Resend provider rejected the request.',
      };
    }

    if (data?.id) {
      console.log(`[DateInvite] notification email accepted (id: "${data.id}")`);
      return {
        success: true,
        messageId: data.id,
      };
    }

    return {
      success: true,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown provider error';
    console.error('[DateInvite] notification email delivery exception:', errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}
