/**
 * DateInvite — Response Repository (Mock Layer)
 * 
 * Provides an isolated data layer for storing and retrieving recipient responses.
 * In Phase 5, this interface will be backed by Supabase.
 * 
 * D014: Responses table schema
 * Enforces duplicate submission protection (single YES response per invitation).
 */

import type {
  Response,
  DateType,
  PreferredDay,
  PreferredTime,
  DateVibe,
  SubmitResponseInput,
  SubmitResponseResult,
} from '@/types';
import { getInvitationById } from './invitation-repository';

// Global singleton map to preserve in-memory responses across dev reloads & requests
declare global {
  // eslint-disable-next-line no-var
  var __dateInviteResponseStore: Map<string, Response> | undefined;
}

const responseStore: Map<string, Response> =
  globalThis.__dateInviteResponseStore ||
  (globalThis.__dateInviteResponseStore = new Map<string, Response>());

const STORAGE_KEY = 'dateinvite_responses';

/**
 * Retrieve a response by invitation ID.
 */
export async function getResponseByInvitationId(
  invitationId: string
): Promise<Response | null> {
  if (!invitationId) return null;

  // Check in-memory store
  if (responseStore.has(invitationId)) {
    return responseStore.get(invitationId)!;
  }

  // Check browser localStorage fallback if on client
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (stored[invitationId]) {
        const item = stored[invitationId] as Response;
        responseStore.set(invitationId, item);
        return item;
      }
    } catch {
      // Storage read failed
    }
  }

  return null;
}

/**
 * Check whether a response already exists for an invitation ID.
 */
export async function hasResponseForInvitation(invitationId: string): Promise<boolean> {
  const existing = await getResponseByInvitationId(invitationId);
  return existing !== null;
}

/**
 * Submit a questionnaire response.
 * 
 * Guarantees:
 * 1. Validates required fields and enforces answer === 'yes'.
 * 2. Verifies invitation exists and is active.
 * 3. Enforces duplicate submission protection: rejects if response already exists.
 * 4. Supports developer mock error simulation via forceError flag.
 * 5. Returns a structured result with error codes.
 */
export async function submitResponse(
  input: SubmitResponseInput
): Promise<SubmitResponseResult> {
  // 1. Dev mock error simulation check (deterministic testing for P16)
  if (input.forceError) {
    return {
      success: false,
      code: 'UNKNOWN_ERROR',
      error: 'We encountered an unexpected error while sending your response. (Dev simulation)',
    };
  }

  // 2. Validate required fields
  if (!input.invitation_id || input.invitation_id.trim().length === 0) {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      error: 'Invitation ID is required.',
    };
  }

  // D006: Submission flow is strictly for YES answers. Confirmed NO is handled by P05.
  if (input.answer !== 'yes') {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      error: 'Invalid answer type for questionnaire submission.',
    };
  }

  // 3. Verify invitation exists and is active
  const invitation = await getInvitationById(input.invitation_id);
  if (!invitation) {
    return {
      success: false,
      code: 'INVITATION_NOT_FOUND',
      error: 'This invitation could not be found.',
    };
  }

  if (!invitation.active) {
    return {
      success: false,
      code: 'INVITATION_INACTIVE',
      error: 'This invitation is no longer active.',
    };
  }

  // 4. Duplicate submission protection: single completed YES response per invitation
  const alreadyExists = await hasResponseForInvitation(input.invitation_id);
  if (alreadyExists) {
    return {
      success: false,
      code: 'ALREADY_SUBMITTED',
      error: 'A response has already been submitted for this invitation.',
    };
  }

  // 5. Construct complete response record
  const now = new Date().toISOString();
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `resp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const response: Response = {
    id,
    invitation_id: input.invitation_id,
    answer: 'yes',
    recipient_name: input.recipient_name?.trim() || null,
    date_type: (input.date_type as DateType) || null,
    preferred_day: (input.preferred_day as PreferredDay) || null,
    preferred_time: (input.preferred_time as PreferredTime) || null,
    date_vibe: (input.date_vibe as DateVibe) || null,
    message: input.message?.trim() || null,
    created_at: now,
    submitted_at: now,
  };

  // 6. Persist to in-memory store keyed by invitation_id
  responseStore.set(input.invitation_id, response);

  // Sync to browser localStorage if available
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      stored[input.invitation_id] = response;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Storage unavailable or disabled
    }
  }

  return {
    success: true,
    response,
  };
}

/**
 * Testing utility: Clear stored responses (dev/testing only).
 */
export function clearMockResponses(): void {
  responseStore.clear();
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
