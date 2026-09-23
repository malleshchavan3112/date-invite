# DateInvite — Product Overview

## 1. Executive Summary
DateInvite is a playful, mobile-first dating invitation platform designed to transform standard date proposals into delightful, memorable interactive experiences. Rather than sending a boring text message, an **Invitation Creator** can craft a personalized invitation link in seconds and share it directly with their crush or partner. 

The **Invitation Recipient** experiences a high-polish, romantic, and playfully evasive web interaction that culminates in an optional date questionnaire. Upon acceptance, the creator is automatically notified by email with all preferred date details.

---

## 2. The Two Actors

DateInvite operates on a two-sided invitation model:

```
┌─────────────────────────────────────────────────────────────┐
│                    1. INVITATION CREATOR                    │
│   • Opens DateInvite (/)                                    │
│   • Enters Name & Email                                     │
│   • Generates unique invitation slug                        │
│   • Copies & shares private URL                             │
│   • Tracks invitation status (C03)                          │
│   • Receives formatted date response email                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                      Shares Private Link
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   2. INVITATION RECIPIENT                   │
│   • Opens /invite/[slug] (No login required)                │
│   • Experiences animated envelope landing (P01–P02)         │
│   • Interacts with Main Question (P03–P05)                  │
│   • "YES ❤️" unlocks Date Questionnaire (P06–P12)            │
│   • Chooses date type, day, time, vibe & note               │
│   • Submits structured response (P13–P14)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. High-Level User Journey

1. **Creation**:
   - Creator visits `/` (or `/create`).
   - Inputs their name (e.g. "Alex") and email (e.g. "alex@example.com").
   - Clicks **"Create My Invitation"** (Screen C01).
   - Backend generates an unpredictable slug (e.g. `alex-special-date-7x9q`) and stores the invitation.
   - Creator sees Screen C02 with shareable link, one-tap copy, and native/WhatsApp sharing buttons.

2. **Recipient Experience**:
   - Recipient opens `https://dateinvite.app/invite/[slug]`.
   - **P01 Loading**: Warm envelope rocking animation while resolving the invitation.
   - **P02 Landing**: Elegant card with personalized greeting: *"Someone thinks you are wonderful and wants to invite you somewhere special."*
   - **P03 Main Question**: *"Would you go on a date with me?"* with glowing **YES ❤️** button and playful **NO 😏** button.
   - **P04 Playful NO (Dodge)**: If clicked, the NO button playfully runs away with spring physics. After 3 attempts, a gentle humorous bottom sheet asks if they are really sure.
   - **P05 Respectful NO Completion**: If the recipient confirms NO, they are shown a warm, graceful closing screen. A `no` answer is saved to the database; no notification email is sent.
   - **P06–P12 Questionnaire (YES path)**:
     - P06: Recipient Name
     - P07: Date Type (Coffee, Dinner, Picnic, Adventure, Movie, Surprise)
     - P08: Preferred Day (Weekday, Friday, Saturday, Sunday, Any)
     - P09: Preferred Time (Morning, Afternoon, Evening, Night)
     - P10: Date Vibe (Cozy, Romantic, Fun, Fancy, Chill, Spontaneous)
     - P11: Optional Message / Special note
     - P12: Review all answers on a consolidated card
   - **P13 Submitting & P14 Success**: Recipient confirms submission, sees celebration confetti and *"It's a date! 🎉"*.

3. **Notification & Privacy**:
   - Server securely processes the submission.
   - For a **YES** submission: An elegant email containing the recipient's name and all questionnaire preferences is dispatched to `creator_email` via Resend.
   - For a **NO** response: Stored in Supabase for creator status tracking; no email is sent.
   - **Privacy Firewall**: The creator's email address is never returned in recipient-facing queries or exposed in frontend code/DOM.

---

## 4. Key Value Propositions

- **Zero Barrier to Entry**: No authentication required for either creator or recipient. Creating an invitation takes under 30 seconds.
- **Privacy First**: Recipient never sees creator email; recipient personal data is protected and associated only via private invitation IDs.
- **Emotional Delight**: High-end micro-interactions, warm terracotta/rose color palette, smooth spring animations, and playful copy make it memorable.
- **Actionable Responses**: Instead of vague "let's hang out sometime", the creator receives concrete date preferences (activity, day, time, vibe).

---

## 5. Screen Roadmap

- **Creator Screens**: `C01` (Create), `C02` (Created & Share), `C03` (Status)
- **Recipient Screens**: `P01`–`P05` (Entry & Question — **BUILT**), `P06`–`P12` (Questionnaire & Review), `P13`–`P14` (Submit & Success), `P15`–`P16` (Error States)
