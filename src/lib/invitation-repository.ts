/**
 * DateInvite — Invitation Repository (Supabase Real Persistence Layer)
 * 
 * Backed by Supabase PostgreSQL database.
 * 
 * Architectural Guarantees:
 * - D014: Invitations table schema in Supabase
 * - D016: Privacy Firewall (creator_email is NEVER fetched or exposed in PublicInvitation)
 * - D017: Cryptographically unpredictable slugs (collision resistant)
 */

import type {
  Invitation,
  PublicInvitation,
  CreateInvitationInput,
  SafeInvitationStatus,
  SafeResponseStatus,
  StatusPageResult,
  DateType,
  PreferredDay,
  PreferredTime,
  DateVibe,
  ActivityPreference,
  LocationPreference,
  FoodPreference,
  SpontaneityLevel,
  AnswerType,
} from '@/types';
import { getSupabaseServerClient } from './supabase/server';
import { DEMO_INVITATION } from './mock';

/**
 * Generate a cryptographically unpredictable, URL-safe slug.
 * Example outputs: 'a8K29xR', 'm4P7qRt', '7Xp9RwK'
 * 
 * Uses unambiguous alphanumeric characters (excluding confusing 0/O, 1/l/I).
 */
export function generateUnpredictableSlug(length: number = 7): string {
  const charset = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  let slug = '';

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      slug += charset[bytes[i] % charset.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      slug += charset[Math.floor(Math.random() * charset.length)];
    }
  }

  return slug;
}

/**
 * Generate a cryptographically secure, unpredictable random token for private creator dashboard access.
 * - 32 characters long
 * - Cryptographically random (using crypto.getRandomValues / crypto.randomBytes)
 * - Independent of slug, email, timestamp, or name
 */
export function generateCreatorAccessToken(length: number = 32): string {
  const charset = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  let token = '';

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      token += charset[bytes[i] % charset.length];
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require('crypto');
    const bytes = nodeCrypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      token += charset[bytes[i] % charset.length];
    }
  }

  return token;
}

/**
 * Transform an internal Invitation object into a safe PublicInvitation.
 * Strictly strips `creator_email` and `creator_access_token` to protect privacy (D016).
 */
export function toPublicInvitation(invitation: Invitation): PublicInvitation {
  const {
    creator_email: _strippedEmail,
    creator_access_token: _strippedToken,
    ...publicData
  } = invitation;
  return publicData;
}

/**
 * Create a new invitation in the Supabase database.
 * Generates an unpredictable slug and a separate private creator access token.
 */
export async function createInvitation(input: CreateInvitationInput): Promise<Invitation> {
  const trimmedName = input.creator_name?.trim();
  const trimmedEmail = input.creator_email?.trim().toLowerCase();

  if (!trimmedName || trimmedName.length < 1) {
    throw new Error('Creator name is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    throw new Error('Valid creator email is required');
  }

  const supabase = getSupabaseServerClient();

  // Retry loop for collision resistance (max 5 attempts)
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const slug = generateUnpredictableSlug(7);
    const creatorAccessToken = generateCreatorAccessToken(32);

    const title = input.title?.trim() || 'Would you go on a date with me?';
    const introText =
      input.intro_text?.trim() ||
      `${trimmedName} thinks you are wonderful and wants to invite you somewhere special.`;

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        slug,
        creator_name: trimmedName,
        creator_email: trimmedEmail,
        creator_access_token: creatorAccessToken,
        title,
        intro_text: introText,
        active: true,
      })
      .select('id, slug, creator_name, creator_email, creator_access_token, title, intro_text, active, created_at')
      .single();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        creator_name: data.creator_name,
        creator_email: data.creator_email,
        creator_access_token: data.creator_access_token,
        title: data.title,
        intro_text: data.intro_text,
        active: data.active,
        created_at: data.created_at,
      };
    }

    // If error is unique constraint violation on slug or token (code 23505), loop again
    if (error && error.code === '23505') {
      continue;
    }

    // Other unexpected error
    throw new Error(error ? error.message : 'Failed to create invitation in database.');
  }

  throw new Error('Could not generate a unique invitation link. Please try again.');
}

