# Architecture

## 1. System Flow Diagram

```
CREATOR
   ↓
CREATE INVITATION
   ↓
UNIQUE LINK
   ↓
RECIPIENT
   ↓
QUESTIONNAIRE
   ↓
RESPONSE
   ↓
CREATOR EMAIL
```

---

## 2. Two-Sided Actor Model

```
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│            CREATOR CONTEXT             │     │           RECIPIENT CONTEXT            │
│  Routes: / or /create                  │     │  Routes: /invite/[slug]                │
│  Screens: C01, C02, C03                │     │  Screens: P01–P16                      │
│  Data Input: creator_name, email       │     │  Data Input: recipient_name, answers   │
│  Permissions: Create, view link, status│     │  Permissions: Read public invite, reply│
└───────────────────┬────────────────────┘     └───────────────────┬────────────────────┘
                    │                                              │
                    ▼                                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                               NEXT.JS SERVER ACTIONS / API                            │
│  • createInvitation(data) ➔ validates email, generates crypto slug, writes DB         │
│  • getPublicInvitation(slug) ➔ strips creator_email, returns public invitation fields │
│  • submitResponse(data) ➔ validates inputs, prevents duplicate, triggers email        │
└───────────────────┬──────────────────────────────────────────────┬────────────────────┘
                    │                                              │
                    ▼                                              ▼
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│          SUPABASE (POSTGRES)           │     │            RESEND (EMAIL)              │
│  • invitations table                   │     │  • Server-side dispatch only           │
│  • responses table                     │     │  • Structured HTML/text date summary   │
│  • Row-Level Security (RLS)            │     │  • Dispatched ONLY on YES response     │
└────────────────────────────────────────┘     └────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | React Server Components, Server Actions, optimal routing |
| Language | TypeScript (strict) | Complete end-to-end type safety |
| Styling | Tailwind CSS v3 | Custom design system tokens, responsive utilities |
| Animation | Framer Motion 11 | Spring physics, fluid micro-interactions, reduced-motion |
| Database | Supabase (PostgreSQL) | Relational integrity, foreign keys, RLS policies |
| Email Service | Resend | Reliable transactional email delivery with custom HTML templates |
| Deployment | Vercel | Seamless Next.js deployment, edge network, environment isolation |

---

## 4. Application Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, viewport)
│   ├── globals.css             # Tailwind base & CSS design tokens
│   ├── page.tsx                # Creator landing / creation flow (C01)
│   ├── create/
│   │   ├── page.tsx            # Dedicated creator page (C01)
│   │   └── success/page.tsx    # Invitation created & share hub (C02)
│   └── invite/
│       └── [slug]/
│           ├── layout.tsx      # Recipient layout (no indexing metadata)
│           ├── page.tsx        # Recipient flow controller (P01–P16)
│           └── status/page.tsx # Invitation status screen (C03)
├── components/
│   ├── creator/                # Creator flow components (C01–C03)
│   │   ├── CreateInvitationForm.tsx
│   │   ├── ShareHub.tsx
│   │   └── InvitationStatusView.tsx
│   ├── invitation/             # Public recipient entry (P01–P05)
│   │   ├── LoadingScreen.tsx
│   │   ├── LandingScreen.tsx
│   │   ├── DateQuestion.tsx
│   │   ├── PlayfulNo.tsx
│   │   ├── NoCompletion.tsx
│   │   └── InvitationFlow.tsx
│   ├── questionnaire/          # Questionnaire screens (P06–P12)
│   │   ├── NameStep.tsx
│   │   ├── DateTypeStep.tsx
│   │   ├── PreferredDayStep.tsx
│   │   ├── PreferredTimeStep.tsx
│   │   ├── DateVibeStep.tsx
│   │   ├── MessageStep.tsx
│   │   └── ReviewStep.tsx
│   ├── submission/             # State screens (P13–P16)
│   │   ├── SubmittingScreen.tsx
│   │   ├── SuccessScreen.tsx
│   │   ├── InvalidInvitationScreen.tsx
│   │   └── SubmissionErrorScreen.tsx
│   └── ui/                     # Reusable design system primitives
│       ├── PrimaryButton.tsx
│       ├── SecondaryButton.tsx
│       ├── ChoiceCard.tsx
│       ├── ProgressBar.tsx
│       └── PageTransition.tsx
├── lib/
│   ├── supabase/               # Supabase client & server action utilities
│   │   ├── client.ts           # Public/browser client (anon key)
│   │   ├── server.ts           # Server client (service role, isolated)
│   │   └── actions.ts          # Server actions for creation & submission
│   ├── email/                  # Resend integration & email templates
│   │   ├── resend.ts
│   │   └── templates/DateResponseEmail.tsx
│   ├── validation/             # Zod or typed validators for inputs
│   └── mock.ts                 # Local development mock data
└── types/
    └── index.ts                # Canonical TypeScript definitions
```

---

## 5. Security & Privacy Architecture

### Privacy Firewall (Creator Email)
- The recipient client must **never** be supplied with `creator_email`.
- When fetching an invitation for `/invite/[slug]`, the database query selects exclusively:
  ```sql
  SELECT id, slug, creator_name, title, intro_text, active, created_at
  FROM invitations
  WHERE slug = :slug AND active = true;
  ```
- `creator_email` is retained strictly on the server for the subsequent email dispatch.

### Unpredictable Slug Generation
- Slugs are generated using high-entropy random identifiers (e.g. `alex-date-x8k2mp9`).
- Prevents enumeration attacks where malicious actors guess URLs to view other invitations.

### Server-Side Validation
- Creator email is validated with strict regex and format checks.
- Recipient inputs (name, date types, days, times, vibes) are validated against strict enums.
- Text messages are sanitized to prevent script injection.

### Credential Protection
- Supabase `SERVICE_ROLE_KEY` and `RESEND_API_KEY` are stored strictly in server-side environment variables (`.env.local`).
- Neither secret is ever prefixed with `NEXT_PUBLIC_` or bundled in client JS.
- All email sending logic is executed in Node.js server runtimes.

### Duplicate Submission Guard
- A unique constraint or server-side conditional check ensures each invitation receives only one final response.
