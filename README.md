# TraLa — Smart Attendance for Field Teams

A mobile-first labour attendance and payment management app built for supervisors and contractors to track their field workforce.

## Features

| Feature | Description |
|---|---|
| Auth | Supabase Auth — Google OAuth + Phone OTP |
| Labour Management | Add, edit, delete, search, filter by worker type |
| Attendance | Mark Present/Absent per labourer per day (IST) |
| History | View & filter by date range and labourer, monthly summary |
| Dashboard | Today's summary — present, absent, unmarked, wage payable |
| Labourer Profile | Full track record with attendance stats and timeline |
| Payment Tracker | Record payments, view balance due, delete with confirmation |
| PWA | Installable on mobile with standalone mode |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | Supabase Auth (Google OAuth + Phone OTP) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| State | Zustand |
| Icons | Lucide React |
| Notifications | React Hot Toast |

## Setup Guide

### 1. Clone and install

```bash
git clone https://github.com/princekumar0509/TraLa.git
cd TraLa
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `schema.sql`
3. Copy your **Project URL** and **anon key** from Settings > API

### 3. Configure Auth Providers

In your Supabase dashboard:

1. **Authentication > Providers > Google** — enable and add your OAuth Client ID + Secret from Google Cloud Console
2. **Authentication > Providers > Phone** — enable and add Twilio credentials (optional, for SMS OTP)
3. **Authentication > URL Configuration** — set Site URL and add redirect URL: `https://yourdomain.com/auth/callback`

### 4. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Add the environment variables in your Vercel project settings.

## Database Architecture

- **`labourers`** — Worker records with `supervisor_id` (UUID from Supabase Auth)
- **`attendance`** — UNIQUE(labour_id, date), upsert pattern, IST dates
- **`payments`** — Payment records per labourer with amount, date, and notes

All tables have RLS enabled. Every policy uses `auth.uid()` from Supabase Auth.

## Project Structure

```
src/
  app/
    (auth)/sign-in/      # Google OAuth + Phone OTP sign-in
    (auth)/sign-up/      # Redirects to sign-in
    auth/callback/       # OAuth code exchange
    dashboard/           # Main dashboard
    labourers/           # List + manage labourers
    labourers/add/       # Add new labourer
    labourers/[id]/      # Labourer profile + track record
    attendance/          # Mark daily attendance
    history/             # Attendance history + filters
  components/
    ui/                  # ConfirmModal, LoadingSkeleton, EmptyState, DateInput
    layout/              # PageHeader, BottomNav
    labour/              # LabourCard, LabourForm, LabourList, PaymentBottomSheet,
                         # AttendanceTimeline, FinancialSummary
    attendance/          # AttendanceCard, SaveButton
    dashboard/           # SummaryCard
  hooks/                 # useUser, useLabourers, useAttendance, useDashboard,
                         # useLabourProfile
  lib/                   # supabase client, supabase-server client, utils, constants
  store/                 # Zustand attendance store
  types/                 # TypeScript interfaces
```

## Key Design Decisions

1. **IST Dates** — All dates produced client-side using `getISTDate()`, never `now()` server-side
2. **Upsert Pattern** — Attendance uses `UPSERT ON CONFLICT (labour_id, date)`
3. **Wage Snapshot** — `wage_amount` baked in at save time (present = daily_wage, absent = 0)
4. **Native Auth** — Supabase Auth with `auth.uid()` for RLS, no custom JWT functions needed

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT
