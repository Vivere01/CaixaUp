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

  // Fetch profile to resolve company_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
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

  return (
    <ImportClient categories={categories || []} />
  )
}
