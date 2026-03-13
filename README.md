# SaaS Starter (Next.js + Supabase)

## Setup

1. Copy env template:

```bash
cp .env.example .env.local
```

2. In Supabase Dashboard (`Project Settings` -> `API`), copy:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Run the app:

```bash
npm install
npm run dev
```

## How to register/login

- Open `http://localhost:3000/signup` to create a new account.
- Open `http://localhost:3000/login` to sign in.
- After successful login, user is redirected to `/dashboard`.

> If signup succeeds but does not log you in immediately, check your email and confirm your account (depends on Supabase Auth email confirmation settings).

## Password recovery

- Open `/forgot-password` and submit your email.
- Open the reset link sent by Supabase email and set a new password on `/reset-password`.
