# Screen Inventory

The DateInvite product comprises **Creator Screens (C01–C03)** and **Public Recipient Screens (P01–P16)**.

---

## 1. Creator Screens

| ID  | Screen Name | Route | Status | Key Inputs / Actions | Output / Display |
|-----|-------------|-------|--------|----------------------|------------------|
| **C01** | Create Invitation | `/` or `/create` | **BUILT** | • Creator Name (text)<br>• Creator Email (email)<br>• "Create My Invitation" CTA | Form validation, loading state, triggers slug generation |
| **C02** | Invitation Created | `/create/success` | **BUILT** | • "Copy Link" button<br>• Native Share button<br>• WhatsApp Share button<br>• Link to C03 Status | Generated invitation URL, copy confirmation tooltip, teaser preview |
| **C03** | Invitation Status | `/invite/[slug]/status` or `/status/[slug]` | PLANNED | • Refresh status CTA<br>• Copy link reminder | Created timestamp, link-opened indicator, response status (Pending / Accepted / Declined), date recap (if accepted) |

---

## 2. Public Recipient Screens

| ID  | Screen Name | Route | Status | Key Inputs / Actions | Output / Display |
|-----|-------------|-------|--------|----------------------|------------------|
| **P01** | Invitation Loading | `/invite/[slug]` | **BUILT** | Auto-advances upon slug validation | Rocking envelope, pulsing rings, progress shimmer bar |
| **P02** | Landing / Open Invitation | `/invite/[slug]` | **BUILT** | • "Open Invitation" CTA | Floating decorative particles, personalized greeting card |
| **P03** | Main Date Question | `/invite/[slug]` | **BUILT** | • "YES ❤️" CTA<br>• "NO 😏" Secondary CTA | Date proposal headline, celebration particles on YES |
| **P04** | Playful NO State | `/invite/[slug]` | **BUILT** | • Cursor/tap hover triggers button dodge<br>• "Actually, YES ❤️"<br>• "No, I mean it" | Evasive spring physics, 3-attempt counter, bottom sheet modal |
| **P05** | Respectful NO Completion | `/invite/[slug]` | **BUILT** | None (terminal state) | Graceful, warm closing card, records NO in DB (no email sent) |
| **P06** | Recipient Name | `/invite/[slug]` | **BUILT** | • Recipient Name (text input)<br>• "Continue" CTA | Name input field with validation, personalization prompt, Step 1 of 6 |
| **P07** | Date Type | `/invite/[slug]` | **BUILT** | • Tap choice card (Coffee, Dinner, Picnic, Adventure, Movie, Surprise) | 6 visual option cards with custom icons, Step 2 of 6 |
| **P08** | Preferred Day | `/invite/[slug]` | **BUILT** | • Tap choice card (Weekday, Friday, Saturday, Sunday, Any) | 5 schedule option cards, Step 3 of 6 |
| **P09** | Preferred Time | `/invite/[slug]` | **BUILT** | • Tap choice card (Morning, Afternoon, Evening, Night) | 4 time-of-day option cards, Step 4 of 6 |
| **P10** | Date Vibe | `/invite/[slug]` | **BUILT** | • Tap choice card (Cozy, Romantic, Fun, Fancy, Chill, Spontaneous) | 6 aesthetic atmosphere option cards, Step 5 of 6 |
| **P11** | Optional Message | `/invite/[slug]` | **BUILT** | • Textarea (special requests/note)<br>• "Review Invitation" or "Skip" CTA | Multiline input, character counter (0/300), Step 6 of 6 |
| **P12** | Review Answers | `/invite/[slug]` | **BUILT** | • "Looks Good — Continue" CTA<br>• Tap any item to edit | Consolidated summary card of all selected answers with edit actions |
| **P13** | Submitting | `/invite/[slug]` | **BUILT** | Processing server action & repository submission | Animated soaring envelope, pulsing glow rings, indeterminate shimmer progress, duplicate lock |
| **P14** | Success Screen | `/invite/[slug]` | **BUILT** | • "Done" CTA<br>• Link to create own invite | Celebration checkmark badge, "It's a date! 🎉", confirmation message, choice recap badge, privacy protection |
| **P15** | Invalid Invitation | `/invite/[slug]` | **BUILT** | • "Back to Home" CTA | Friendly branded 404 message ("This invitation isn't available") for inactive/invalid slugs |
| **P16** | Submission Error | `/invite/[slug]` | **BUILT** | • "Try Again" CTA<br>• "Review Answers" CTA | Friendly retry banner preserving all entered questionnaire data in memory |

---

## 3. Screen Numbering & Actor Alignment Rules

1. **Prefix Legend**:
   - `C` = Creator screens (actor who creates and manages invitations)
   - `P` = Public / Recipient screens (actor who receives and responds to invitations)
2. **Numbering Invariants**:
   - Creator screens are indexed `C01` through `C03`.
   - Public recipient screens are indexed `P01` through `P16`.
   - No duplicate or ambiguous screen IDs may be used.
3. **Data Boundary**:
   - Screens `P01` through `P16` must never have access to `creator_email`.
   - Screen `C03` must never reveal private client telemetry or extraneous recipient device data.
