'use client'

import React, { useActionState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, Mail, User, Sparkles, CheckCircle } from 'lucide-react'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

const initialState = {
  error: '',
  success: false,
}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState)

  // Handle successful signup view
  if (state?.success) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans antialiased">
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl text-center shadow-2xl relative z-10">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Conta criada com sucesso!</h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Seu cadastro foi concluído. Verifique seu e-mail para confirmar a conta e iniciar seu onboarding financeiro.
          </p>

          <Link href="/login" className="w-full block">
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-6 rounded-xl transition shadow-lg shadow-emerald-500/10">
              Ir para o Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans antialiased text-white">
      {/* Brand Side (Left) - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-16 flex-col justify-between overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px]" />
        
        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="CaixaUp Logo" 
            width={40} 
            height={40} 
            className="rounded-xl"
          />
          <span className="font-bold text-2xl tracking-tight">
            Caixa<span className="text-emerald-400">Up</span>
          </span>
        </Link>

        {/* Big visual showcase */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Adesão Imediata</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight mb-4">
            Tenha clareza financeira em minutos.
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Seja bem-vindo ao CaixaUp. Descubra de onde vem cada centavo e para onde vai seu lucro de forma rápida e visual.
          </p>

          <div className="space-y-4">
            {[
              'DRE automático gerado em um clique',
              'Leitura simplificada para tomadores de decisão',
              'Integração nativa de pagamentos com AbacatePAY',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                  ✓
                </div>
                <span className="text-sm text-slate-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-slate-500 text-xs">
          © {new Date().getFullYear()} CaixaUp. Todos os direitos reservados.
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
            <h2 className="text-3xl font-bold tracking-tight">Criar sua conta</h2>
            <p className="text-slate-400 mt-2">
              Cadastre-se para obter clareza sobre o caixa da sua empresa.
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
              <Label htmlFor="fullName" className="text-slate-300 font-semibold">Nome Completo</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                  className="pl-10 bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-semibold">E-mail Corporativo</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nome@empresa.com.br"
                  required
                  className="pl-10 bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 font-semibold">Senha</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Crie uma senha forte (mín. 6 caracteres)"
                  required
                  minLength={6}
                  className="pl-10 bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-6 rounded-xl transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {isPending ? 'Criando Conta...' : 'Começar Agora'}
              {!isPending && <ArrowRight className="h-4 w-4 text-slate-950" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition font-semibold">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
