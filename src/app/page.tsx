'use client'

import React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Cpu, 
  FileSpreadsheet, 
  PieChart, 
  LineChart,
  Users, 
  Zap, 
  CheckCircle2, 
  Receipt,
  FileCheck,
  ChevronRight,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <div className="min-h-screen bg-[#000] text-white font-sans selection:bg-emerald-400 selection:text-slate-900 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      {/* Header / Apple Style Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <Image 
              src="/logo.png" 
              alt="CaixaUp Logo" 
              width={32} 
              height={32} 
              className="rounded-lg transition-transform group-hover:scale-110"
            />
            <span className="font-bold text-xl tracking-tight">
              Caixa<span className="text-emerald-400">Up</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] text-white/60 font-medium">
            {['Funcionalidades', 'Como Funciona', 'DRE', 'Planos'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-white text-black hover:bg-white/90 text-[13px] font-bold px-4 py-1.5 rounded-full transition-all">
                Começar
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - The "Antigravity" Experience */}
      <section className="relative pt-40 pb-32 px-6 flex flex-col items-center text-center z-10">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[12px] font-bold tracking-wide uppercase"
          >
            <Zap className="h-3 w-3" />
            <span>Finanças sem fricção</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.8] text-white"
          >
            Clareza <br />
            <span className="bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
              Financeira.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white/50 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed tracking-tight"
          >
            A plataforma de gestão que transforma dados brutos em decisões estratégicas. 
            DRE, fluxo de caixa e margens com a precisão que seu negócio exige.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-black px-10 py-7 rounded-2xl text-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
                Experimentar Agora
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#dashboard-preview" className="group flex items-center gap-2 text-white font-bold hover:text-emerald-400 transition-colors">
              Ver demonstração
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Product Showcase - Floating UI Elements */}
      <section id="dashboard-preview" className="px-6 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-[#111] border border-white/10 rounded-[3rem] p-4 md:p-16 shadow-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Mock Dashboard Header */}
            <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-10">
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase tracking-[0.3em] text-emerald-400">Inteligência Financeira</p>
                <h2 className="text-4xl font-bold tracking-tight">Performance em Tempo Real</h2>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                <Activity className="h-6 w-6 text-emerald-400" />
              </div>
            </div>

            {/* Floating KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { label: 'Faturamento', value: 'R$ 124.500', trend: '+12%', color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
                { label: 'Custos', value: 'R$ 48.200', trend: '-2%', color: 'text-white/80', bg: 'bg-white/5' },
                { label: 'Margem', value: '61.2%', trend: 'Saudável', color: 'text-blue-400', bg: 'bg-blue-400/5' },
              ].map((kpi, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`${kpi.bg} border border-white/5 p-8 rounded-[2rem] backdrop-blur-md`}
                >
                  <p className="text-[12px] font-bold text-white/40 uppercase tracking-widest">{kpi.label}</p>
                  <p className={`text-4xl font-black mt-3 ${kpi.color}`}>{kpi.value}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className={`h-1.5 w-1.5 rounded-full ${kpi.color.replace('text', 'bg')}`} />
                    <span className="text-[11px] font-bold opacity-40 uppercase tracking-wider">{kpi.trend} este mês</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* DRE Mock */}
            <div className="bg-black/60 rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group/dre">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/dre:opacity-20 transition-opacity">
                <FileCheck className="h-24 w-24 text-emerald-400" />
              </div>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <LineChart className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-xl tracking-tight">DRE Analítico</h3>
              </div>
              <div className="space-y-6 relative z-10">
                {[
                  { label: '(+) Receita Bruta', val: 'R$ 124.500', op: 1, type: 'plus' },
                  { label: '(-) Deduções e Impostos', val: 'R$ 7.470', op: 0, type: 'minus' },
                  { label: '(=) Receita Líquida', val: 'R$ 117.030', op: 1, type: 'equal' },
                  { label: '(-) Custos de Mercadoria', val: 'R$ 40.730', op: 0, type: 'minus' },
                  { label: '(=) Lucro Bruto', val: 'R$ 76.300', op: 1, highlight: true, type: 'result' },
                ].map((row, i) => (
                  <div key={i} className={`flex justify-between py-3 items-center group/row ${row.highlight ? 'pt-8 mt-4 border-t border-white/10' : 'border-b border-white/[0.03]'}`}>
                    <span className={`${row.highlight ? 'font-black text-white text-lg' : 'text-white/50 text-sm font-medium'} transition-colors group-hover/row:text-white`}>
                      {row.label}
                    </span>
                    <span className={`font-mono transition-all ${row.highlight ? 'text-emerald-400 text-3xl font-black' : (row.op ? 'text-white/80 text-base' : 'text-red-400/80 text-base')}`}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features - Apple Grid */}
      <section id="funcionalidades" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl md:text-5xl font-black tracking-tight"
            >
              Simples. Poderoso. <br />
              <span className="text-white/40">Feito para vencer.</span>
            </motion.h2>
          </div>

          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: FileSpreadsheet, title: 'Importação Veloz', desc: 'Arraste seu extrato bancário e deixe nossa IA categorizar tudo em segundos.', color: 'emerald' },
              { icon: LineChart, title: 'DRE Automático', desc: 'Chega de esperar o final do mês. Veja seu resultado agora, em tempo real.', color: 'blue' },
              { icon: PieChart, title: 'Margens Reais', desc: 'Entenda exatamente quanto sobra no seu bolso após cada venda.', color: 'purple' },
              { icon: Users, title: 'Modo Contador', desc: 'Compartilhe acessos específicos com seu escritório contábil sem burocracia.', color: 'emerald' },
              { icon: Shield, title: 'Segurança Root', desc: 'Isolamento de dados via Row Level Security (RLS). Sua conta, suas regras.', color: 'blue' },
              { icon: Cpu, title: 'Insights de Luxo', desc: 'Receba avisos proativos sobre vazamentos de caixa e oportunidades.', color: 'purple' },
            ].map((f, i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                whileHover={{ y: -12, backgroundColor: 'rgba(255,255,255,0.03)' }}
                className="bg-[#080808] border border-white/[0.05] p-12 rounded-[3rem] flex flex-col items-start gap-8 transition-all duration-500 group"
              >
                <div className={`w-16 h-16 bg-${f.color}-500/10 rounded-[1.25rem] flex items-center justify-center text-${f.color}-400 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-${f.color}-500/5`}>
                  <f.icon className="h-8 w-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight">{f.title}</h3>
                  <p className="text-white/40 text-base leading-relaxed font-medium group-hover:text-white/60 transition-colors">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA - Final Impact */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[150px] rounded-full scale-150" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
          <motion.h2 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter"
          >
            Assuma o controle <br /> 
            do seu destino.
          </motion.h2>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/signup">
              <Button className="bg-white text-black hover:bg-emerald-400 hover:text-black font-black px-12 py-8 rounded-full text-xl transition-all shadow-2xl">
                Começar agora gratuitamente
              </Button>
            </Link>
          </motion.div>
          <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em]">
            Segurança Bancária • Suporte Prioritário • Sem Fidelidade
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black z-10 relative text-white/20 font-bold text-[11px] uppercase tracking-widest">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-white/60">CaixaUp Premium © 2026</span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="/login" className="text-white hover:text-emerald-400 transition-colors">Acesso Restrito</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
