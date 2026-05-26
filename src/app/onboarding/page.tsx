'use client'

import React, { useActionState, startTransition } from 'react'
import { createCompany } from '@/actions/auth'
import { ArrowRight, Building2, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans antialiased relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[130px]" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="w-full max-w-lg relative z-10 space-y-8">
        {/* Header/Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="font-extrabold text-xl text-slate-950">C</span>
          </div>
          <span className="font-bold text-2xl tracking-tight">
            Caixa<span className="text-emerald-400">Up</span>
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Vamos configurar sua conta</h2>
            <p className="text-slate-400 text-sm">
              Crie o ambiente da sua empresa para ter acesso total ao painel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-slate-300 font-semibold">Nome da Empresa</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Building2 className="h-4 w-4" />
                </span>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Ex: CaixaUp Consultoria LTDA"
                  required
                  className="pl-10 bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Este nome será usado para gerar seus relatórios, notas e filtros de DRE.
              </p>
            </div>

            {/* List of automatic features configured during onboarding */}
            <div className="bg-slate-950/50 border border-slate-850 p-4 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">O que estamos preparando:</span>
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Espaço de trabalho isolado via RLS (Segurança Bancária)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Instalação padrão de 13 categorias financeiras essenciais</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Estrutura de DRE inteligente em conformidade contábil</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-6 rounded-xl transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {isPending ? 'Configurando tudo...' : 'Criar minha Empresa'}
              {!isPending && <ArrowRight className="h-4 w-4 text-slate-950" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
