# Decisions Log

## D001 — Website, not mobile app
The product is a responsive web application built with modern web technologies, accessible across all devices via URL without requiring app store installation.

## D002 — Mobile-first
The invitation experience is optimized first and foremost for mobile viewports (375px–412px), where dating and messaging links are predominantly opened.

## D003 — Unique invitation route
Public recipient invitations are accessed via the dynamic route `/invite/[slug]`.

## D004 — Recipient account not required
The recipient opens and responds directly without creating an account or authenticating, eliminating friction.

## D005 — Email after YES submission only
The creator receives a structured response notification email via Resend after a YES submission. Confirmed NO responses are saved to the database but do not trigger an email notification in the MVP.

## D006 — Playful NO interaction
The NO button can be visually playful, animate evasively using spring physics, and trigger humorous copy. However, the system must never secretly record a genuine NO response as YES. A confirmed NO is saved to the database with `answer="no"`.

## D007 — Recipient screen numbering
P01 Loading, P02 Landing, P03 Main Question, P04 Playful NO, P05 NO Completion, P06 Name, P07 Date Type, P08 Preferred Day, P09 Preferred Time, P10 Date Vibe, P11 Optional Message, P12 Review, P13 Submitting, P14 Success, P15 Invalid Invitation, P16 Submission Error. (16 recipient screens total).

## D008 — Tech stack (locked 2026-09-23)
Next.js 14 (App Router), TypeScript (strict), Tailwind CSS v3, Framer Motion 11, Supabase (PostgreSQL), Resend, Vercel.

## D009 — [SUPERSEDED by D012/D013] Invitation creation method
*Superseded on 2026-09-23*: Originally planned as manual seeding via Supabase dashboard. Replaced by the Creator Flow (C01–C03) allowing creators to generate invitations directly on the website.

## D010 — Duplicate submission prevention
An invitation that has already received a completed response cannot receive a second response. A server-side guard and unique index on `responses(invitation_id)` enforce this.

## D011 — Recipient name as dedicated screen
Recipient name is collected on screen P06 as the first questionnaire step immediately following the YES action, ensuring a focused, clean layout.

## D012 — Two-Sided Invitation Model (2026-09-23)
The product explicitly models two separate actors:
1. **Invitation Creator**: Uses `/` or `/create` to generate an invitation, receives a shareable link, and gets notified of responses.
2. **Invitation Recipient**: Opens `/invite/[slug]`, completes the interactive flow, answers questionnaire, and submits.

## D013 — Creator Screens C01–C03 (2026-09-23)
Screen inventory now includes dedicated creator screens:
- **C01**: Create Invitation (Creator Name, Creator Email, "Create My Invitation" CTA)
- **C02**: Invitation Created & Share Hub (URL, Copy Link, Native Share, WhatsApp share)
- **C03**: Invitation Status (Created timestamp, Link opened, Response status)

## D014 — Updated Invitations Table Schema (2026-09-23)
The `invitations` table columns are defined as:
`id` (UUID), `slug` (text unique), `creator_name` (text), `creator_email` (text), `title` (text), `intro_text` (text), `active` (boolean), `created_at` (timestamptz).

## D015 — Updated Responses Table Schema (2026-09-23)
The `responses` table columns are defined as:
`id` (UUID), `invitation_id` (UUID), `answer` (text), `recipient_name` (text), `date_type` (text), `preferred_day` (text), `preferred_time` (text), `date_vibe` (text), `message` (text), `created_at` (timestamptz), `submitted_at` (timestamptz).

## D016 — Privacy Firewall: Creator Email Isolation (2026-09-23)
`creator_email` must never be sent to the recipient-facing client or exposed in DOM/API payloads. The recipient query for `/invite/[slug]` strictly selects non-sensitive fields.

## D017 — Unpredictable Slug Generation (2026-09-23)
Invitation slugs must be generated server-side using cryptographically secure random strings or high-entropy nanoids to prevent link enumeration and unauthorized discovery.

## D018 — Route Topology (2026-09-23)
- Creator entry: `/` or `/create`
- Creator share hub: `/create/success` (or inline transition)
- Creator status: `/invite/[slug]/status`
- Recipient entry: `/invite/[slug]`

## D019 — Supabase Server Client & Privacy Isolation (2026-09-24)
Server actions and repositories utilize a dedicated server-side Supabase client (`src/lib/supabase/server.ts`) initialized with `SUPABASE_SERVICE_ROLE_KEY`. This provides complete backend authority to perform business validations and slug collision retries while enforcing the Privacy Firewall: `getPublicInvitationBySlug` strictly omits `creator_email` at the SQL `SELECT` level. The service role key is strictly kept in server environment variables and never exposed to the client.

## D020 — Double-Layered Duplicate Response Protection (2026-09-24)
Duplicate responses to the same invitation are guarded at two independent layers:
1. Application layer: `hasResponseForInvitation(invitationId)` check before insert returns early with `ALREADY_SUBMITTED`.
2. Database layer: PostgreSQL `UNIQUE (invitation_id)` constraint on the `responses` table throws error code `23505` on race conditions, which the repository catches and gracefully surfaces as `ALREADY_SUBMITTED`.

## D021 — Server-Side Resend Email Architecture (2026-09-24)
Transactional email dispatch is executed strictly on the server side using the official Resend SDK. `RESEND_API_KEY` is never exposed in client bundles or public APIs. Recipient clients never pass `creator_email`; the recipient endpoint looks up the trusted `creator_email` directly from the server-side invitation record in Supabase. Email sending occurs strictly after database persistence succeeds.

## D022 — Deterministic Email Idempotency Key (2026-09-24)
To prevent accidental duplicate notifications across network retries, browser re-submits, or double clicks, each email dispatch sends a deterministic idempotency key formatted as `dateinvite-response/${responseId}` using Resend's native idempotency support (`{ idempotencyKey }` and `Idempotency-Key` header). The same database response identity always yields the same idempotency key.

## D023 — Asymmetric Failure Isolation: Persistence over Notification (2026-09-24)
If Supabase response persistence fails, email transmission is never attempted and the error is returned to the recipient with preserved inputs for retry. Conversely, if Supabase succeeds but Resend delivery fails (e.g. rate limit, provider outage, missing API key), the persisted database response is never rolled back or deleted. The operation returns `{ success: true, emailSent: false }`, allowing the recipient to reach success P14 without technical error exposure while server-side logs capture delivery failure.

## D024 — Production Security Headers, Canonical Sender & Anti-Crawling Isolation (2026-09-24)
1. **HTTP Security Headers**: `next.config.js` injects standard, safe production headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`) and disables `X-Powered-By`. Aggressive CSP is deliberately omitted to prevent breaking Framer Motion animation engines and Google Fonts.
2. **Canonical Production Sender**: Resend sender resolution prioritizes `DateInvite <notifications@dateinvite.me>` aligned with the verified `dateinvite.me` custom domain.
3. **Anti-Crawling Isolation**: Recipient routes `/invite/[slug]` enforce `robots: { index: false, follow: false, nocache: true }` to guarantee private unlisted invitation links are never scraped or indexed by search engines.

