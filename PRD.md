# DateInvite — Product Requirements Document (PRD)

## 1. Product Summary
DateInvite is a playful, mobile-first dating invitation platform built around a **two-sided invitation model**:
1. **Invitation Creator**: An individual who wants to ask someone on a date in a creative, low-pressure, memorable way. The creator creates an invitation in seconds by providing their name and email, then shares the generated unique link.
2. **Invitation Recipient**: The person receiving the link. They open `/invite/[slug]` without needing an account, interact with a playful proposal, and upon saying YES, specify their preferred date details through a short questionnaire.

---

## 2. Primary Goals
- **Frictionless Creation**: Allow a creator to generate a shareable, personalized invitation in under 30 seconds without creating an account or password.
- **High Emotional Delight**: Replace dull chat messages with a captivating, responsive, animated web invitation.
- **Actionable Logistics**: Turn a generic "yes" into concrete plans (activity type, day, time, vibe) via an interactive questionnaire.
- **Privacy & Confidence**: Ensure the creator's email address is strictly private and never exposed to the recipient.
- **Instant Notification**: Deliver a structured, beautifully formatted email to the creator as soon as a YES response is submitted.

---

## 3. The Two Actors & Core Flow

```
CREATOR
   ↓
Opens DateInvite (/ or /create)
   ↓
Enters Creator Name & Email
   ↓
Creates Invitation (C01)
   ↓
Backend generates unpredictable slug & records invitation
   ↓
Creator receives shareable URL with 1-tap copy & share tools (C02)
   ↓
Creator shares URL with recipient
   ↓
RECIPIENT
   ↓
Opens /invite/[slug]
   ↓
P01–P05 Flow: Loading → Landing → Main Question
   ↓
If NO: Playful dodge (P04) → Respectful completion (P05) → DB saved (no email)
   ↓
If YES: Celebration burst → Questionnaire (P06–P12) → Review
   ↓
Submit Response (P13)
   ↓
Success Celebration (P14)
   ↓
BACKEND
   ↓
Associates response with invitation_id
   ↓
Sends structured notification email to creator_email via Resend
```

---

## 4. Creator Screens & Features

### C01 — Create Invitation
- **Fields**:
  - Creator Name (required, text, trimmed)
  - Creator Email (required, valid email format)
- **Primary CTA**: "Create My Invitation"
- **Behavior**:
  - Server-side email and name validation.
  - Generates a unique, collision-resistant, unpredictable invitation slug.
  - Stores invitation in Supabase.
  - Transitions instantly to Screen C02.

### C02 — Invitation Created & Share Hub
- **Elements**:
  - Success confirmation banner ("Your invitation is ready! 🎉").
  - Generated invitation URL (e.g., `https://dateinvite.app/invite/alex-date-9k2x`).
  - "Copy Link" button with instant visual copy feedback ("Copied! ✨").
  - Native Web Share API button (mobile).
  - WhatsApp direct share button pre-filled with friendly teaser copy.
  - Link to view invitation status (C03).

### C03 — Invitation Status
- **Elements**:
  - Invitation status summary (Created timestamp, Link opened status, Response status).
  - Status indicators: `Waiting for response ⏳`, `Accepted! 🎉`, or `Declined gracefully 🕊️`.
  - Recipient's date preferences summary (if accepted).
  - Privacy guard: No private recipient device or personal data exposed unnecessarily.

---

## 5. Recipient Experience (P01–P16)

### Main Date Question Flow (P01–P05)
- **P01 Invitation Loading**: Warm loading envelope animation while invitation data is fetched.
- **P02 Landing / Open Invitation**: Envelope card with intro copy and primary "Open Invitation" CTA.
- **P03 Main Question**: "Would you go on a date with me?"
  - Primary Action: **"YES ❤️"** — triggers celebration burst, transitions to P06.
  - Secondary Action: **"NO 😏"** — triggers playful dodge interaction.
