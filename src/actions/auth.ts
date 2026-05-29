'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export interface ActionState {
  error?: string
  success?: boolean
}

export async function login(state: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Preencha todos os campos.' }
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'E-mail ou senha inválidos.' }
  }

  const user = signInData.user
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!profileError && profile?.company_id) {
      redirect('/dashboard')
    } else {
      redirect('/onboarding')
    }
  }

  return { error: 'Falha ao recuperar informações do usuário.' }
}

export async function signup(state: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password || !fullName) {
    return { error: 'Preencha todos os campos.' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function createCompany(state: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const supabase = await createClient()

    const companyName = formData.get('companyName') as string
    const hasPhysicalStores = formData.get('hasPhysicalStores') === 'on'

    if (!companyName) {
      return { error: 'O nome da empresa é obrigatório.' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Usuário não autenticado.' }
    }

    const adminClient = await createAdminClient()

    // Generate unique slug
    let slug = companyName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    if (!slug) {
      slug = `empresa-${Math.floor(1000 + Math.random() * 9000)}`
    }

    // Try to insert company
    let { data: company, error: companyError } = await adminClient
      .from('companies')
      .insert({
        name: companyName,
        slug,
        has_physical_stores: hasPhysicalStores,
      })
      .select()
      .single()

    // If slug unique violation, retry once with random suffix
    if (companyError && companyError.code === '23505') {
      const rand = Math.floor(1000 + Math.random() * 9000).toString()
      slug = `${slug}-${rand}`
      const { data: retryCompany, error: retryError } = await adminClient
        .from('companies')
        .insert({
          name: companyName,
          slug,
          has_physical_stores: hasPhysicalStores,
        })
        .select()
        .single()

      if (retryError) return { error: `Erro ao criar empresa (slug): ${retryError.message}` }
      company = retryCompany
      companyError = null
    }

    if (companyError) {
      return { error: `Erro ao criar empresa: ${companyError.message}` }
    }

    if (!company) {
      return { error: 'Falha ao criar registro da empresa. Tente novamente.' }
    }

    // Update profile with company_id and role = 'admin'
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({
        company_id: company.id,
        role: 'admin',
      })
      .eq('id', user.id)

    if (profileError) {
      return { error: `Erro ao vincular perfil: ${profileError.message}` }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/dashboard', 'layout')
    
    if (hasPhysicalStores) {
      redirect('/onboarding/stores')
    }
    redirect('/dashboard')
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Create company error:', error)
    return { error: error.message || 'Ocorreu um erro inesperado durante a configuração.' }
  }
}
