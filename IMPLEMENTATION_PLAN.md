# Implementation Plan

## Stack (Locked)
- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS v3
- Framer Motion 11
- Supabase (PostgreSQL)
- Resend (email)
- Vercel (deployment)

---

## Phase 0 — Documentation & Two-Sided Architecture ✅
- [x] Refactored product architecture for two actors: INVITATION CREATOR and INVITATION RECIPIENT
- [x] Defined Creator flow (C01–C03) and shareable link mechanics
- [x] Finalized public recipient flow (P01–P16)
- [x] Updated database schema (`creator_name`, `creator_email`, `recipient_name`, `submitted_at`)
- [x] Defined privacy firewall rules (creator email never exposed to recipient)
- [x] Aligned documentation files: README, PRD, PRODUCT_OVERVIEW, FEATURES, USER_FLOW, SCREEN_INVENTORY, ARCHITECTURE, DATABASE_SCHEMA, IMPLEMENTATION_PLAN, PROJECT_STATUS, DECISIONS

---

## Phase 1 — Foundation ✅
- [x] Scaffold Next.js 14 App Router with TypeScript & Tailwind CSS v3
- [x] Configure Tailwind design tokens (terracotta, rose, sage, sand, shadows, radius)
- [x] Google Fonts integration (`DM Serif Display` + `Inter`)
- [x] Reusable UI primitives: PrimaryButton, SecondaryButton, ChoiceCard, ProgressBar, PageTransition
- [x] Core TypeScript types & mock invitation data

---

## Phase 2 — Recipient Invitation Entry (P01–P05) ✅
- [x] P01: Invitation Loading screen with envelope rocking & shimmer progress
- [x] P02: Landing screen with decorative particles, intro copy, and "Open Invitation" CTA
- [x] P03: Main Date Question ("Would you go on a date with me?" with celebration burst on YES)
- [x] P04: Playful NO State with spring-physics button dodge, 3-attempt progression, bottom sheet modal
- [x] P05: Respectful NO Completion (warm closing state, records NO without guilt)
- [x] Integrated `InvitationFlow` state machine with `AnimatePresence` transitions and reduced-motion support
- [x] Verified build passes cleanly (`npm run build`, `tsc --noEmit`)

---

## Phase 2.5 — Creator Flow (C01–C03) ✅
- [x] Implement unpredictable slug generation utility (`generateUnpredictableSlug` using cryptographically secure random values)
- [x] Screen C01: Create Invitation form (`/` or `/create`)
  - [x] Creator Name input
  - [x] Creator Email input
  - [x] "Create My Invitation" CTA with validation & loading state
  - [x] Server Action `createInvitationAction` registering in repository with privacy protection
- [x] Screen C02: Invitation Created & Share Hub (`/create/success`)
  - [x] Success message banner & "sealed envelope" motif
  - [x] Generated invitation URL display (`http://domain/invite/[slug]`)
  - [x] One-tap "Copy Link" button with animated checkmark and aria-live status
  - [x] Native Web Share API integration with clipboard fallback
  - [x] WhatsApp share button with pre-filled teaser copy
  - [x] Test invitation preview link
  - [x] "Create Another Invitation" link
- [ ] Screen C03: Invitation Status view (`/invite/[slug]/status`) (PLANNED)
  - Creation timestamp
  - Link opened indicator
  - Current response status (Pending / Accepted / Declined)

---

## Phase 3 — Recipient Questionnaire (P06–P12) ✅
- [x] Screen P06: Recipient Name input screen with validation & Enter key support
- [x] Screen P07: Date Type selection (Coffee, Dinner, Picnic, Adventure, Movie, Surprise)
- [x] Screen P08: Preferred Day selection (Weekday, Friday, Saturday, Sunday, Any)
- [x] Screen P09: Preferred Time selection (Morning, Afternoon, Evening, Night)
- [x] Screen P10: Date Vibe selection (Cozy, Romantic, Fun, Fancy, Chill, Spontaneous)
- [x] Screen P11: Optional Message (special requests, character counter 0/300, skippable)
- [x] Screen P12: Review Answers card with individual row edit support & state lock
- [x] Questionnaire progress indicator (Step 1 to 6) with animated dots & back button
- [x] Integration with `InvitationFlow` preserving all responses across navigation and review edits

---

## Phase 4 — Submit & State Screens (P13–P16) ✅
- [x] Screen P13: Submitting state (animated soaring envelope, glow rings, shimmer bar, double-submission lock)
- [x] Screen P14: Success screen ("It's a date! 🎉", celebration badge, choice recap, privacy safe)
- [x] Screen P15: Invalid Invitation screen (friendly branded 404 for bad/expired slugs, "Back to Home")
- [x] Screen P16: Submission Error screen (calm retry preserving questionnaire answers in memory)
- [x] Isolated Mock Response Repository (`src/lib/response-repository.ts`): in-memory + localStorage persistence, validation, duplicate rejection, dev error simulation
- [x] Full integration with `InvitationFlow` state machine and Server Action `submitResponseAction`
- [x] Complete verification: TypeScript check (0 errors), Next.js production build (0 errors), browser testing across all scenarios


---

## Phase 5 — Supabase Database Integration 📋
- [ ] Create Supabase migration with updated schema:
  - `invitations` (`id`, `slug`, `creator_name`, `creator_email`, `title`, `intro_text`, `active`, `created_at`)
  - `responses` (`id`, `invitation_id`, `answer`, `recipient_name`, `date_type`, `preferred_day`, `preferred_time`, `date_vibe`, `message`, `created_at`, `submitted_at`)
  - `response_events` table (for link-opened tracking)
- [ ] Set up indexes (`idx_invitations_slug`, `idx_responses_invitation_id`, `idx_single_response_per_invitation`)
- [ ] Configure Row Level Security (RLS) policies and security views
- [ ] Server Action: `createInvitation(formData)`
- [ ] Server Action: `getPublicInvitation(slug)` (strictly strips `creator_email`)
- [ ] Server Action: `submitResponse(responseData)` (duplicate prevention + email trigger)

---

## Phase 6 — Email Integration (Resend) 📋
- [ ] Configure Resend client strictly server-side
- [ ] Build responsive HTML/text email template for date responses:
  - Header with celebration styling
  - Recipient name and confirmation answer
  - Detailed questionnaire breakdown (Date Type, Day, Time, Vibe, Personal Note)
  - Invitation identifier and timestamp
- [ ] Dispatch email to `creator_email` on YES response
- [ ] Ensure NO response records to database only (no email sent in MVP)
- [ ] Graceful error handling (email delivery failure does not crash client success UI)

---

## Phase 7 — Testing & Polish 📋
- [ ] Mobile viewport audit (375px, 390px, 412px)
- [ ] Tablet & desktop audit (768px, 1280px+)
- [ ] Accessibility: keyboard navigation, screen reader labels, visible focus rings
- [ ] Reduced motion testing (`prefers-reduced-motion`)
- [ ] Edge cases: invalid slugs, expired links, double-submission attempts, network offline

---

## Phase 8 — Deployment 📋
- [ ] Environment variable configuration on Vercel
- [ ] Supabase production migration
- [ ] Resend domain verification
- [ ] End-to-end production verification test (Creator link creation → Recipient YES → Resend email delivery)
