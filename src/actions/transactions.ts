'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTransaction(data: {
  description: string
  amount: number
  type: 'income' | 'expense'
  category_id: string | null
  date: string
  payment_method: string
  status: 'paid' | 'pending'
  notes?: string
  cost_center?: 'fixed' | 'variable'
  store_id?: string | null
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuário não autenticado.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) return { error: 'Perfil empresarial ausente.' }

  const { error } = await supabase
    .from('transactions')
    .insert({
      company_id: profile.company_id,
      category_id: data.category_id || null,
      description: data.description,
      amount: data.amount,
      type: data.type,
      date: data.date,
      payment_method: data.payment_method,
      status: data.status,
      notes: data.notes || '',
      cost_center: data.cost_center || 'variable',
      store_id: data.store_id || null,
    })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard/dre')
  return { success: true }
}

export async function updateTransaction(id: string, data: {
  description: string
  amount: number
  type: 'income' | 'expense'
  category_id: string | null
  date: string
  payment_method: string
  status: 'paid' | 'pending'
  notes?: string
  cost_center?: 'fixed' | 'variable'
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('transactions')
    .update({
      category_id: data.category_id || null,
      description: data.description,
      amount: data.amount,
      type: data.type,
      date: data.date,
      payment_method: data.payment_method,
      status: data.status,
      notes: data.notes || '',
      cost_center: data.cost_center || 'variable',
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard/dre')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard/dre')
  return { success: true }
}

export async function bulkCreateTransactions(transactions: {
  description: string
  amount: number
  type: 'income' | 'expense'
  category_id: string | null
  date: string
  payment_method: string
  status: 'paid' | 'pending'
  notes?: string
  store_id?: string | null
}[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuário não autenticado.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) return { error: 'Perfil empresarial ausente.' }

  const itemsToInsert = transactions.map(tx => ({
    company_id: profile.company_id,
    category_id: tx.category_id || null,
    description: tx.description,
    amount: tx.amount,
    type: tx.type,
    date: tx.date,
    payment_method: tx.payment_method || 'other',
    status: tx.status || 'paid',
    notes: tx.notes || '',
    store_id: tx.store_id || null,
  }))

  const { error } = await supabase
    .from('transactions')
    .insert(itemsToInsert)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard/dre')
  return { success: true }
}

export async function clearTransactions() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuário não autenticado.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) return { error: 'Perfil empresarial ausente.' }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('company_id', profile.company_id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard/dre')
  return { success: true }
}
