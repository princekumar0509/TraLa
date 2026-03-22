-- ============================================================
-- LabourTrack — Supabase Schema (Supabase Auth native)
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Table: supervisors
-- ============================================================
CREATE TABLE IF NOT EXISTS public.supervisors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id  UUID UNIQUE NOT NULL,
  full_name     TEXT,
  company_name  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.supervisors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "supervisors_select_own" ON public.supervisors
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "supervisors_insert_own" ON public.supervisors
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "supervisors_update_own" ON public.supervisors
  FOR UPDATE USING (auth_user_id = auth.uid());

-- ============================================================
-- Table: labourers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.labourers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supervisor_id UUID NOT NULL,
  name         TEXT NOT NULL,
  phone        TEXT,
  worker_type  TEXT NOT NULL,
  daily_wage   NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_labourers_supervisor ON public.labourers (supervisor_id);
CREATE INDEX IF NOT EXISTS idx_labourers_active ON public.labourers (supervisor_id, is_active);

ALTER TABLE public.labourers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "labourers_select_own" ON public.labourers
  FOR SELECT USING (supervisor_id = auth.uid());

CREATE POLICY "labourers_insert_own" ON public.labourers
  FOR INSERT WITH CHECK (supervisor_id = auth.uid());

CREATE POLICY "labourers_update_own" ON public.labourers
  FOR UPDATE USING (supervisor_id = auth.uid());

CREATE POLICY "labourers_delete_own" ON public.labourers
  FOR DELETE USING (supervisor_id = auth.uid());

-- ============================================================
-- Table: attendance
-- ============================================================
CREATE TABLE IF NOT EXISTS public.attendance (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  labour_id    UUID NOT NULL REFERENCES public.labourers (id) ON DELETE CASCADE,
  supervisor_id UUID NOT NULL,
  date         DATE NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  wage_amount  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT attendance_labour_date_unique UNIQUE (labour_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_supervisor ON public.attendance (supervisor_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance (supervisor_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_labour ON public.attendance (labour_id);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_select_own" ON public.attendance
  FOR SELECT USING (supervisor_id = auth.uid());

CREATE POLICY "attendance_insert_own" ON public.attendance
  FOR INSERT WITH CHECK (supervisor_id = auth.uid());

CREATE POLICY "attendance_update_own" ON public.attendance
  FOR UPDATE USING (supervisor_id = auth.uid());

CREATE POLICY "attendance_delete_own" ON public.attendance
  FOR DELETE USING (supervisor_id = auth.uid());

-- ============================================================
-- Table: payments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  labour_id       UUID NOT NULL REFERENCES public.labourers(id) ON DELETE CASCADE,
  supervisor_id   UUID NOT NULL,
  amount          NUMERIC(10, 2) NOT NULL,
  payment_date    DATE NOT NULL,
  note            TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_labour ON public.payments(labour_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT USING (supervisor_id = auth.uid());

CREATE POLICY "payments_insert_own" ON public.payments
  FOR INSERT WITH CHECK (supervisor_id = auth.uid());

CREATE POLICY "payments_delete_own" ON public.payments
  FOR DELETE USING (supervisor_id = auth.uid());

-- ============================================================
-- Trigger: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER labourers_updated_at
  BEFORE UPDATE ON public.labourers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
