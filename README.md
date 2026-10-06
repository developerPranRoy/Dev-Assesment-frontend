# DevAssess — Developer Assessment & Coding Platform (Frontend)

A production-ready Next.js 14 App Router frontend for the DevAssess platform.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | TanStack Query v5 + Zustand |
| Forms | React Hook Form + Zod |
| Auth | Custom JWT + Middleware |
| Payment | Stripe Checkout |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | Sonner |

## Roles

| Role | Access |
|---|---|
| **Admin** | Platform stats, user management, audit logs |
| **Company** | Problems, assessments, invitations, credits |
| **Candidate** | Take assessments, view results |

## Quick Demo

Visit `/login` and use the one-click demo buttons:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@platform.dev` | `Password123!` |
| Company Owner | `owner@acme.dev` | `Password123!` |
| Candidate | `candidate@example.dev` | `Password123!` |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://dev-assesment-backend.onrender.com/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_CREDIT_PRICE_USD=0.5
```

## Backend

Live API: `https://dev-assesment-backend.onrender.com/api/v1`
