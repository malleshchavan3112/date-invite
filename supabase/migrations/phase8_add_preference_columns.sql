-- Phase 8: Add new preference columns to responses table
-- Run this migration in Supabase SQL Editor

-- Add activity_preference column
ALTER TABLE responses
  ADD COLUMN IF NOT EXISTS activity_preference TEXT
    CHECK (activity_preference IN ('outdoor','indoor','active','relaxed','cultural','surprise_me'));

-- Add location_preference column
ALTER TABLE responses
  ADD COLUMN IF NOT EXISTS location_preference TEXT
    CHECK (location_preference IN ('city_center','neighborhood','nature','waterfront','anywhere'));

-- Add food_preference column
ALTER TABLE responses
  ADD COLUMN IF NOT EXISTS food_preference TEXT
    CHECK (food_preference IN ('no_preference','vegetarian','vegan','seafood','street_food','fine_dining','no_food'));

-- Add spontaneity column
ALTER TABLE responses
  ADD COLUMN IF NOT EXISTS spontaneity TEXT
    CHECK (spontaneity IN ('full_plan','loose_plan','go_with_flow','surprise_me'));

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'responses'
ORDER BY ordinal_position;
