-- Phase 9A: Add creator_access_token column to invitations table
-- Allows creators to securely return to their private dashboard without login/signup.

-- 1. Add column if it does not already exist
ALTER TABLE invitations
  ADD COLUMN IF NOT EXISTS creator_access_token TEXT;

-- 2. Backfill any existing invitations with cryptographically random tokens
UPDATE invitations
  SET creator_access_token = encode(gen_random_bytes(24), 'hex')
  WHERE creator_access_token IS NULL;

-- 3. Enforce NOT NULL constraint
ALTER TABLE invitations
  ALTER COLUMN creator_access_token SET NOT NULL;

-- 4. Create unique index for fast, safe lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_creator_access_token
  ON invitations(creator_access_token);

-- 5. Verify the updated schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'invitations'
ORDER BY ordinal_position;
