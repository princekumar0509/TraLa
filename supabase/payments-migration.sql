-- Create payments table for tracking wage payments to labourers
CREATE TABLE IF NOT EXISTS public.payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  labour_id       UUID NOT NULL REFERENCES public.labourers(id) ON DELETE CASCADE,
  supervisor_id   UUID NOT NULL,
  amount          NUMERIC(10, 2) NOT NULL,
  payment_date    DATE NOT NULL,
  note            TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_labour ON public.payments(labour_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT USING (supervisor_id = auth.uid());

CREATE POLICY "payments_insert_own" ON public.payments
  FOR INSERT WITH CHECK (supervisor_id = auth.uid());

CREATE POLICY "payments_delete_own" ON public.payments
  FOR DELETE USING (supervisor_id = auth.uid());