- **P04 Playful NO State**: Evasive button with spring animation. After 3 attempts, a gentle bottom sheet gives a choice between "Actually, YES ❤️" and "No, I mean it".
- **P05 Respectful NO Completion**: If NO is explicitly confirmed, display a warm, appreciative closing message. A `no` response is recorded in the database without sending an email to the creator.

### Questionnaire Flow (P06–P12)
- **P06 Recipient Name**: Dedicated input screen to personalize the date proposal.
- **P07 Date Type**: Interactive choice cards (Coffee, Dinner, Picnic, Adventure, Movie, Surprise).
- **P08 Preferred Day**: Interactive choice cards (Weekday, Friday, Saturday, Sunday, Any).
- **P09 Preferred Time**: Interactive choice cards (Morning, Afternoon, Evening, Night).
- **P10 Date Vibe**: Interactive choice cards (Cozy, Romantic, Fun, Fancy, Chill, Spontaneous).
- **P11 Optional Message**: Personal note or dietary preferences (skippable).
- **P12 Review**: Summary card displaying all chosen answers with an edit option.

### Submission & State Screens (P13–P16)
- **P13 Submitting**: Loading state with pulse animation and double-submit prevention.
- **P14 Success**: Confetti celebration and confirmation ("It's a date! 🎉").
- **P15 Invalid Invitation**: Friendly 404 state when slug is expired or invalid.
- **P16 Submission Error**: Retry screen retaining previously entered data.

---

## 6. Backend & Data Architecture

### Invitations Table
- `id`: UUID primary key
- `slug`: Text unique not null (unpredictable token)
- `creator_name`: Text not null
- `creator_email`: Text not null (PRIVATE)
- `title`: Text default "Would you go on a date with me?"
- `intro_text`: Text
- `active`: Boolean default true
- `created_at`: Timestamp with time zone default now()

### Responses Table
- `id`: UUID primary key
- `invitation_id`: UUID foreign key references `invitations(id)` on delete cascade
- `answer`: Text not null ('yes' | 'no')
- `recipient_name`: Text (nullable for NO)
- `date_type`: Text (nullable)
- `preferred_day`: Text (nullable)
- `preferred_time`: Text (nullable)
- `date_vibe`: Text (nullable)
- `message`: Text (nullable)
- `created_at`: Timestamp with time zone default now()
- `submitted_at`: Timestamp with time zone default now()

---

## 7. Security & Privacy Requirements

1. **Email Isolation**: The recipient client must never receive `creator_email`. The public route `/invite/[slug]` queries only non-sensitive columns (`id, slug, creator_name, title, intro_text, active, created_at`).
2. **Server-Side Validation**: All inputs (`creator_email`, `creator_name`, `slug`, `recipient_name`, questionnaire choices) must be validated server-side.
3. **Unpredictable Slugs**: Slugs must be generated using cryptographically strong randomness or high-entropy nanoid tokens to prevent enumeration attacks.
4. **No Secrets in Client**: Supabase service-role keys and Resend API keys must only be accessed in Node.js / Server Actions.
5. **No Duplicate Responses**: Once an invitation has received an accepted response, further submissions for that invitation must be rejected.
6. **No Recipient Auth Required**: Recipient uses invitation slug as an unauthenticated bearer token.

---

## 8. Email Notification Rules (MVP)

- **YES Response**: Trigger immediate email dispatch to `creator_email` via Resend containing:
  - Creator's name
  - Recipient's name
  - Confirmed answer ("YES ❤️")
  - Structured questionnaire answers (Date Type, Day, Time, Vibe, Note)
  - Invitation identifier & timestamp
- **NO Response**: Save response to database with `answer = 'no'`. Do not send an email notification to the creator in the MVP.

---

## 9. Non-Goals
- No recipient authentication or password creation.
- No public dating feed, directory, or search index.
- No in-app chat or messaging system.
- No algorithmic matching.
