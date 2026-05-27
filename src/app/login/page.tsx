'use client'

import React, { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center font-sans p-6 text-[#0b1c30]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0057c2]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-[#0057c2]/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="material-symbols-outlined text-[#0057c2] text-[40px]">bar_chart_4_bars</span>
            <span className="text-3xl font-extrabold text-[#0057c2]">CaixaUp</span>
          </Link>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
            <p className="text-[#424754] text-sm font-medium">
              Entre com suas credenciais para acessar sua conta.
            </p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-white border border-[#c2c6d7]/30 p-10 rounded-[2.5rem] shadow-xl shadow-[#0057c2]/5">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#ba1a1a] p-4 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined text-[20px]">error</span>
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0b1c30] font-bold ml-1">E-mail</Label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#727786] group-focus-within:text-[#0057c2] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </span>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemplo@empresa.com.br"
                  required
                  className="pl-12 py-7 bg-[#f8f9ff] border-[#c2c6d7]/30 text-[#0b1c30] placeholder-[#727786] focus:border-[#0057c2] focus:ring-[#0057c2]/20 rounded-2xl transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-[#0b1c30] font-bold">Senha</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#0057c2] font-bold hover:underline transition"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#727786] group-focus-within:text-[#0057c2] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Sua senha secreta"
                  required
                  className="pl-12 py-7 bg-[#f8f9ff] border-[#c2c6d7]/30 text-[#0b1c30] placeholder-[#727786] focus:border-[#0057c2] focus:ring-[#0057c2]/20 rounded-2xl transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0057c2] text-white font-bold py-4 rounded-full hover:bg-[#0d6eef] transition-all shadow-lg shadow-[#0057c2]/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:pointer-events-none text-lg"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Entrar na Conta
                  <span className="material-symbols-outlined">login</span>
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#c2c6d7]/10 text-center">
            <p className="text-sm text-[#424754] font-medium">
              Ainda não tem acesso?{' '}
              <Link href="/signup" className="text-[#0057c2] font-bold hover:underline">
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[#424754]/60 text-xs font-semibold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          <span>Isolamento de dados via RLS com criptografia</span>
        </div>
      </div>
    </div>
  )
}
