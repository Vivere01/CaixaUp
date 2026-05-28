-- Add has_physical_stores to companies
ALTER TABLE public.companies ADD COLUMN has_physical_stores boolean DEFAULT false;

-- Create stores table
CREATE TABLE public.stores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES public.companies ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(company_id, name)
);

-- Add store_id to transactions
ALTER TABLE public.transactions ADD COLUMN store_id uuid REFERENCES public.stores ON DELETE SET NULL;

-- Enable RLS on stores
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select stores of their company" ON public.stores
    FOR SELECT USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can insert stores for their company" ON public.stores
    FOR INSERT WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can update stores of their company" ON public.stores
    FOR UPDATE USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can delete stores of their company" ON public.stores
    FOR DELETE USING (company_id = public.get_user_company_id());

-- Add updated_at trigger to stores
CREATE TRIGGER set_updated_at_stores BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
