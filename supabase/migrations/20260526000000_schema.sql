-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES TABLE
CREATE TABLE public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROFILES TABLE
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies ON DELETE CASCADE,
    email text NOT NULL,
    full_name text,
    role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CATEGORIES TABLE
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES public.companies ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('income', 'expense')),
    color text NOT NULL DEFAULT '#6b7280',
    icon text NOT NULL DEFAULT 'Tag',
    is_default boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(company_id, name, type)
);

-- 4. TRANSACTIONS TABLE
CREATE TABLE public.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES public.companies ON DELETE CASCADE NOT NULL,
    category_id uuid REFERENCES public.categories ON DELETE SET NULL,
    description text NOT NULL,
    amount numeric(12, 2) NOT NULL,
    type text NOT NULL CHECK (type IN ('income', 'expense')),
    date date NOT NULL DEFAULT CURRENT_DATE,
    payment_method text NOT NULL DEFAULT 'pix' CHECK (payment_method IN ('pix', 'credit_card', 'bank_slip', 'cash', 'other')),
    status text NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending')),
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SUBSCRIPTIONS TABLE
CREATE TABLE public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES public.companies ON DELETE CASCADE NOT NULL,
    status text NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'unpaid', 'trialing')),
    plan_id text NOT NULL CHECK (plan_id IN ('empresario', 'contador', 'premium')),
    abacatepay_customer_id text,
    abacatepay_subscription_id text,
    current_period_end timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. INDEXES FOR PERFORMANCE
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX idx_categories_company_id ON public.categories(company_id);
CREATE INDEX idx_transactions_company_id ON public.transactions(company_id);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_subscriptions_company_id ON public.subscriptions(company_id);

-- 7. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_companies BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_categories BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_transactions BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_subscriptions BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. HELPER FUNCTION TO GET CURRENT USER'S COMPANY_ID
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid AS $$
    SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 9. HELPER TRIGGER TO CREATE DEFAULT CATEGORIES FOR NEW COMPANY
CREATE OR REPLACE FUNCTION public.create_default_categories_for_company()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.categories (company_id, name, type, color, icon, is_default) VALUES
    -- Incomes
    (NEW.id, 'Vendas de Produtos', 'income', '#10b981', 'ShoppingBag', true),
    (NEW.id, 'Prestação de Serviços', 'income', '#3b82f6', 'Briefcase', true),
    (NEW.id, 'Rendimentos Financeiros', 'income', '#8b5cf6', 'TrendingUp', true),
    (NEW.id, 'Outras Receitas', 'income', '#6b7280', 'DollarSign', true),
    -- Expenses
    (NEW.id, 'Fornecedores', 'expense', '#f59e0b', 'Truck', true),
    (NEW.id, 'Salários e Encargos', 'expense', '#ef4444', 'Users', true),
    (NEW.id, 'Impostos e Contribuições', 'expense', '#ec4899', 'Percent', true),
    (NEW.id, 'Aluguel e Condomínio', 'expense', '#14b8a6', 'Home', true),
    (NEW.id, 'Marketing e Vendas', 'expense', '#f97316', 'Megaphone', true),
    (NEW.id, 'Ferramentas e SaaS', 'expense', '#06b6d4', 'Cpu', true),
    (NEW.id, 'Despesas Administrativas', 'expense', '#6366f1', 'Settings', true),
    (NEW.id, 'Pró-Labore', 'expense', '#a855f7', 'UserCheck', true),
    (NEW.id, 'Outras Despesas', 'expense', '#9ca3af', 'CreditCard', true);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_default_categories
AFTER INSERT ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.create_default_categories_for_company();

-- 10. HELPER TRIGGER TO CREATE PROFILE FOR NEW AUTH USER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'member'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Companies Policies
CREATE POLICY "Users can read their own company" ON public.companies
    FOR SELECT USING (id = public.get_user_company_id());

CREATE POLICY "Admin users can update their own company" ON public.companies
    FOR UPDATE USING (
        id = public.get_user_company_id() AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

CREATE POLICY "Authenticated users can create companies" ON public.companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Profiles Policies
CREATE POLICY "Users can view profiles in the same company or their own profile" ON public.profiles
    FOR SELECT USING (company_id = public.get_user_company_id() OR id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can update profiles in their company" ON public.profiles
    FOR UPDATE USING (
        company_id = public.get_user_company_id() AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

-- Categories Policies
CREATE POLICY "Users can select categories of their company" ON public.categories
    FOR SELECT USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can insert categories for their company" ON public.categories
    FOR INSERT WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can update categories of their company" ON public.categories
    FOR UPDATE USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can delete categories of their company" ON public.categories
    FOR DELETE USING (company_id = public.get_user_company_id());

-- Transactions Policies
CREATE POLICY "Users can select transactions of their company" ON public.transactions
    FOR SELECT USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can insert transactions for their company" ON public.transactions
    FOR INSERT WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can update transactions of their company" ON public.transactions
    FOR UPDATE USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can delete transactions of their company" ON public.transactions
    FOR DELETE USING (company_id = public.get_user_company_id());

-- Subscriptions Policies
CREATE POLICY "Users can view subscriptions of their company" ON public.subscriptions
    FOR SELECT USING (company_id = public.get_user_company_id());
