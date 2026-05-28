import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ImportClient } from '@/components/custom/import-client'

export default async function ImportPage() {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch profile to resolve company_id and physical store status
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, companies(has_physical_stores)')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) {
    redirect('/onboarding')
  }

  // Fetch categories for the import mapping step
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, type')
    .eq('company_id', profile.company_id)
    .order('name', { ascending: true })

  // Fetch stores if applicable
  const { data: stores } = await supabase
    .from('stores')
    .select('id, name')
    .eq('company_id', profile.company_id)

  return (
    <ImportClient 
      categories={categories || []} 
      hasPhysicalStores={(profile.companies as any)?.has_physical_stores || false}
      stores={stores || []}
    />
  )
}
