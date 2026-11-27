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
- [Email & account recovery](#email--account-recovery)
- [Google sign-in (optional)](#google-sign-in-optional)
- [API integration](#api-integration)
- [Payments (Stripe test mode)](#payments-stripe-test-mode)
- [Scripts](#scripts)
- [Deployment (Vercel)](#deployment-vercel)
- [Production security checklist](#production-security-checklist)
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
│   │   ├── token/           # Session → short-lived JWT for the Express API
│   │   └── upload-image/    # Auth-gated ImgBB proxy (key stays server-side)
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
│   └── imgbb.ts             # client helper → /api/upload-image
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
| `IMGBB_KEY` | ImgBB API key — **server-only**, must not use the `NEXT_PUBLIC_` prefix | — |
| `RESEND_API_KEY` | Resend API key for verification and password-reset emails | `re_…` |
| `EMAIL_FROM` | Verified sender address | `MentorLagbe <onboarding@resend.dev>` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional social login) | — |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | — |
| `NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED` | Public UI flag — set `true` to show Google buttons (inlined at build time) | `false` |

> Image uploads go through `POST /api/upload-image`: the client sends only the file, the server verifies the Better Auth session and calls ImgBB with `IMGBB_KEY`. The key is never present in the browser bundle.

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
- Rate limiting is enabled (`rateLimit`): sign-in/sign-up are limited to 3 requests per 10 seconds; password-reset and verification-email requests to 3 per 60 seconds.

---

## Email & account recovery

Better Auth sends two kinds of email through Resend (server-side only):

| Flow | Pages | Behaviour |
|---|---|---|
| Forgot password | `/forgot-password`, `/reset-password?token=…` | One-time token, 15-minute expiry, all existing sessions revoked on reset, generic response so emails cannot be enumerated |
| Email verification | `/verify-email` | Verification email sent on sign-up, 15-minute expiry, auto sign-in after verification |

> **`requireEmailVerification` is intentionally NOT enabled.** Existing accounts were created without verification, so gating sign-in would lock them out. Enable it only after every user has been verified/backfilled. Verification currently informs users and lets them resend the link.

Resend setup: create an API key, use `onboarding@resend.dev` as `EMAIL_FROM` while testing, then verify your own domain (SPF/DKIM) before production.

If `RESEND_API_KEY` is missing or the provider fails, the send is skipped with a server-side warning so sign-up and password-reset endpoints never return a 500. Set up monitoring to catch these warnings in production.

---

## Google sign-in (optional)

1. Google Cloud Console → create a project → configure the **OAuth consent screen**.
2. Create an **OAuth client ID** of type *Web application*.
3. Add this exact authorized redirect URI:
   ```
   https://mentor-lagbe-iota.vercel.app/api/auth/callback/google
   ```
   For local development also add `http://localhost:3000/api/auth/callback/google`.
4. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED=true` in Vercel. `BETTER_AUTH_URL` must exactly match the site origin.
5. Deploy. The Google buttons **and their "OR" separator** appear only when the public flag is `true`; the auth config is built conditionally, so a deploy without the keys does not break email/password auth. For local testing, mirror all three values in `.env.local` and restart the dev server.

### Role handling

- Google profiles do not contain a role. The sign-up page offers two buttons — **Continue as Student** and **Continue as Tutor** — which set a short-lived cookie read by the `user.create.before` database hook. A newly created Google user therefore gets the chosen role (`student` by default). Admin is never assignable this way.
- Existing users linking Google keep their current MongoDB role. Their `emailVerified` must be `true`, otherwise Better Auth returns `account_not_linked` (by design, to prevent account takeover). Set it for trusted existing accounts before asking them to use Google.

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

## Production security checklist

Before exposing the app to real users:

1. **Never use `NEXT_PUBLIC_` for secrets.** Only `NEXT_PUBLIC_API_URL` is public. `IMGBB_KEY` is read only inside `src/app/api/upload-image/route.ts`, which checks the Better Auth session before uploading.
2. **Rotate exposed credentials.** If a secret was ever committed or shipped with a `NEXT_PUBLIC_` prefix, treat it as compromised: create a new ImgBB key, set it as `IMGBB_KEY` in Vercel, then delete the old `NEXT_PUBLIC_IMGBB_KEY`.
3. **Rotate `BETTER_AUTH_SECRET` and `JWT_SECRET`.** Changing `BETTER_AUTH_SECRET` invalidates all existing sessions (users sign in again). `JWT_SECRET` must be changed in **Vercel and Render at the same time**, otherwise authenticated API calls fail.
4. **Rotate the MongoDB password** and update `MONGODB_URI` in both Vercel and Render together.
5. **Do not publish admin credentials** in this repository or in any public documentation. Keep them in a secret manager and submit them only through the private assignment channel.
6. **Separate environments.** Use different secrets and a different database for Preview/Staging and Production. Test destructive changes in staging first.
7. **Keep dependencies patched.** Run `npm audit` regularly and update Next.js/Better Auth when security fixes are released.

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
