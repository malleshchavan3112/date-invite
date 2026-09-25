-- ============================================================
-- DateInvite — Phase 9A Security Hardening Migration
-- Fixes:
--   1. Remove direct anon SELECT access to sensitive columns
--      on invitations table (creator_email, creator_access_token)
--   2. Grant column-level SELECT on non-sensitive columns only
--   3. Establish public_invitations view WITH (security_invoker = true)
--      eliminating the Security Definer View advisor error
--   4. Harden update_updated_at function (locked search_path = '')
--      eliminating the function_search_path_mutable advisor warning
--
-- Applied & Verified: 2026-09-25
-- Safe for production: does NOT drop data, NOT break server-side access
-- Result: 0 Errors, 0 Warnings in Supabase Security Advisor
-- ============================================================

-- ── STEP 1: Enable RLS & Define RLS Policy for Active Invitations ────────────
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active invitations by slug" ON invitations;
CREATE POLICY "Public can view active invitations by slug"
  ON invitations
  FOR SELECT
  TO anon, authenticated
  USING (active = TRUE);

-- ── STEP 2: Revoke Table-Level SELECT & Enforce Column-Level Whitelist ────────
-- Revoke broad table SELECT from anon and authenticated roles.
REVOKE SELECT ON TABLE invitations FROM anon, authenticated;

-- Grant SELECT ONLY on safe, non-sensitive columns.
-- Sensitive columns (creator_email, creator_access_token) are NEVER granted to anon.
-- Any direct query selecting creator_email or creator_access_token returns HTTP 401 (permission denied).
GRANT SELECT (id, slug, creator_name, title, intro_text, active, created_at)
  ON TABLE invitations TO anon, authenticated;

-- ── STEP 3: Harden public_invitations View (security_invoker = true) ─────────
-- Setting WITH (security_invoker = true) ensures the view uses the CALLER's
-- privileges and RLS context, satisfying Supabase Security Advisor linter (0 errors).
-- Since anon has column SELECT on the safe fields, querying the view succeeds with 200.
CREATE OR REPLACE VIEW public_invitations
  WITH (security_invoker = true)
AS
  SELECT
    id,
    slug,
    creator_name,
    title,
    intro_text,
    active,
    created_at
  FROM invitations;

GRANT SELECT ON public_invitations TO anon, authenticated;

-- ── STEP 4: Harden update_updated_at Function (Lock search_path) ─────────────
-- Lock search_path to empty string to prevent search_path hijacking.
-- Fixes Supabase Security Advisor "function_search_path_mutable" (0 warnings).
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── VERIFICATION STATUS ──────────────────────────────────────────────────────
-- 1. GET /rest/v1/invitations?select=creator_email        → HTTP 401 (Permission Denied)
-- 2. GET /rest/v1/invitations?select=creator_access_token → HTTP 401 (Permission Denied)
-- 3. GET /rest/v1/invitations?select=*                    → HTTP 401 (Permission Denied)
-- 4. GET /rest/v1/invitations?select=slug,creator_name    → HTTP 200 (Safe Columns Only)
-- 5. GET /rest/v1/public_invitations?select=*             → HTTP 200 (Safe Columns Only)
-- 6. Supabase Security Advisor                            → 0 Errors, 0 Warnings, 0 Info
