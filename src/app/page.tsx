'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Menu, 
  ShieldCheck, 
  Zap, 
  Wallet, 
  BarChart3, 
  LayoutDashboard, 
  Receipt, 
  Tags, 
  FileSpreadsheet, 
  LineChart,
  ArrowRight,
  ChevronRight,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <TrendingUp className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#0A102F]">
                Caixa<span className="text-[#1677FF]">Up</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm text-slate-500 font-semibold">
              <a href="#funcionalidades" className="hover:text-[#1677FF] transition-colors">Funcionalidades</a>
              <a href="#dre" className="hover:text-[#1677FF] transition-colors">DRE</a>
              <a href="#planos" className="hover:text-[#1677FF] transition-colors">Planos</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-slate-500 hover:text-slate-900 font-semibold transition-colors mr-4">
              Entrar
            </Link>
            <Link href="/signup">
              <button className="bg-[#1677FF] hover:bg-[#005EEB] transition-all text-white px-6 py-3 rounded-full font-semibold shadow-xl shadow-blue-500/20">
                Começar Grátis
              </button>
            </Link>
            <button className="md:hidden p-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-[#1677FF] text-sm font-semibold mb-8">
              <Zap className="w-4 h-4" />
              <span>Finanças com Clareza absoluta</span>
            </div>

            {/* TITLE */}
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[1.1] text-[#0A102F]">
              Decisões baseadas <br />
              <span className="text-[#1677FF]">em dados reais.</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-8 text-xl text-slate-500 leading-relaxed max-w-xl">
              Transforme dados bancários em decisões estratégicas.
              Controle seu DRE, fluxo de caixa e margens com a simplicidade que você sempre quis.
            </p>

            {/* CTAS */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full group bg-[#1677FF] hover:bg-[#005EEB] transition-all text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 shadow-2xl shadow-blue-500/30 text-lg">
                  Criar Conta Grátis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-lg">
                Ver demonstração
              </button>
            </div>

            {/* FEATURES LIST */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-100 pt-10">
              <Feature 
                icon={<ShieldCheck className="w-5 h-5" />}
                title="Segurança"
                desc="Seus dados protegidos por RLS"
              />
              <Feature 
                icon={<Zap className="w-5 h-5" />}
                title="Decisões Ágeis"
                desc="Visualize seu lucro em tempo real"
              />
            </div>
          </motion.div>

          {/* RIGHT COLUMN - DASHBOARD MOCKUP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* DECORATIVE BACKGROUND GLOW */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100 rounded-full blur-[100px] opacity-60" />
            
            {/* DASHBOARD CONTAINER */}
            <div className="relative rounded-[32px] border border-slate-200 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="grid grid-cols-[80px_1fr] h-[600px]">
                
                {/* SIDEBAR */}
                <div className="border-r border-slate-100 bg-slate-50/50 flex flex-col items-center py-8 gap-4">
                  <SidebarIcon icon={<LayoutDashboard size={24} />} active />
                  <SidebarIcon icon={<BarChart3 size={24} />} />
                  <SidebarIcon icon={<Receipt size={24} />} />
                  <SidebarIcon icon={<FileSpreadsheet size={24} />} />
                </div>

                {/* CONTENT AREA */}
                <div className="p-8 overflow-y-auto">
                  {/* TOP HEADER */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-[#0A102F]">Analytics Pro</h3>
                      <p className="text-slate-500 mt-1">Visão Geral do Negócio</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      JD
                    </div>
                  </div>

                  {/* KPI GRID */}
                  <div className="grid grid-cols-2 gap-4">
                    <KPI
                      title="Saldo Total"
                      value="R$ 128.420"
                      positive="+12%"
                    />
                    <KPI
                      title="Entradas"
                      value="R$ 84.200"
                      positive="+8%"
                    />
                    <KPI
                      title="Saídas"
                      value="R$ 12.400"
                      negative="-2%"
                    />
                    <KPI
                      title="Margem Líquida"
                      value="24.2%"
                      positive="Saudável"
                    />
                  </div>

                  {/* CHART AREA */}
                  <div className="mt-8 rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-800">Fluxo de Caixa</h4>
                      <span className="text-sm text-slate-400 font-medium italic">Últimos 30 dias</span>
                    </div>
                    <div className="h-32 flex items-end gap-1">
                      <svg viewBox="0 0 500 200" className="w-full h-full">
                        <path
                          d="M0 170 C 80 120, 120 100, 180 130 S 300 180, 380 90 S 470 40, 500 80"
                          fill="none"
                          stroke="#1677FF"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* TRANSACTIONS LIST */}
                  <div className="mt-8 rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-slate-800">Transações recentes</h4>
                      <button className="text-[#1677FF] font-medium text-sm">Ver todas</button>
                    </div>
                    <div className="space-y-4">
                      <Transaction
                        name="Meta Ads"
                        date="Hoje"
                        value="- R$ 1.240"
                      />
                      <Transaction
                        name="Recebimento Cliente"
                        date="Ontem"
                        value="+ R$ 8.200"
                        positive
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="py-20 border-t border-slate-100 mt-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <TrendingUp className="text-white w-4 h-4" />
              </div>
            <span>CaixaUp © 2026</span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-blue-500 transition-colors">Termos</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Privacidade</a>
            <Link href="/login" className="text-slate-900 hover:text-blue-500 transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// HELPER COMPONENTS FOR THE DESIGN

function Feature({ icon, title, desc }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#1677FF]">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-[#0A102F]">{title}</h4>
        <p className="text-sm text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
  )
}

function SidebarIcon({ icon, active }: any) {
  return (
    <button
      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all
      ${active
          ? "bg-[#1677FF] text-white shadow-xl shadow-blue-500/30"
          : "text-slate-400 hover:bg-slate-100"
      }`}
    >
      {icon}
    </button>
  )
}

function KPI({ title, value, positive, negative }: any) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6">
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <div className="flex items-center justify-between mt-2">
        <h4 className="text-xl font-bold text-slate-900">{value}</h4>
        {positive && (
          <span className="text-green-500 font-bold text-sm bg-green-50 px-2 py-0.5 rounded-lg">{positive}</span>
        )}
        {negative && (
          <span className="text-red-500 font-bold text-sm bg-red-50 px-2 py-0.5 rounded-lg">{negative}</span>
        )}
      </div>
    </div>
  )
}

function Transaction({ name, date, value, positive }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center
          ${positive ? "bg-green-50 text-green-500" : "bg-slate-50 text-slate-500"}`}>
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
          <p className="text-sm text-slate-500 font-medium">{date}</p>
        </div>
      </div>
      <span className={`font-bold text-sm ${positive ? "text-green-500" : "text-slate-900"}`}>
        {value}
      </span>
    </div>
  )
}
