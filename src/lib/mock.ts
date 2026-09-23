import type { Invitation } from '@/types';

/**
 * Mock invitation for development before Supabase integration.
 * Matches the schema defined in DATABASE_SCHEMA.md and D014 (creator_name, creator_email).
 */
export const DEMO_INVITATION: Invitation = {
  id: 'mock-invitation-001',
  slug: 'demo-date',
  creator_name: 'Alex',
  creator_email: 'alex@example.com',
  title: 'A Special Invitation Just for You',
  intro_text: 'Someone who thinks you\'re pretty special has a very important question for you.',
  active: true,
  created_at: new Date().toISOString(),
};

/**
 * Resolves an invitation by slug using mock data.
 * In development, any slug resolves to the demo invitation for easy testing.
 * In production (Phase 5), this will be replaced by a Supabase lookup.
 */
export function getMockInvitation(slug: string): Invitation | null {
  if (slug === DEMO_INVITATION.slug) return DEMO_INVITATION;
  // Dev-only: any slug works for testing other screen states
  if (process.env.NODE_ENV === 'development') return DEMO_INVITATION;
  return null;
}
