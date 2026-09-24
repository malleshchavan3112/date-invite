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

import type { Invitation, PublicInvitation, CreateInvitationInput } from '@/types';
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
 * Transform an internal Invitation object into a safe PublicInvitation.
 * Strictly strips `creator_email` to protect creator privacy (D016).
 */
export function toPublicInvitation(invitation: Invitation): PublicInvitation {
  const { creator_email: _stripped, ...publicData } = invitation;
  return publicData;
}

/**
 * Create a new invitation in the Supabase database.
 * Generates an unpredictable slug, personalizes default intro text, and stores the record.
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
        title,
        intro_text: introText,
        active: true,
      })
      .select('id, slug, creator_name, creator_email, title, intro_text, active, created_at')
      .single();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        creator_name: data.creator_name,
        creator_email: data.creator_email,
        title: data.title,
        intro_text: data.intro_text,
        active: data.active,
        created_at: data.created_at,
      };
    }

    // If error is unique constraint violation on slug (code 23505), loop again
    if (error && error.code === '23505' && error.message.includes('slug')) {
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
      .select('id, slug, creator_name, creator_email, title, intro_text, active, created_at')
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
      .select('id, slug, creator_name, creator_email, title, intro_text, active, created_at')
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
