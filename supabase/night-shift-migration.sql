-- ============================================================
-- Night Shift Migration (v2) — with hourly wages
-- Run this in Supabase SQL Editor AFTER the base schema
-- ============================================================

-- 1. Add night hourly rate to labourers
ALTER TABLE public.labourers
  ADD COLUMN IF NOT EXISTS night_hourly_rate NUMERIC(10, 2) DEFAULT NULL;

-- 2. Add shift and hours_worked to attendance
ALTER TABLE public.attendance
  ADD COLUMN IF NOT EXISTS shift TEXT NOT NULL DEFAULT 'day'
  CHECK (shift IN ('day', 'night'));

ALTER TABLE public.attendance
  ADD COLUMN IF NOT EXISTS hours_worked NUMERIC(4, 1) DEFAULT NULL;

-- 3. Drop old unique constraint, add shift-aware one
ALTER TABLE public.attendance
  DROP CONSTRAINT IF EXISTS attendance_labour_date_unique;

ALTER TABLE public.attendance
  DROP CONSTRAINT IF EXISTS attendance_labour_date_shift_unique;

ALTER TABLE public.attendance
  ADD CONSTRAINT attendance_labour_date_shift_unique
  UNIQUE (labour_id, date, shift);
