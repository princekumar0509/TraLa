# LabourTrack 🏗️

A mobile-first labour attendance management app for supervisors and contractors.

## Tech Stack

- **Next.js 16** + TypeScript + Tailwind CSS v4
- **Clerk v6** — Authentication (Google + Phone OTP)
- **Supabase** — Database + Row Level Security
- **Zustand** — Attendance state management
- **react-hot-toast** — Notifications

---

## Setup Guide

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `schema.sql`
3. Copy your **Project URL** and **anon key** from Settings → API

### 2. Clerk Setup

1. Create an app at [clerk.com](https://clerk.com)
2. Enable **Google** and **Phone OTP** sign-in methods
3. Create a **JWT Template** named exactly `supabase`:
   - Template body: `{ "sub": "{{user.id}}" }`
4. Copy your **Publishable Key** and **Secret Key**
5. Copy the **JWKS URL** from your Clerk dashboard

### 3. Supabase JWT Config

1. Go to Supabase → **Settings → API → JWT Settings**
2. Paste the Clerk **JWKS URL** into the JWT Secret configuration

### 4. Environment Variables

Update `.env.local` with your actual credentials:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxx
```

### 5. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all environment variables in your Vercel project settings.

---

## Features

| Feature | Description |
|---|---|
| 🔐 Auth | Clerk login via Google or Phone OTP |
| 👷 Labour Management | Add, edit, delete, search labourers |
| ✅ Attendance | Mark Present/Absent per labourer per day (IST) |
| 📅 History | View & filter by date range and labourer |
| 📊 Dashboard | Today's summary: present, absent, wage payable |
| 💰 Wage Tracking | Wage snapshotted at attendance mark time |

---

## Database Architecture

- **`supervisors`** — Clerk user profile linked via `clerk_user_id`
- **`labourers`** — Worker records with `supervisor_id` (Clerk user ID text)  
- **`attendance`** — UNIQUE(labour_id, date), upsert pattern, IST dates

All tables have RLS enabled. Every policy uses `auth.clerk_user_id()` which reads `sub` from the Clerk JWT.

---

## Key Design Decisions

1. **IST Dates**: All dates produced client-side using `getISTDate()` — never `now()` server-side
2. **Upsert Pattern**: Attendance always uses `UPSERT ON CONFLICT (labour_id, date)` 
3. **Wage Snapshot**: `wage_amount` baked in at save time (present = daily_wage, absent = 0)
4. **Clerk JWT**: Passed via custom `fetch` interceptor on every Supabase request
# TraLa
