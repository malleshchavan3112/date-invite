/**
 * DateInvite — Response Repository (Supabase Real Persistence Layer)
 * 
 * Backed by Supabase PostgreSQL database.
 * 
 * Architectural Guarantees:
 * - D014: Responses table schema in Supabase
 * - Duplicate submission protection (single response per invitation enforced both
 *   in business logic and by PostgreSQL unique constraint on responses.invitation_id)
 * - Foreign key integrity (invitation_id references invitations.id ON DELETE CASCADE)
 * - Validation of inputs before persistence
 */

import type {
  Response,
  DateType,
  PreferredDay,
  PreferredTime,
  DateVibe,
  ActivityPreference,
  LocationPreference,
  FoodPreference,
  SpontaneityLevel,
  SubmitResponseInput,
  SubmitResponseResult,
} from '@/types';
import { getSupabaseServerClient } from './supabase/server';
import { getInvitationById } from './invitation-repository';
import { sendInvitationResponseEmail } from './email';

/**
 * Retrieve a response by invitation ID.
 */
export async function getResponseByInvitationId(
  invitationId: string
): Promise<Response | null> {
  if (!invitationId) return null;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('responses')
      .select('id, invitation_id, answer, recipient_name, date_type, preferred_day, preferred_time, date_vibe, message, activity_preference, location_preference, food_preference, spontaneity, created_at, submitted_at')
      .eq('invitation_id', invitationId)
      .maybeSingle();

    if (error) {
      console.error(`[response-repository] Error fetching response for invitation "${invitationId}":`, error);
      return null;
    }

    if (data) {
      return {
        id: data.id,
        invitation_id: data.invitation_id,
        answer: data.answer as 'yes' | 'no',
        recipient_name: data.recipient_name,
        date_type: data.date_type as DateType | null,
        preferred_day: data.preferred_day as PreferredDay | null,
        preferred_time: data.preferred_time as PreferredTime | null,
        date_vibe: data.date_vibe as DateVibe | null,
        message: data.message,
        // Phase 8
        activity_preference: data.activity_preference as ActivityPreference | null,
        location_preference: data.location_preference as LocationPreference | null,
        food_preference: data.food_preference as FoodPreference | null,
        spontaneity: data.spontaneity as SpontaneityLevel | null,
        created_at: data.created_at,
        submitted_at: data.submitted_at || data.created_at,
      };
    }
  } catch (err) {
    console.error(`[response-repository] Exception fetching response for invitation "${invitationId}":`, err);
  }

  return null;
}

/**
 * Check whether a response already exists for an invitation ID.
 */
export async function hasResponseForInvitation(invitationId: string): Promise<boolean> {
  if (!invitationId) return false;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('responses')
      .select('id')
      .eq('invitation_id', invitationId)
      .limit(1);

    if (error) {
      console.error(`[response-repository] Error checking response existence for "${invitationId}":`, error);
      return false;
    }

    return Boolean(data && data.length > 0);
  } catch (err) {
    console.error(`[response-repository] Exception checking response existence for "${invitationId}":`, err);
    return false;
  }
}

