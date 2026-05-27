'use client'

import React, { useActionState } from 'react'
import Link from 'next/link'
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
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface font-jakarta">
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        
        <div className="w-full max-w-md bg-white border border-outline-variant/20 p-10 rounded-[2.5rem] text-center shadow-xl shadow-primary/5 relative z-10">
          <div className="mx-auto w-20 h-20 bg-tertiary-container/10 border border-tertiary/20 text-tertiary rounded-3xl flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-[40px]">check_circle</span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-on-surface font-display-hero">Conta criada!</h2>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
            Seu cadastro foi concluído. Verifique seu e-mail para confirmar a conta e iniciar sua gestão financeira.
          </p>

          <Link href="/login" className="w-full block">
            <button className="w-full bg-primary text-on-primary font-bold py-4 rounded-full hover:bg-primary-container transition-all shadow-lg shadow-primary/20 active:scale-95">
              Ir para o Login
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center font-jakarta p-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="material-symbols-outlined text-primary text-[40px]">bar_chart_4_bars</span>
            <span className="text-3xl font-extrabold text-primary font-display-hero">CaixaUp</span>
          </Link>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-on-surface">Crie sua conta</h1>
            <p className="text-on-surface-variant text-sm">
              Comece agora sua jornada para uma gestão financeira clara.
            </p>
          </div>
        </div>

        {/* Signup Form Container */}
        <div className="bg-white border border-outline-variant/20 p-10 rounded-[2.5rem] shadow-xl shadow-primary/5">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-error-container/50 border border-error/20 text-error p-4 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined text-[20px]">error</span>
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-on-surface font-semibold ml-1">Nome Completo</Label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                  className="pl-12 py-6 bg-surface-container-lowest border-outline-variant/30 text-on-surface placeholder-outline focus:border-primary focus:ring-primary/20 rounded-2xl transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-on-surface font-semibold ml-1">E-mail Corporativo</Label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </span>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nome@empresa.com.br"
                  required
                  className="pl-12 py-6 bg-surface-container-lowest border-outline-variant/30 text-on-surface placeholder-outline focus:border-primary focus:ring-primary/20 rounded-2xl transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-on-surface font-semibold ml-1">Senha</Label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Crie uma senha forte"
                  required
                  minLength={6}
                  className="pl-12 py-6 bg-surface-container-lowest border-outline-variant/30 text-on-surface placeholder-outline focus:border-primary focus:ring-primary/20 rounded-2xl transition-all"
                />
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
                  Criando conta...
                </span>
              ) : (
                <>
                  Começar Agora
                  <span className="material-symbols-outlined">person_add</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
            <p className="text-sm text-on-surface-variant font-medium">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-on-surface-variant/40 text-[10px] font-bold uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} CaixaUp • Gestão Financeira Inteligente
        </div>
      </div>
    </div>
  )
}
