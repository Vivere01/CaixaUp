'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createStore(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  if (!name) return { error: 'O nome da loja é obrigatório.' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuário não autenticado.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) return { error: 'Perfil empresarial ausente.' }

  const { error } = await supabase
    .from('stores')
    .insert({
      company_id: profile.company_id,
      name,
    })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function finishStoreOnboarding() {
  redirect('/dashboard')
}
