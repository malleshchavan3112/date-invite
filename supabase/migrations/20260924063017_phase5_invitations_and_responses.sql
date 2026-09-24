-- ============================================================
-- DateInvite — Phase 5 Migration
-- Invitations + Responses Tables, Indexes, RLS, Policies
-- ============================================================

-- ─── INVITATIONS ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invitations (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        UNIQUE NOT NULL,
  creator_name  TEXT        NOT NULL,
  creator_email TEXT        NOT NULL,
  title         TEXT        NOT NULL DEFAULT 'Would you go on a date with me?',
  intro_text    TEXT        NOT NULL DEFAULT 'Someone thinks you are wonderful and wants to invite you somewhere special.',
  active        BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Slug must be URL-safe alphanumeric (7+ chars), enforced by a CHECK
ALTER TABLE invitations
  ADD CONSTRAINT invitations_slug_format
  CHECK (slug ~ '^[A-Za-z0-9]{6,20}$');

-- creator_name not empty
ALTER TABLE invitations
  ADD CONSTRAINT invitations_creator_name_not_empty
  CHECK (length(trim(creator_name)) > 0);

-- creator_email not empty and looks like an email
ALTER TABLE invitations
  ADD CONSTRAINT invitations_creator_email_not_empty
  CHECK (length(trim(creator_email)) > 0 AND creator_email LIKE '%@%');

-- ─── RESPONSES ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS responses (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id    UUID        NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  answer           TEXT        NOT NULL CHECK (answer IN ('yes', 'no')),
  recipient_name   TEXT,
  date_type        TEXT,
  preferred_day    TEXT,
  preferred_time   TEXT,
  date_vibe        TEXT,
  message          TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enforce maximum one response per invitation (duplicate submission guard)
ALTER TABLE responses
  ADD CONSTRAINT responses_one_per_invitation
  UNIQUE (invitation_id);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────

-- Fast slug → invitation lookup (recipient routing)
CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_slug
  ON invitations (slug);

-- Index on active status for filtering active invitations
CREATE INDEX IF NOT EXISTS idx_invitations_active
  ON invitations (active);

-- Fast join from invitation to responses
CREATE INDEX IF NOT EXISTS idx_responses_invitation_id
  ON responses (invitation_id);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- ─── INVITATIONS POLICIES ────────────────────────────────────────────────────

-- Allow anyone (including anon role) to read a limited set of public fields.
-- creator_email is NEVER returned; we enforce this in application code with
-- explicit SELECT column lists. This policy only gates row visibility.
-- Public can only see active invitations.
CREATE POLICY "Public can view active invitations by slug"
  ON invitations
  FOR SELECT
  TO anon, authenticated
  USING (active = TRUE);

-- Allow server-side insertion (via service_role) to create invitations.
-- Anon INSERT is disabled — invitation creation goes through a Server Action
-- that uses the service_role client, bypassing RLS entirely.
-- We intentionally do NOT add an anon INSERT policy.

-- ─── RESPONSES POLICIES ──────────────────────────────────────────────────────

-- Recipients (anon) can insert a response if the parent invitation is active.
-- The UNIQUE constraint on invitation_id prevents duplicate submissions at DB level.
CREATE POLICY "Recipients can submit response for active invitation"
  ON responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM invitations
      WHERE invitations.id = responses.invitation_id
        AND invitations.active = TRUE
    )
  );

-- Responses are NOT readable by anon. Only service_role (server-side) can read.
-- This protects recipient data from direct client exposure.
-- No SELECT policy for anon = default deny.

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────

-- Function to automatically update updated_at on row mutation
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER responses_updated_at
  BEFORE UPDATE ON responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ─── PUBLIC VIEW (Privacy Firewall) ──────────────────────────────────────────
-- A view that explicitly excludes creator_email for extra safety.
-- The application code uses explicit column SELECT lists; this view is an
-- additional defence-in-depth layer.
CREATE OR REPLACE VIEW public_invitations AS
  SELECT
    id,
    slug,
    creator_name,
    title,
    intro_text,
    active,
    created_at
  FROM invitations;

-- Grant read on the view to anon role (creator_email is excluded at view level)
GRANT SELECT ON public_invitations TO anon, authenticated;
