'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(data: {
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
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
    .from('categories')
    .insert({
      company_id: profile.company_id,
      name: data.name,
      type: data.type,
      color: data.color,
      icon: data.icon,
      is_default: false
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Já existe uma categoria com este nome e tipo.' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard/categories')
  revalidatePath('/dashboard/transactions')
  return { success: true }
}

export async function updateCategory(id: string, data: {
  name: string
  color: string
  icon: string
}) {
  const supabase = await createClient()

  // Prevent editing default categories
  const { data: category } = await supabase
    .from('categories')
    .select('is_default')
    .eq('id', id)
    .single()

  if (category?.is_default) {
    return { error: 'Categorias padrão não podem ser modificadas.' }
  }

  const { error } = await supabase
    .from('categories')
    .update({
      name: data.name,
      color: data.color,
      icon: data.icon
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/categories')
  revalidatePath('/dashboard/transactions')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  // Prevent deleting default categories
  const { data: category } = await supabase
    .from('categories')
    .select('is_default')
    .eq('id', id)
    .single()

  if (category?.is_default) {
    return { error: 'Categorias padrão não podem ser excluídas.' }
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/categories')
  revalidatePath('/dashboard/transactions')
  return { success: true }
}