/**
 * Retrieve an internal Invitation by slug (server-side only, includes creator_email).
 */
export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
  if (!slug) return null;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('invitations')
      .select('id, slug, creator_name, creator_email, creator_access_token, title, intro_text, active, created_at')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`[invitation-repository] Error fetching invitation by slug "${slug}":`, error);
      return null;
    }

    if (data) {
      return {
        id: data.id,
        slug: data.slug,
        creator_name: data.creator_name,
        creator_email: data.creator_email,
        creator_access_token: data.creator_access_token,
        title: data.title,
        intro_text: data.intro_text,
        active: data.active,
        created_at: data.created_at,
      };
    }
  } catch (err) {
    console.error(`[invitation-repository] Exception fetching invitation by slug "${slug}":`, err);
  }

  // Fallback for development demo route
  if (slug === DEMO_INVITATION.slug) {
    return DEMO_INVITATION;
  }

  return null;
}

/**
 * Retrieve an internal Invitation by ID (server-side only).
 */
export async function getInvitationById(id: string): Promise<Invitation | null> {
  if (!id) return null;

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('invitations')
      .select('id, slug, creator_name, creator_email, creator_access_token, title, intro_text, active, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`[invitation-repository] Error fetching invitation by id "${id}":`, error);
      return null;
    }

    if (data) {
      return {
        id: data.id,
        slug: data.slug,
        creator_name: data.creator_name,
        creator_email: data.creator_email,
        creator_access_token: data.creator_access_token,
        title: data.title,
        intro_text: data.intro_text,
        active: data.active,
        created_at: data.created_at,
      };
    }
  } catch (err) {
    console.error(`[invitation-repository] Exception fetching invitation by id "${id}":`, err);
  }

  // Fallback for demo ID
  if (DEMO_INVITATION.id === id) {
    return DEMO_INVITATION;
  }

  return null;
}

/**
 * Retrieve a public-facing invitation by slug.
 * 
 * Privacy Firewall (D016):
 * Queries ONLY the non-sensitive public columns (excluding creator_email).
 * Guaranteed to never expose creator_email to the recipient client.
 */
export async function getPublicInvitationBySlug(slug: string): Promise<PublicInvitation | null> {
  if (!slug) return null;

  try {
    const supabase = getSupabaseServerClient();
    // Strictly select only public fields — creator_email is never queried
    const { data, error } = await supabase
      .from('invitations')
      .select('id, slug, creator_name, title, intro_text, active, created_at')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`[invitation-repository] Error fetching public invitation for "${slug}":`, error);
      return null;
    }

    if (data && data.active) {
      return {
        id: data.id,
        slug: data.slug,
        creator_name: data.creator_name,
        title: data.title,
        intro_text: data.intro_text,
        active: data.active,
        created_at: data.created_at,
      };
    }
  } catch (err) {
    console.error(`[invitation-repository] Exception fetching public invitation for "${slug}":`, err);
  }

  // Fallback for demo invitation
  if (slug === DEMO_INVITATION.slug) {
    return toPublicInvitation(DEMO_INVITATION);
  }

  return null;
}

/**
 * Phase 9A Correction: Retrieve sanitized invitation status and response data using the private creator access token.
 * 
 * Route: /manage/[token]
 * 
 * Security & Privacy Guarantees:
 * - Server-side only data retrieval.
 * - Accessed ONLY via cryptographically secure random creator_access_token.
 * - creator_email is NEVER returned.
 * - Internal UUIDs are strictly kept server-side.
 * - Public slug does NOT work as the token.
 */
