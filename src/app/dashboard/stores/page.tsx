import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { StoreReportsClient } from '@/components/custom/store-reports-client'

export default async function StoreReportsPage() {
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile to resolve company_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, companies(has_physical_stores)')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) redirect('/onboarding')
  if (!profile.companies?.has_physical_stores) {
    // If company doesn't have physical stores, redirect to dashboard or show info
    redirect('/dashboard')
  }

  // Fetch stores
  const { data: stores } = await supabase
    .from('stores')
    .select('id, name')
    .eq('company_id', profile.company_id)

  // Fetch all transactions to aggregate by store
  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, type, store_id')
    .eq('company_id', profile.company_id)

  const storesData = (stores || []).map(store => {
    let receita = 0
    let despesa = 0
    
    transactions?.filter(tx => tx.store_id === store.id).forEach(tx => {
      if (tx.type === 'income') receita += Number(tx.amount)
      else despesa += Number(tx.amount)
    })

    return {
      name: store.name,
      receita,
      despesa,
      lucro: receita - despesa
    }
  })

  // Add "Geral / Sem Loja" if there are transactions without store_id
  const generalTransactions = transactions?.filter(tx => !tx.store_id)
  if (generalTransactions && generalTransactions.length > 0) {
    let receita = 0
    let despesa = 0
    generalTransactions.forEach(tx => {
      if (tx.type === 'income') receita += Number(tx.amount)
      else despesa += Number(tx.amount)
    })
    storesData.push({
      name: 'Sem Loja / Geral',
      receita,
      despesa,
      lucro: receita - despesa
    })
  }

  return (
    <div className="space-y-10 md:space-y-12 font-jakarta max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-1">
             <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
             Análise Multi-Unidade
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-on-surface tracking-tight font-display-hero">
            Relatório por <span className="text-primary italic">Loja.</span>
          </h1>
          <p className="text-on-surface-variant/70 text-sm md:text-base font-medium max-w-xl leading-relaxed">
            Compare o desempenho financeiro de cada unidade física do seu negócio.
          </p>
        </div>
      </div>

      <StoreReportsClient storesData={storesData} />
    </div>
  )
}
