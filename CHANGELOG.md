# Changelog

## [Phase 6.0] — 2026-09-24

### Added
- **Resend Transactional Email Notification Pipeline (`src/lib/email/`)**:
  - `resend.ts`: Server-only Resend client factory with fallback configuration and sender resolution (`getResendClient`, `getSenderEmail`, `getAppBaseUrl`).
  - `invitation-response-email.ts`: Responsive, email-client-compatible HTML and plain-text template generators (`generateResponseEmailHtml`, `generateResponseEmailText`) with XSS escaping (`escapeHtml`), romantic branding, YES badge, questionnaire details summary table, and public CTA.
  - `send-response-notification.ts`: Core dispatcher function (`sendInvitationResponseEmail`) with input validation, deterministic idempotency key (`dateinvite-response/${responseId}`), and safe error handling.
  - `index.ts`: Module export hub for email services.
- **Persistence-First Sequence & Asymmetric Failure Handling (`src/lib/response-repository.ts`)**:
  - Wired notification dispatch to trigger strictly after response is successfully saved to Supabase.
  - Handled Resend failures gracefully without rolling back or deleting valid Supabase records.
  - Return `{ success: true, response, emailSent }` payload.
- **Email Verification & Test Suites**:
  - `scripts/test-email-unit.ts`: Comprehensive 27-assertion test suite covering Cases A through E, XSS sanitization, 300-char message boundary, deterministic idempotency, and public slug privacy.
  - `scripts/test-email.ts`: End-to-end integration test runner validating real email dispatch via Resend and querying Testmail inbox via JSON API.
  - `scripts/test-e2e-simulation.ts`: 8-step complete lifecycle simulation against live Supabase database verifying creation, privacy firewall, response submission, email generation, duplicate rejection, and inactive invitation rejection.
- **Architectural Decisions (D021, D022, D023)**:
  - D021: Server-side Resend architecture with creator email privacy isolation.
  - D022: Deterministic email idempotency key (`dateinvite-response/${responseId}`).
  - D023: Asymmetric failure isolation (persistence over notification).
- **Environment & Onboarding (`.env.example`)**:
  - Added documentation and placeholders for `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_APP_URL`, `TESTMAIL_API_KEY`, and `TESTMAIL_NAMESPACE`.

---

## [Phase 5.0] — 2026-09-24

### Added
- **Supabase Cloud Database Integration**:
  - Linked to project `dateinvite` (`rscybfaxhpesbpvmjyhk` on `ap-south-1`).
  - Migration `20260924063017_phase5_invitations_and_responses.sql` applied.
  - `invitations` table with UUID primary keys, unique slugs, email/name constraints, and timestamps.
  - `responses` table with foreign key to `invitations`, unique constraint on `invitation_id` for duplicate submission prevention, and timestamp tracking.
  - `public_invitations` view implementing defense-in-depth privacy by omitting `creator_email`.
  - Row Level Security (RLS) enabled on all tables with explicit SELECT and INSERT policies.
- **Supabase Client Layer (`src/lib/supabase/`)**:
  - `client.ts`: Browser client initialized with public URL & anon key.
  - `server.ts`: Server client factory using service role key (bypasses RLS strictly for safe server actions).
- **Supabase Invitation Repository (`src/lib/invitation-repository.ts`)**:
  - Replaced in-memory mock store with real Supabase persistence.
  - `createInvitation`: Generates collision-resistant unpredictable slugs, inserts into Supabase with retry logic.
  - `getPublicInvitationBySlug`: Implements Privacy Firewall (D016) by querying and returning ONLY public columns (`creator_email` is never retrieved).
  - `getInvitationBySlug` & `getInvitationById`: Server-side only lookups.
- **Supabase Response Repository (`src/lib/response-repository.ts`)**:
  - Replaced in-memory mock store with real Supabase persistence.
  - `submitResponse`: Validates input, verifies invitation existence and active status, enforces duplicate submission protection, inserts into Supabase, and handles unique constraint violations cleanly.
  - `hasResponseForInvitation`: Verifies prior submission status.
  - `getResponseByInvitationId`: Fetches completed response.
