# User Flow

## Complete Two-Sided Flow Overview

```
                      CREATOR JOURNEY
                            │
               ┌────────────▼────────────┐
               │  C01: Create Invitation │
               │  - Creator Name         │
               │  - Creator Email        │
               └────────────┬────────────┘
                            │ "Create My Invitation"
               ┌────────────▼────────────┐
               │  C02: Invitation Ready  │
               │  - Generated URL        │
               │  - Copy / Share / WA    │
               └────────────┬────────────┘
                            │ (Shares Link)
                            │
════════════════════════════╪════════════════════════════
                            │
                     RECIPIENT JOURNEY
                            │
               ┌────────────▼────────────┐
               │  P01: Loading Screen    │
               │  (Validates Slug)       │
               └────────────┬────────────┘
                            │ Auto-advances
               ┌────────────▼────────────┐
               │  P02: Landing Screen    │
               │  ("Open Invitation")    │
               └────────────┬────────────┘
                            │ Taps CTA
               ┌────────────▼────────────┐
               │  P03: Main Question     │
               │  "Date with me?"        │
               └──────┬────────────┬─────┘
                      │            │
             "YES ❤️" │            │ "NO 😏"
                      │            ▼
                      │  ┌───────────────────┐
                      │  │ P04: Playful NO   │
                      │  │ (Spring Dodge)    │
                      │  └─────────┬─────────┘
                      │            │ 3 Attempts → Modal
                      │    ┌───────┴───────┐
                      │    │               │
                      │  "Actually YES"   "No, I mean it"
                      │    │               ▼
                      │    │     ┌───────────────────┐
                      │    │     │ P05: NO Complete  │
                      │    │     │ (Save to DB only) │
                      │    │     └───────────────────┘
                      ▼    ▼
          ┌─────────────────────────┐
          │   QUESTIONNAIRE FLOW    │
          │   P06: Recipient Name   │
          │   P07: Date Type        │
          │   P08: Preferred Day    │
          │   P09: Preferred Time   │
          │   P10: Date Vibe        │
          │   P11: Optional Message │
          │   P12: Review Answers   │
          └────────────┬────────────┘
                       │ "Confirm & Send"
          ┌────────────▼────────────┐
          │   P13: Submitting       │
          └────────────┬────────────┘
                       │ Server-side save & email
          ┌────────────▼────────────┐
          │   P14: Success Screen   │
          │   ("It's a date! 🎉")   │
          └─────────────────────────┘
                       │
═══════════════════════╪═════════════════════════════════
                       │
             CREATOR NOTIFICATION
                       │
          ┌────────────▼────────────┐
          │ Structured Resend Email │
          │ sent to creator_email   │
          └─────────────────────────┘
```

---

## Detailed Flows

### Flow 1 — Creator: Create & Share Invitation
1. Creator navigates to `/` (or `/create`).
2. **C01: Create Invitation**:
   - Enters `creator_name` and `creator_email`.
   - Clicks **"Create My Invitation"**.
   - Client validates fields; server generates an unpredictable slug and creates record in `invitations`.
3. **C02: Invitation Created**:
   - Displays success message with generated link: `https://dateinvite.app/invite/[slug]`.
   - Creator can tap "Copy Link", use the native mobile share sheet, or send directly via WhatsApp.
4. **C03: Invitation Status**:
   - Creator can view live status of their link (Created, Opened, Answered).

---

### Flow 2 — Recipient: Open Invitation
1. Recipient taps shared link: `/invite/[slug]`.
2. **P01: Loading**:
   - Validates slug via server action.
   - Only public fields are loaded (`creator_name`, `title`, `intro_text`, `active`). `creator_email` is never sent to the client.
   - If invalid slug → redirect to **P15: Invalid Invitation**.
3. **P02: Landing**:
   - Displays animated envelope card and personalized intro text.
   - Recipient taps **"Open Invitation"**.

---

### Flow 3 — Recipient: Main Question
1. **P03: Date Question**:
   - Displays headline: *"Would you go on a date with me?"*.
   - Primary option: **"YES ❤️"**
   - Secondary option: **"NO 😏"**
2. **YES Path**:
   - Triggers celebration particle burst animation.
   - Advances to **P06: Name**.
3. **NO Path**:
   - Transitions to **P04: Playful NO**.
   - NO button dodges cursor/tap using spring physics.
   - After 3 attempts, bottom sheet modal appears: *"Nice try 😏 Are you really sure?"*
   - Option A: *"Actually, YES ❤️"* → Advances to **P06: Name**.
   - Option B: *"No, I mean it"* → Saves `answer="no"` to DB and advances to **P05: Respectful NO Completion**.
   - *Rule*: Never record a NO as YES.

---

### Flow 4 — Recipient: Questionnaire (YES Path)
1. **P06: Recipient Name**: Text input for the recipient's name.
2. **P07: Date Type**: Choice cards (Coffee, Dinner, Picnic, Adventure, Movie, Surprise).
3. **P08: Preferred Day**: Choice cards (Weekday, Friday, Saturday, Sunday, Any).
4. **P09: Preferred Time**: Choice cards (Morning, Afternoon, Evening, Night).
5. **P10: Date Vibe**: Choice cards (Cozy, Romantic, Fun, Fancy, Chill, Spontaneous).
6. **P11: Optional Message**: Freeform text note for special requests or dietary considerations (skippable).
7. **P12: Review**: Consolidated recap card of all selections with tap-to-edit capability.

---

### Flow 5 — Recipient: Submit & Success
1. Recipient taps **"Confirm & Send"** on P12.
2. **P13: Submitting**:
   - Shows loading spinner, disables repeated clicks.
   - Server Action validates inputs and checks that the invitation is active and not already submitted.
   - Inserts record into `responses` table with `answer="yes"`.
   - Triggers Resend API call to send structured email to `creator_email`.
3. **P14: Success**:
   - Displays celebratory animation and confirmation card: *"It's a date! 🎉"*.
   - Informs recipient that the creator has been notified.

---

### Flow 6 — Error States
1. **P15: Invalid Invitation**:
   - Triggered when slug does not exist, is inactive, or has been revoked.
   - Shows a friendly, comforting error screen with zero private system information leaked.
2. **P16: Submission Error**:
   - Triggered if network or database error occurs during submission.
   - Allows immediate retry without losing previously entered questionnaire answers.
