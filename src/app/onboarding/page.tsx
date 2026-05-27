'use client'

import React, { useActionState, startTransition } from 'react'
import { createCompany } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const initialState = {
  error: '',
}

export default function OnboardingPage() {
  const [state, formAction, isPending] = useActionState(createCompany, initialState)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface font-jakarta relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 space-y-8">
        {/* Header/Logo */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="material-symbols-outlined text-primary text-[40px]">bar_chart_4_bars</span>
            <span className="text-3xl font-extrabold text-primary font-display-hero">CaixaUp</span>
          </Link>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-on-surface">Configuração Final</h1>
            <p className="text-on-surface-variant text-sm">
              Crie o ambiente da sua empresa para ter acesso total ao painel.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-outline-variant/20 p-10 rounded-[2.5rem] shadow-xl shadow-primary/5 space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/5 border border-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">domain</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface">Dados da Empresa</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {state?.error && (
              <div className="bg-error-container/50 border border-error/20 text-error p-4 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined text-[20px]">error</span>
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-on-surface font-semibold ml-1">Nome da Empresa</Label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">business</span>
                </span>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Ex: CaixaUp Consultoria LTDA"
                  required
                  className="pl-12 py-6 bg-surface-container-lowest border-outline-variant/30 text-on-surface placeholder-outline focus:border-primary focus:ring-primary/20 rounded-2xl transition-all"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium mt-2 px-1">
                Este nome será usado para gerar seus relatórios, notas e filtros de DRE.
              </p>
            </div>

            {/* List of automatic features configured during onboarding */}
            <div className="bg-surface p-6 rounded-3xl space-y-4 border border-outline-variant/10">
              <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest block">O que estamos preparando:</span>
              <div className="space-y-3">
                {[
                  { icon: 'lock', text: 'Segurança Bancária via RLS' },
                  { icon: 'category', text: 'Categorias financeiras essenciais' },
                  { icon: 'analytics', text: 'Estrutura de DRE inteligente' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-on-surface font-medium">
                    <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-on-primary font-bold py-4 rounded-full hover:bg-primary-container transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Configurando...
                </span>
              ) : (
                <>
                  Criar minha Empresa
                  <span className="material-symbols-outlined">rocket_launch</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-on-surface-variant/40 text-[10px] font-bold uppercase tracking-[0.2em]">
          Ambiente Seguro • Encriptação de Ponta a Ponta
        </div>
      </div>
    </div>
  )
}