/**
 * Submit a questionnaire response into the Supabase database.
 * 
 * Guarantees:
 * 1. Supports developer mock error simulation via forceError flag.
 * 2. Validates required fields and enforces answer === 'yes'.
 * 3. Verifies invitation exists and is active.
 * 4. Enforces duplicate submission protection: rejects if response already exists.
 * 5. Handles DB unique constraint violation gracefully (409 Conflict / 23505).
 * 6. Returns structured result with error codes aligned with P15/P16 UI.
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

  // 5. Persist to Supabase database
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('responses')
      .insert({
        invitation_id: input.invitation_id,
        answer: 'yes',
        recipient_name: input.recipient_name?.trim() || null,
        date_type: input.date_type || null,
        preferred_day: input.preferred_day || null,
        preferred_time: input.preferred_time || null,
        date_vibe: input.date_vibe || null,
        message: input.message?.trim() || null,
        // Phase 8
        activity_preference: input.activity_preference || null,
        location_preference: input.location_preference || null,
        food_preference: input.food_preference || null,
        spontaneity: input.spontaneity || null,
      })
      .select('id, invitation_id, answer, recipient_name, date_type, preferred_day, preferred_time, date_vibe, message, activity_preference, location_preference, food_preference, spontaneity, created_at, submitted_at')
      .single();

    if (error) {
      // Postgres error 23505: unique_violation (duplicate submission race condition)
      if (error.code === '23505') {
        return {
          success: false,
          code: 'ALREADY_SUBMITTED',
          error: 'A response has already been submitted for this invitation.',
        };
      }

      console.error('[response-repository] Error inserting response into Supabase:', error);
      return {
        success: false,
        code: 'UNKNOWN_ERROR',
        error: error.message || 'Failed to record your response. Please try again.',
      };
    }

    if (!data) {
      return {
        success: false,
        code: 'UNKNOWN_ERROR',
        error: 'Failed to record your response.',
      };
    }

    const response: Response = {
      id: data.id,
      invitation_id: data.invitation_id,
      answer: data.answer as 'yes' | 'no',
      recipient_name: data.recipient_name,
      date_type: data.date_type as DateType | null,
      preferred_day: data.preferred_day as PreferredDay | null,
      preferred_time: data.preferred_time as PreferredTime | null,
      date_vibe: data.date_vibe as DateVibe | null,
      message: data.message,
      // Phase 8
      activity_preference: data.activity_preference as ActivityPreference | null,
      location_preference: data.location_preference as LocationPreference | null,
      food_preference: data.food_preference as FoodPreference | null,
      spontaneity: data.spontaneity as SpontaneityLevel | null,
      created_at: data.created_at,
      submitted_at: data.submitted_at || data.created_at,
    };

    // 6. Dispatch transactional notification email via Resend
    let emailSent = false;
    try {
      const emailResult = await sendInvitationResponseEmail({
        creatorEmail: invitation.creator_email,
        creatorName: invitation.creator_name,
        invitationSlug: invitation.slug,
        responseId: response.id,
        recipientName: response.recipient_name || 'Someone',
        answer: response.answer,
        dateType: response.date_type,
        preferredDay: response.preferred_day,
        preferredTime: response.preferred_time,
        dateVibe: response.date_vibe,
        message: response.message,
        // Phase 8
        activityPreference: response.activity_preference,
        locationPreference: response.location_preference,
        foodPreference: response.food_preference,
        spontaneity: response.spontaneity,
      });
      emailSent = emailResult.success;
    } catch (emailErr) {
      console.error('[response-repository] Unexpected error dispatching notification email:', emailErr);
      emailSent = false;
    }

    return {
      success: true,
      response,
      emailSent,
    };
  } catch (err) {
    console.error('[response-repository] Exception inserting response:', err);
    return {
      success: false,
      code: 'UNKNOWN_ERROR',
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}

/**
 * Submit a NO response for an invitation.
 * 
 * Guarantees:
 * - Persists answer = 'no' to Supabase responses table.
 * - Enforces duplicate submission protection (single response per invitation).
 * - D005: Does NOT trigger an email notification (MVP spec).
 * - Allows creator status dashboard to reflect the recipient's truthful choice.
 */
export async function submitNoResponse(
  invitationId: string
): Promise<SubmitResponseResult> {
  if (!invitationId || invitationId.trim().length === 0) {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      error: 'Invitation ID is required.',
    };
  }

  const invitation = await getInvitationById(invitationId);
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

  const alreadyExists = await hasResponseForInvitation(invitationId);
  if (alreadyExists) {
    return {
      success: false,
      code: 'ALREADY_SUBMITTED',
      error: 'A response has already been submitted for this invitation.',
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('responses')
      .insert({
        invitation_id: invitationId,
        answer: 'no',
      })
      .select('id, invitation_id, answer, created_at, submitted_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          code: 'ALREADY_SUBMITTED',
          error: 'A response has already been submitted for this invitation.',
        };
      }

      console.error('[response-repository] Error inserting NO response:', error);
      return {
        success: false,
        code: 'UNKNOWN_ERROR',
        error: error.message || 'Failed to record response.',
      };
    }

    if (!data) {
      return {
        success: false,
        code: 'UNKNOWN_ERROR',
        error: 'Failed to record response.',
      };
    }

    const response: Response = {
      id: data.id,
      invitation_id: data.invitation_id,
      answer: 'no',
      recipient_name: null,
      date_type: null,
      preferred_day: null,
      preferred_time: null,
      date_vibe: null,
      message: null,
      activity_preference: null,
      location_preference: null,
      food_preference: null,
      spontaneity: null,
      created_at: data.created_at,
      submitted_at: data.submitted_at || data.created_at,
    };

    return {
      success: true,
      response,
      emailSent: false,
    };
  } catch (err) {
    console.error('[response-repository] Exception inserting NO response:', err);
    return {
      success: false,
      code: 'UNKNOWN_ERROR',
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    };
  }
}