export async function getInvitationByCreatorToken(token: string): Promise<StatusPageResult> {
  const trimmedToken = token?.trim();
  if (!trimmedToken || trimmedToken.length < 8) {
    return { status: 'not_found' };
  }

  try {
    const supabase = getSupabaseServerClient();

    // 1. Fetch invitation by creator_access_token (WITHOUT creator_email)
    const { data: invData, error: invError } = await supabase
      .from('invitations')
      .select('id, slug, creator_name, title, intro_text, active, created_at')
      .eq('creator_access_token', trimmedToken)
      .maybeSingle();

    if (invError) {
      console.error(`[invitation-repository] Error fetching invitation by creator token:`, invError);
      return { status: 'error', error: invError.message };
    }

    if (!invData || !invData.active) {
      // Demo fallback for local development/preview
      if (trimmedToken === DEMO_INVITATION.creator_access_token) {
        return {
          status: 'ok',
          invitation: {
            slug: DEMO_INVITATION.slug,
            creator_name: DEMO_INVITATION.creator_name,
            title: DEMO_INVITATION.title,
            intro_text: DEMO_INVITATION.intro_text,
            active: DEMO_INVITATION.active,
            created_at: DEMO_INVITATION.created_at,
          },
          response: null,
        };
      }
      return { status: 'not_found' };
    }

    // 2. Fetch response for this invitation if one exists
    const { data: respData, error: respError } = await supabase
      .from('responses')
      .select('answer, recipient_name, date_type, preferred_day, preferred_time, date_vibe, message, activity_preference, location_preference, food_preference, spontaneity, created_at, submitted_at')
      .eq('invitation_id', invData.id)
      .maybeSingle();

    if (respError) {
      console.error(`[invitation-repository] Error fetching response for creator token:`, respError);
      return { status: 'error', error: respError.message };
    }

    const safeInvitation: SafeInvitationStatus = {
      slug: invData.slug,
      creator_name: invData.creator_name,
      title: invData.title,
      intro_text: invData.intro_text,
      active: invData.active,
      created_at: invData.created_at,
    };

    let safeResponse: SafeResponseStatus | null = null;

    if (respData) {
      safeResponse = {
        answer: respData.answer as AnswerType,
        recipient_name: respData.recipient_name,
        date_type: respData.date_type as DateType | null,
        preferred_day: respData.preferred_day as PreferredDay | null,
        preferred_time: respData.preferred_time as PreferredTime | null,
        date_vibe: respData.date_vibe as DateVibe | null,
        message: respData.message,
        activity_preference: respData.activity_preference as ActivityPreference | null,
        location_preference: respData.location_preference as LocationPreference | null,
        food_preference: respData.food_preference as FoodPreference | null,
        spontaneity: respData.spontaneity as SpontaneityLevel | null,
        created_at: respData.created_at,
        submitted_at: respData.submitted_at || respData.created_at,
      };
    }

    return {
      status: 'ok',
      invitation: safeInvitation,
      response: safeResponse,
    };
  } catch (err: unknown) {
    console.error(`[invitation-repository] Exception in getInvitationByCreatorToken:`, err);
    return {
      status: 'error',
      error: err instanceof Error ? err.message : 'Unknown database error',
    };
  }
}

/**
 * Public status lookup for legacy /invite/[slug]/status route.
 * Security: NEVER returns private response or questionnaire answers through the public slug.
 */
export async function getInvitationStatusData(slug: string): Promise<StatusPageResult> {
  const trimmedSlug = slug?.trim();
  if (!trimmedSlug || trimmedSlug.length < 2) {
    return { status: 'not_found' };
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data: invData, error: invError } = await supabase
      .from('invitations')
      .select('id, slug, creator_name, title, intro_text, active, created_at')
      .eq('slug', trimmedSlug)
      .maybeSingle();

    if (invError) {
      return { status: 'error', error: invError.message };
    }

    if (!invData || !invData.active) {
      if (trimmedSlug === DEMO_INVITATION.slug) {
        return {
          status: 'ok',
          invitation: {
            slug: DEMO_INVITATION.slug,
            creator_name: DEMO_INVITATION.creator_name,
            title: DEMO_INVITATION.title,
            intro_text: DEMO_INVITATION.intro_text,
            active: DEMO_INVITATION.active,
            created_at: DEMO_INVITATION.created_at,
          },
          response: null,
        };
      }
      return { status: 'not_found' };
    }

    // Public route: returns safe invitation only, NO private response details
    return {
      status: 'ok',
      invitation: {
        slug: invData.slug,
        creator_name: invData.creator_name,
        title: invData.title,
        intro_text: invData.intro_text,
        active: invData.active,
        created_at: invData.created_at,
      },
      response: null,
    };
  } catch (err: unknown) {
    return {
      status: 'error',
      error: err instanceof Error ? err.message : 'Unknown database error',
    };
  }
}
