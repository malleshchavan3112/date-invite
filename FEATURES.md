# Features

## 1. Creator Features (Two-Sided Architecture)

### C01 — Create Invitation
- [ ] Creator Name field (text, required)
- [ ] Creator Email field (email, required, server-side validated)
- [ ] "Create My Invitation" primary CTA
- [ ] Client & server validation with inline feedback
- [ ] Loading state during creation
- [ ] Unpredictable collision-resistant slug generation

### C02 — Invitation Created & Share Hub
- [ ] Success banner & confirmation animation
- [ ] Generated shareable URL display (`/invite/[slug]`)
- [ ] One-tap "Copy Link" button with copied toast/tooltip
- [ ] Native Web Share API integration (mobile browsers)
- [ ] WhatsApp share button with pre-filled teaser text
- [ ] Direct navigation link to Invitation Status (C03)

### C03 — Invitation Status
- [ ] Invitation creation timestamp display
- [ ] Link opened tracking indicator
- [ ] Response status badge (`Pending ⏳`, `Accepted 🎉`, `Declined 🕊️`)
- [ ] Summary of recipient's date choices (when accepted)
- [ ] Strict privacy: no unnecessary recipient device/personal metadata shown

---

## 2. Recipient Flow Features (P01–P16)

### Main Date Question (P01–P05) — BUILT ✅
- [x] P01: Invitation Loading screen (envelope rocking, shimmer bar, pulsing rings)
- [x] P02: Landing screen (floating particles, envelope card, "Open Invitation" CTA)
- [x] P03: Main Date Question ("Would you go on a date with me?", primary YES CTA, secondary NO)
- [x] P04: Playful NO State (spring physics dodge, 3-attempt escalation, bottom sheet confirmation)
- [x] P05: Respectful NO Completion (warm, graceful closing, no guilt tripping)

### Questionnaire (P06–P12) — PLANNED 📋
- [ ] P06: Recipient Name input (personalized greeting)
- [ ] P07: Date Type selection (Coffee, Dinner, Picnic, Adventure, Movie, Surprise)
- [ ] P08: Preferred Day selection (Weekday, Friday, Saturday, Sunday, Any)
- [ ] P09: Preferred Time selection (Morning, Afternoon, Evening, Night)
- [ ] P10: Date Vibe selection (Cozy, Romantic, Fun, Fancy, Chill, Spontaneous)
- [ ] P11: Optional Message (special request / note, skippable)
- [ ] P12: Review Screen (interactive card reviewing all selections with edit option)

### Submit & State Screens (P13–P16) — PLANNED 📋
- [ ] P13: Submitting state (loading spinner, double-submission lock)
- [ ] P14: Success screen ("It's a date! 🎉", celebration confetti, recap)
- [ ] P15: Invalid Invitation state (graceful 404 for invalid/expired slugs)
- [ ] P16: Submission Error state (retry without losing entered responses)

---

## 3. Backend & Security Features

- [ ] Unpredictable slug generation (crypto / nanoid)
- [ ] Privacy firewall: `creator_email` stripped from all recipient-facing queries
- [ ] Server-side input validation for all creator and recipient inputs
- [ ] Duplicate submission prevention on completed invitations
- [ ] Secure Supabase Server Actions (never exposing service-role keys)
- [ ] Row Level Security (RLS) policies on `invitations` and `responses`
- [ ] Structured HTML/text email notification to `creator_email` on YES submission via Resend
- [ ] Database-only persistence on NO submission (no email dispatched in MVP)

---

## 4. UI Polish & Accessibility

- [x] Terracotta / Rose romance color palette
- [x] Google Fonts integration (`DM Serif Display` + `Inter`)
- [x] Framer Motion spring physics & micro-interactions
- [x] Keyboard navigation & visible focus rings
- [x] `prefers-reduced-motion` compliance
- [x] Mobile (375px/390px), tablet (768px), and desktop (1280px+) responsiveness
