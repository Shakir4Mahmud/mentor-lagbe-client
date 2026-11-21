# MentorLagbe — Client

MentorLagbe is a tuition and mentorship marketplace that connects students with verified tutors. This repository is the **Next.js client** (App Router). The REST API lives in a separate Express repository: [`mentor-lagbe-server`](https://github.com/Shakir4Mahmud/mentor-lagbe-server).

**Live:** https://mentor-lagbe-iota.vercel.app

---

## Table of contents

- [Tech stack](#tech-stack)
- [Features](#features)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Local development](#local-development)
- [Authentication & authorization](#authentication--authorization)
- [API integration](#api-integration)
- [Payments (Stripe test mode)](#payments-stripe-test-mode)
- [Scripts](#scripts)
- [Deployment (Vercel)](#deployment-vercel)
- [Troubleshooting](#troubleshooting)

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Partial Prerendering, `proxy.ts`) |
| UI | React 19, Tailwind CSS 4, shadcn/ui + Radix UI, Lucide, Motion |
| Auth | Better Auth with MongoDB adapter (email/password + sessions) |
| Data | MongoDB Atlas (shared with the Express server) |
| Notifications | Sonner (global toaster, bottom-right) |
| Payments | Stripe Checkout (redirect flow, test mode) |
| Hosting | Vercel |

---

## Features

- Public tuition browsing with search and filters (subject, class level, mode, pagination).
- Role-based registration (**student** / **tutor**) and email/password sign-in.
- Role-aware post-login redirects, plus support for a sanitized `?redirect=` parameter.
- Three protected dashboards:
  - **Student** — overview, applications, saved tuitions, reviews, Pro upgrade.
  - **Tutor** — overview, post tuition, my tuitions, applicants, Pro upgrade.
  - **Admin** — overview, users & role management, tuition approval, transactions.
- Profile management (name, phone, bio, image) with role/plan fields protected server-side.
- Stripe Checkout for Pro plans with a server-side verification step.
- Dark/light theme, responsive layout, loading skeletons and empty states.

---

## Project structure

```
src/
├── app/
│   ├── (main)/              # Public pages: home, tuitions, tuition detail, pricing, payment
│   ├── (auth)/              # sign-in, sign-up (RedirectIfLoggedIn guard)
│   ├── dashboard/           # Protected layouts + student/tutor/admin sections
│   ├── api/
│   │   ├── auth/[...all]/   # Better Auth catch-all handler
│   │   └── token/           # Session → short-lived JWT for the Express API
│   ├── error.tsx
│   ├── not-found.tsx
│   └── layout.tsx           # Root layout + global Toaster
├── components/              # auth, dashboard, home, tuitions, payment, shared, ui
├── lib/
│   ├── api.ts               # publicFetch / apiFetch helpers
│   ├── auth.ts              # Better Auth instance + resilient Mongo client
│   ├── auth-client.ts       # Better Auth React client
│   ├── session.ts           # getCurrentUser / requireRole
│   ├── dashboard-path.ts    # role → dashboard path + redirect sanitizer
│   ├── dashboard-nav.ts     # role-based navigation config
│   └── imgbb.ts             # image upload helper
├── proxy.ts                 # Next.js 16 proxy: cookie gate for /dashboard, /payment
└── types/                   # Shared TypeScript types
```

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Used for | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection (Better Auth + session/JWT bridge) | `mongodb+srv://user:pass@cluster.mongodb.net/MentorLagbe` |
| `BETTER_AUTH_SECRET` | Signs/validates Better Auth cookies | 32+ random characters |
| `BETTER_AUTH_URL` | Canonical client origin used by Better Auth | `http://localhost:3000` / Vercel URL |
| `JWT_SECRET` | Must match the server's `JWT_SECRET` | 64 random characters |
| `NEXT_PUBLIC_API_URL` | Base URL of the Express server | `http://localhost:5000` / Render URL |
| `NEXT_PUBLIC_IMGBB_KEY` | ImgBB API key for image uploads | — |

> The server requires its own variables (`STRIPE_SECRET_KEY`, `CLIENT_URL`, etc.). See the server README.

> `.env.example` is intentionally committed; `.env`, `.env.local` and other real env files are ignored.

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env.local

# 3. Start the Express API (separate repository) on port 5000
#    in C:\MentorLagbe\mentor-lagbe-server: npm run dev

# 4. Start the client
npm run dev
```

Open http://localhost:3000.

Default local ports: client `3000`, API `5000`. Make sure `NEXT_PUBLIC_API_URL` points to the API and `BETTER_AUTH_URL` points to the client.

---

## Authentication & authorization

- **Better Auth** owns the user/session/account collections in MongoDB. Passwords are hashed by Better Auth.
- Sign-up only accepts `student` or `tutor`. A database hook forces the role and `plan: "free"`, so a client cannot self-assign `admin`.
- Profile updates strip `role` and `plan`.
- `getCurrentUser()` (`src/lib/session.ts`) resolves the session at **request time** (`await connection()`) so auth never runs during prerendering.
- `RoleGuard` and the dashboard layout enforce roles again on the server.
- `proxy.ts` only checks for the presence of the session cookie; real validation happens in server components.
- `/api/token` exchanges a valid Better Auth session for a 1-hour JWT (`{ email, name }`). The Express server verifies the JWT and reads the **role from MongoDB**, never from the token.

---

## API integration

`src/lib/api.ts` exposes two helpers:

| Helper | Use | Auth |
|---|---|---|
| `publicFetch(path)` | Public data (tuitions, public stats) fetched in server components | None |
| `apiFetch(path, options)` | Mutations and protected data from client components | Adds `Authorization: Bearer <token>` via `/api/token` |

All API paths are relative to `NEXT_PUBLIC_API_URL`. Examples: `/api/tuitions`, `/api/applications`, `/api/bookmarks`, `/api/tutor/*`, `/api/admin/*`, `/api/payments/*`, `/api/reviews/*`.

---

## Payments (Stripe test mode)

1. Pricing page shows **Pro Student — 99 BDT** and **Pro Tutor — 499 BDT**.
2. Client calls `POST /api/payments/create-checkout-session` (no amount is sent).
3. The server derives the price from the authenticated user's role and returns a Stripe Checkout URL.
4. After payment, Stripe redirects to `/payment/success?session_id=…`.
5. `PaymentSuccess` calls `POST /api/payments/verify`; the server retrieves the session from Stripe, checks the email and `payment_status`, records the payment and upgrades the plan.

The project uses a **`sk_test_…` key**. Test card: `4242 4242 4242 4242` with any future expiry and CVC.

> There is no Stripe webhook yet; plan activation relies on the client reaching the success page.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (warnings allowed) |
| `npm run typecheck` | TypeScript check without emitting files |
| `npm test` | Static checks: typecheck + lint |

These checks do not modify the database or call Stripe.

---

## Deployment (Vercel)

1. Import this repository into Vercel (framework: **Next.js**).
2. Add all environment variables from the table above under **Settings → Environment Variables** for Production (and Preview if needed).
3. Deploy. Build command: `npm run build`; output: Next.js default.
4. When environment variables change, redeploy with **Use existing build cache** unchecked.

> The Express server cannot run on Vercel as a long-lived process; deploy it on Render (see the server README).

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `MongoTopologyClosedError` on sign-in | Vercel function instance has a stale MongoDB connection | `src/lib/auth.ts` recreates a closed topology automatically; also verify Atlas **Network Access** allows `0.0.0.0/0` |
| Tuitions show "Could not load…" | `NEXT_PUBLIC_API_URL` wrong/unset | Point it at the live Render server URL |
| Auth works locally but not on Vercel | Env mismatch or stale deploy | Compare all env values, then redeploy without cache |
| `FAILED_TO_GET_SESSION` on dashboard | Session lookup ran during prerender | Keep `await connection()` at the top of `getCurrentUser()` |
| `429` while probing auth | Vercel rate limiting | Wait a minute; not an application bug |

---

## Related repositories

- Server: https://github.com/Shakir4Mahmud/mentor-lagbe-server
