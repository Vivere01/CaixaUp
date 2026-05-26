import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { TransactionsClient } from '@/components/custom/transactions-client'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TransactionsPage({ searchParams }: PageProps) {
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

  // Await searchParams for Next.js 15
  const resolvedParams = await searchParams
  const openNewModal = resolvedParams.new === 'true'

  // Fetch transactions (with categories joined)
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .eq('company_id', profile.company_id)
    .order('date', { ascending: false })

  // Fetch categories (to show in dropdown filters/forms)
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('company_id', profile.company_id)
    .order('name', { ascending: true })

  return (
    <TransactionsClient 
      initialTransactions={transactions || []} 
      categories={categories || []} 
      openNewModalOnMount={openNewModal}
    />
  )
}
