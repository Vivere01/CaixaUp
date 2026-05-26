import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CategoriesClient } from '@/components/custom/categories-client'

export default async function CategoriesPage() {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch profile to resolve company_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) {
    redirect('/onboarding')
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('company_id', profile.company_id)
    .order('is_default', { ascending: false })
    .order('name', { ascending: true })

  return <CategoriesClient initialCategories={categories || []} />
}