- **Automated Integration Tests (`scripts/test-supabase.ts`)**:
  - 7 automated tests verifying end-to-end Supabase creation, privacy firewall, response submission, duplicate prevention, and error codes.

---

## [Phase 4.0] — 2026-09-23

### Added
- **P13 Submitting Screen (`src/components/invitation/SubmittingScreen.tsx`)**:
  - Animated soaring envelope motif with dual pulsing soft glow rings and indeterminate shimmer progress bar.
  - Heading: "Sending your answer…", supporting copy: "Just a moment — your response is on its way."
  - Duplicate submission lock disabling controls and preventing accidental double-clicks.
  - Accessible focus management and `aria-live="polite"` status announcement.
- **P14 Success Screen (`src/components/invitation/SuccessScreen.tsx`)**:
  - Celebration state with "It's a date! 🎉", checkmark badge, and ambient floating sparkles.
  - Confirmation text: "Your answer has been sent.", "Your response has been recorded.", "They'll get your response and can take it from here."
  - Summary recap card presenting recipient's selected Date Type, Preferred Day, Time, Vibe, and Note.
  - Privacy firewall: strictly excludes creator email and internal backend metadata.
  - Clear "Done" CTA navigating home.
- **P15 Invalid Invitation Screen (`src/components/invitation/InvalidInvitationScreen.tsx`)**:
  - Branded friendly error state for non-existent, expired, or inactive invitation slugs.
  - Heading: "This invitation isn't available", copy: "It looks like this invitation is no longer active or the link may be incorrect."
  - Warm empty-state envelope illustration and "Back to Home" primary CTA.
  - Strict privacy protection: never discloses whether an invitation ever existed.
- **P16 Submission Error Screen (`src/components/invitation/SubmissionErrorScreen.tsx`)**:
  - Dedicated retry state preserving all user responses in memory without reset.
  - Heading: "Something went wrong", copy: "We couldn't send your response just yet. Your answers are still here."
  - Reassuring badge: "All your answers are safely saved".
  - Primary "Try Again" action (retries P13 submission) and secondary "Review Answers" action (returns directly to P12).
  - Graceful handling of `ALREADY_SUBMITTED` structured error code.
- **Isolated Mock Response Repository (`src/lib/response-repository.ts`)**:
  - In-memory singleton `__dateInviteResponseStore` synchronized with `localStorage`.
  - Implemented `submitResponse`, `getResponseByInvitationId`, and `hasResponseForInvitation`.
  - Enforced single completed YES response per invitation (`ALREADY_SUBMITTED`).
  - Validation enforcing required fields and strictly verifying `answer === 'yes'`.
  - Added dev-only deterministic error testing via `?mockSubmissionError=true` query parameter.
- **Server Action Integration (`src/lib/actions.ts`)**:
  - Added `submitResponseAction` delegating securely to the isolated mock repository.
- **Flow State Machine & Routing Updates**:
  - Updated `InvitationFlow.tsx` with `submitting`, `success`, `invalid`, `error` states and transitions.
  - Updated `ReviewAnswersStep.tsx` with "Send My Answer — It's a Date! 💌" CTA triggering submission.
  - Updated `/invite/[slug]/page.tsx` and created `src/app/not-found.tsx` to route invalid slugs to P15.
  - Guaranteed 100% preservation of the respectful NO path (P03 → P04 → P05).

---

## [Phase 3.0] — 2026-09-23

