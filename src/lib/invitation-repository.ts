/**
 * DateInvite — Invitation Repository (Mock Layer)
 * 
 * Provides an isolated data layer for creating and resolving invitations.
 * In Phase 5, this interface will be backed by Supabase.
 * 
 * D014: Invitations table schema
 * D016: Privacy Firewall (creator_email NEVER in PublicInvitation)
 * D017: Cryptographically unpredictable slugs
 */

import type { Invitation, PublicInvitation, CreateInvitationInput } from '@/types';
import { DEMO_INVITATION } from './mock';

// Global singleton map to preserve in-memory records across dev reloads & requests
declare global {
  // eslint-disable-next-line no-var
  var __dateInviteStore: Map<string, Invitation> | undefined;
}

const store: Map<string, Invitation> =
  globalThis.__dateInviteStore ||
  (globalThis.__dateInviteStore = new Map<string, Invitation>());

// Ensure DEMO_INVITATION is always available for test route /invite/demo-date
if (!store.has(DEMO_INVITATION.slug)) {
  store.set(DEMO_INVITATION.slug, DEMO_INVITATION);
}

/**
 * Generate a cryptographically unpredictable, URL-safe slug.
 * Example outputs: 'a8K29x', 'm4P7qR', '7Xp9Rw'
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
 * Create a new invitation in the repository.
 * Generates an unpredictable slug, personalizes default intro text, and stores the record.
 */
export async function createInvitation(input: CreateInvitationInput): Promise<Invitation> {
  const trimmedName = input.creator_name.trim();
  const trimmedEmail = input.creator_email.trim().toLowerCase();

  if (!trimmedName) {
    throw new Error('Creator name is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    throw new Error('Valid creator email is required');
  }

  // Generate a unique collision-resistant slug
  let slug = generateUnpredictableSlug(7);
  while (store.has(slug)) {
    slug = generateUnpredictableSlug(7);
  }

  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const invitation: Invitation = {
    id,
    slug,
    creator_name: trimmedName,
    creator_email: trimmedEmail,
    title: input.title || 'Would you go on a date with me?',
    intro_text:
      input.intro_text ||
      `${trimmedName} thinks you are wonderful and wants to invite you somewhere special.`,
    active: true,
    created_at: new Date().toISOString(),
  };

  store.set(slug, invitation);

  // Sync to browser localStorage/sessionStorage if running on the client
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('dateinvite_invitations') || '{}');
      stored[slug] = invitation;
      localStorage.setItem('dateinvite_invitations', JSON.stringify(stored));
    } catch {
      // Storage unavailable or disabled; in-memory store remains active
    }
  }

  return invitation;
}

/**
 * Retrieve an internal Invitation by slug (server-side only, includes creator_email).
 */
export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
  // Check in-memory store
  if (store.has(slug)) {
    return store.get(slug)!;
  }

  // In browser context, try localStorage fallback
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('dateinvite_invitations') || '{}');
      if (stored[slug]) {
        const item = stored[slug] as Invitation;
        store.set(slug, item);
        return item;
      }
    } catch {
      // Storage read failed
    }
  }

  // Development convenience fallback: if slug matches demo or in dev mode with unrecognized slug
  if (slug === DEMO_INVITATION.slug) {
    return DEMO_INVITATION;
  }

  return null;
}

/**
 * Retrieve an internal Invitation by ID.
 */
export async function getInvitationById(id: string): Promise<Invitation | null> {
  // Check in-memory store
  let found: Invitation | null = null;
  store.forEach((invitation) => {
    if (!found && invitation.id === id) {
      found = invitation;
    }
  });
  if (found) return found;

  // In browser context, try localStorage fallback
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('dateinvite_invitations') || '{}');
      const keys = Object.keys(stored);
      for (let i = 0; i < keys.length; i++) {
        const item = stored[keys[i]] as Invitation;
        if (item.id === id) {
          store.set(item.slug, item);
          return item;
        }
      }
    } catch {
      // Storage read failed
    }
  }

  // Demo invitation fallback
  if (DEMO_INVITATION.id === id) {
    return DEMO_INVITATION;
  }

  return null;
}

/**
 * Retrieve a public-facing invitation by slug.
 * Privacy-safe: guaranteed never to contain `creator_email` (D016).
 */
export async function getPublicInvitationBySlug(slug: string): Promise<PublicInvitation | null> {
  const invitation = await getInvitationBySlug(slug);
  if (!invitation || !invitation.active) {
    return null;
  }
  return toPublicInvitation(invitation);
}

