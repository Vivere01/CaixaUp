'use client'

import React, { useActionState, startTransition } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, Mail, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react'
import { login } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans antialiased text-white">
      {/* Brand Side (Left) - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-16 flex-col justify-between overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px]" />
        
        {/* Logo/Header */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="CaixaUp Logo" 
            width={40} 
            height={40} 
            className="rounded-xl shadow-lg shadow-emerald-500/20"
          />
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Caixa<span className="text-emerald-400">Up</span>
          </span>
        </Link>

        {/* Big visual showcase */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fintech de Clareza Financeira</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight mb-4">
            Gerencie seu negócio sem planilhas confusas.
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Feito para empresários brasileiros que buscam clareza nas decisões de faturamento, margem e DRE em tempo real.
          </p>

          {/* Micro Card Dashboard simulation */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl relative">
            <div className="absolute top-0 right-0 p-3 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs rounded-bl-2xl rounded-tr-2xl flex items-center gap-1 font-semibold">
              <TrendingUp className="h-3 w-3" />
              +18.4%
            </div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Faturamento Mensal</span>
            <h3 className="text-3xl font-black mt-1 text-white">R$ 84.250,00</h3>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Lucro Líquido: R$ 24.500</span>
              </div>
              <span>Margem: 29.1%</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center gap-3 text-slate-500 text-sm">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Isolamento de dados via RLS com criptografia de ponta</span>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950 relative">
        <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
        
        <div className="w-full max-w-md relative z-10">
          {/* Logo on Mobile */}
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <Image 
              src="/logo.png" 
              alt="CaixaUp Logo" 
              width={36} 
              height={36} 
              className="rounded-lg shadow-lg shadow-emerald-500/20"
            />
            <span className="font-bold text-xl tracking-tight text-white">
              Caixa<span className="text-emerald-400">Up</span>
            </span>
          </Link>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h2>
            <p className="text-slate-400 mt-2">
              Acesse sua conta para ver seus relatórios e DRE.
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-semibold">E-mail</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemplo@empresa.com.br"
                  required
                  className="pl-10 bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-300 font-semibold">Senha</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Sua senha secreta"
                  required
                  className="pl-10 bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-6 rounded-xl transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {isPending ? 'Entrando...' : 'Entrar na Conta'}
              {!isPending && <ArrowRight className="h-4 w-4 text-slate-950" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Ainda não tem acesso?{' '}
            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 transition font-semibold">
              Criar conta experimental
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
