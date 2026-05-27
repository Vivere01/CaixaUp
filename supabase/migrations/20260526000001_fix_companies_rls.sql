-- Fix RLS policy for companies table to allow insertion during onboarding
DROP POLICY IF EXISTS "Authenticated users can create companies" ON public.companies;

CREATE POLICY "Authenticated users can create companies" ON public.companies
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Ensure profiles can be updated during onboarding if the user is the owner
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());