### Added
- **P06 Recipient Name**: Dedicated input screen with validation, auto-focus, Enter key support, and subtle progress indicator (`STEP 1 OF 6`).
- **P07 Date Type**: 6 choice cards (Coffee, Dinner, Picnic, Movie, Adventure, Surprise) with responsive 2-column grid and single-select enforcement (`STEP 2 OF 6`).
- **P08 Preferred Day**: Interactive schedule choice cards (Weekday, Friday, Saturday, Sunday, Any day) with single-select (`STEP 3 OF 6`).
- **P09 Preferred Time**: Time-of-day choice cards (Morning, Afternoon, Evening, Night) with single-select (`STEP 4 OF 6`).
- **P10 Date Vibe**: Aesthetic mood choice cards (Cozy, Romantic, Fun, Fancy, Chill, Spontaneous) with expressive styling (`STEP 5 OF 6`).
- **P11 Optional Message**: Multiline textarea note with live character counter (`0 / 300`), 300-char max, "Review Invitation" CTA, and "Skip" button (`STEP 6 OF 6`).
- **P12 Review Answers**: Consolidated summary card displaying all answers with individual "Edit" actions, back navigation, and state lock preparing for Phase 4.
- **QuestionnaireProgress Component**: Accessible progress bar and dot counter with contextual Back button.
- **InvitationFlow State Management**: Client state machine in `src/components/invitation/InvitationFlow.tsx` preserving all questionnaire answers across forward, backward, and edit transitions without network requests.
- **Directional Slide Transitions**: Bidirectional horizontal slide animations respecting `prefers-reduced-motion`.

---

## [Phase 2.5] — 2026-09-23

### Added
- **Two-Sided Invitation Model**: Refactored architecture to support distinct Creator and Recipient actors.
- **C01 Create Invitation Screen (`/` and `/create`)**:
  - Implemented creator onboarding with Name and Email inputs.
  - Added inline form validation (required checks, email regex pattern validation).
  - Added "Create My Invitation" CTA with loading indicator and disabled state.
  - Integrated `createInvitationAction` Server Action for secure registration.
- **C02 Invitation Created / Share Hub (`/create/success`)**:
  - Implemented shareable link card with dynamic URL generation.
  - Added "Copy Link" button with animated checkmark and `aria-live` accessible announcement.
  - Integrated native `navigator.share` API with graceful clipboard fallback.
  - Added direct WhatsApp share button with pre-filled teaser message.
  - Added invitation preview link and "Create Another Invitation" action.
- **Isolated Invitation Repository (`src/lib/invitation-repository.ts`)**:
  - Implemented `generateUnpredictableSlug` using cryptographically secure random values.
  - Implemented singleton in-memory storage with browser localStorage synchronization.
  - Added `toPublicInvitation` and `getPublicInvitationBySlug` strictly stripping `creator_email`.
- **Privacy Firewall Enforcement**:
  - Prohibited passing `creator_email` in URL parameters or slugs.
  - Ensured recipient endpoints (`/invite/[slug]`) receive only non-sensitive public metadata.
- **Responsive & Design System Polish**:
  - Validated 375px mobile, 390px, 768px tablet, and 1280px+ desktop viewports.
  - Maintained complete visual compatibility with existing P01–P05 recipient flow.

---

## [Phase 2.0] — 2026-09-23

### Added
- **Public Recipient Flow Screens (P01–P05)**:
  - P01: LoadingScreen with rocking envelope animation and progress shimmer.
  - P02: LandingScreen with envelope reveal and personalized greeting copy.
  - P03: DateQuestion screen with main date proposal and YES celebration particle burst.
  - P04: PlayfulNo screen with spring physics dodging button and 3-attempt bottom sheet modal.
  - P05: NoCompletion screen with respectful, warm closing state.
- **Framer Motion Integration**: Page transitions via `AnimatePresence` and `prefers-reduced-motion` compliance.

---

## [Phase 1.0] — 2026-09-23

### Added
- **Project Foundation**:
  - Next.js 14 App Router, TypeScript strict mode, Tailwind CSS v3.
  - Design tokens for romance palette (`terracotta`, `rose`, `sage`, `sand`).
  - Google Fonts integration (`DM Serif Display` and `Inter`).
  - Core UI component primitives (`PrimaryButton`, `SecondaryButton`, `ChoiceCard`, `ProgressBar`, `PageTransition`).
