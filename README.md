# DateInvite

A playful, mobile-first dating invitation platform with a two-sided invitation model.

---

## Two Actors

1. **Invitation Creator**:
   - Opens DateInvite (`/` or `/create`).
   - Enters their name and email.
   - Generates a unique, unpredictable invitation slug.
   - Copies and shares the generated private link.
   - Receives structured email responses when the recipient accepts.

2. **Invitation Recipient**:
   - Opens `/invite/[slug]` (no account required).
   - Experiences the interactive landing and main question flow (P01–P05).
   - Answers the date question:
     - **YES ❤️**: Proceeds to a fun date questionnaire (P06–P12) and submits preferences (P13–P14).
     - **NO 😏**: Experiences a playful evasive interaction (P04) and respectful completion state (P05).
   - Never sees creator's private contact details.

---

## Core Product Flow

```
CREATOR
   ↓
CREATE INVITATION (C01)
   ↓
UNIQUE LINK (C02)
   ↓
RECIPIENT OPENS (/invite/[slug])
   ↓
QUESTION & QUESTIONNAIRE (P01–P12)
   ↓
RESPONSE SUBMITTED (P13–P14)
   ↓
CREATOR NOTIFIED VIA EMAIL
```

---

## Source of Truth

Read these in order:
1. `README.md` — Project summary, actors, and rules
2. `PRD.md` — Product requirements document
3. `PRODUCT_OVERVIEW.md` — Executive product overview and journey
4. `FEATURES.md` — Complete feature checklist
5. `USER_FLOW.md` — Step-by-step user journeys for creator and recipient
6. `DESIGN_SYSTEM.md` — Visual tokens, typography, and motion guidelines
7. `SCREEN_INVENTORY.md` — Full catalog of Creator (C01–C03) and Public (P01–P16) screens
8. `ARCHITECTURE.md` — System architecture, data flow, and layers
9. `DATABASE_SCHEMA.md` — Supabase PostgreSQL schema, indexes, and RLS policies
10. `IMPLEMENTATION_PLAN.md` — Phased development execution plan
11. `PROJECT_STATUS.md` — Real-time progress tracker and current phase
12. `DECISIONS.md` — Log of architectural, UX, and technical decisions

---

## Agent & Security Rules

- **Two-Sided Architecture**: Always respect the boundary between Creator and Recipient.
- **Privacy Firewall**: Never expose `creator_email` in recipient-facing client data or API responses.
- **Unpredictable Slugs**: Generate collision-resistant, unpredictable invitation slugs.
- **Server-Side Validation**: Validate creator email and recipient inputs strictly server-side.
- **No Recipient Login**: Recipient access requires zero authentication or friction.
- **Server-Side Secrets**: Never expose Supabase service-role keys or email provider credentials in client code.
- **Playful NO Safety**: The playful NO interaction may be animated/movable, but it must never secretly record a genuine NO response as YES.
- **Email Rules**: Send structured response emails to creator only for YES submissions; save confirmed NO to database only in MVP.
- **Preserve Existing UI**: Preserve existing P01–P05 implementation and visual tokens.
