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
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98])

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      {/* Header / Apple Style Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4"
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
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Caixa<span className="text-sky-500">Up</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] text-slate-500 font-medium">
            {['Funcionalidades', 'Como Funciona', 'DRE', 'Planos'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-sky-600 transition-colors">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Entrar
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-sky-500 text-white hover:bg-sky-600 text-[13px] font-bold px-5 py-2 rounded-full transition-all shadow-lg shadow-sky-500/20">
                Começar
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 flex flex-col items-center text-center z-10">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-5xl mx-auto space-y-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-[12px] font-bold tracking-wide uppercase"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Finanças com Clareza</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl md:text-[8.5rem] font-black tracking-tighter leading-[0.8] text-slate-900"
          >
            Gestão <br />
            <span className="bg-gradient-to-b from-sky-500 to-sky-700 bg-clip-text text-transparent">
              Inteligente.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed tracking-tight"
          >
            Transforme dados bancários em decisões estratégicas. 
            Controle seu DRE, fluxo de caixa e margens com a simplicidade que você sempre quis.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-7 rounded-2xl text-lg transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-2xl">
                Criar Conta Grátis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#dashboard-preview" className="group flex items-center gap-2 text-slate-600 font-bold hover:text-sky-600 transition-colors text-lg">
              Ver demonstração
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Product Showcase */}
      <section id="dashboard-preview" className="px-6 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-4 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Mock Dashboard Header */}
            <div className="flex items-center justify-between mb-16 border-b border-slate-50 pb-10">
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase tracking-[0.3em] text-sky-500">Analytics Pro</p>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900">Visão Geral do Negócio</h2>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center shadow-sm">
                <Activity className="h-6 w-6 text-sky-500" />
              </div>
            </div>

            {/* Floating KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { label: 'Faturamento', value: 'R$ 124.500', trend: '+12%', color: 'text-sky-600', bg: 'bg-sky-50' },
                { label: 'Custos', value: 'R$ 48.200', trend: '-2%', color: 'text-slate-600', bg: 'bg-slate-50' },
                { label: 'Margem', value: '61.2%', trend: 'Saudável', color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map((kpi, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`${kpi.bg} border border-slate-100/50 p-8 rounded-[2.5rem]`}
                >
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                  <p className={`text-4xl font-black mt-3 ${kpi.color}`}>{kpi.value}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className={`h-1.5 w-1.5 rounded-full ${kpi.color.replace('text', 'bg')}`} />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{kpi.trend} este mês</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* DRE Mock */}
            <div className="bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100 relative overflow-hidden group/dre">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/dre:opacity-10 transition-opacity">
                <FileCheck className="h-24 w-24 text-sky-500" />
              </div>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center">
                  <LineChart className="h-5 w-5 text-sky-600" />
                </div>
                <h3 className="font-bold text-xl tracking-tight text-slate-900">DRE Automático</h3>
              </div>
              <div className="space-y-6 relative z-10">
                {[
                  { label: '(+) Receita Bruta', val: 'R$ 124.500', op: 1 },
                  { label: '(-) Deduções e Impostos', val: 'R$ 7.470', op: 0 },
                  { label: '(=) Receita Líquida', val: 'R$ 117.030', op: 1 },
                  { label: '(-) Custos de Mercadoria', val: 'R$ 40.730', op: 0 },
                  { label: '(=) Lucro Bruto', val: 'R$ 76.300', op: 1, highlight: true },
                ].map((row, i) => (
                  <div key={i} className={`flex justify-between py-4 items-center group/row ${row.highlight ? 'pt-8 mt-4 border-t border-slate-200' : 'border-b border-slate-100'}`}>
                    <span className={`${row.highlight ? 'font-black text-slate-900 text-lg' : 'text-slate-500 text-sm font-medium'}`}>
                      {row.label}
                    </span>
                    <span className={`font-mono transition-all ${row.highlight ? 'text-sky-600 text-3xl font-black' : (row.op ? 'text-slate-700 text-base font-bold' : 'text-red-500 text-base font-bold')}`}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-32 px-6 bg-slate-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl md:text-5xl font-black tracking-tight text-slate-900"
            >
              Simples. Visual. <br />
              <span className="text-slate-400 font-bold">Essencial para seu negócio.</span>
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
              { icon: FileSpreadsheet, title: 'Importação Veloz', desc: 'Arraste seu extrato bancário e veja a mágica acontecer em segundos.', color: 'sky' },
              { icon: LineChart, title: 'DRE Real-Time', desc: 'Saiba exatamente quanto sua empresa está lucrando hoje, sem esperar o contador.', color: 'blue' },
              { icon: PieChart, title: 'Margens de Lucro', desc: 'Identifique quais produtos ou serviços trazem o melhor retorno para você.', color: 'indigo' },
              { icon: Users, title: 'Acesso Compartilhado', desc: 'Dê acesso ao seu sócio ou contador com permissões customizadas.', color: 'sky' },
              { icon: Shield, title: 'Segurança Máxima', desc: 'Seus dados protegidos com criptografia de ponta e isolamento total.', color: 'blue' },
              { icon: Cpu, title: 'Inteligência Financeira', desc: 'Receba alertas automáticos sobre tendências e riscos no seu caixa.', color: 'indigo' },
            ].map((f, i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                whileHover={{ y: -12 }}
                className="bg-white border border-slate-100 p-12 rounded-[3rem] flex flex-col items-start gap-8 transition-all duration-500 group shadow-sm hover:shadow-xl hover:shadow-sky-500/5"
              >
                <div className={`w-16 h-16 bg-${f.color}-50 rounded-[1.5rem] flex items-center justify-center text-${f.color}-500 group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon className="h-8 w-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">{f.title}</h3>
                  <p className="text-slate-500 text-base leading-relaxed font-medium">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
          <motion.h2 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-white"
          >
            Assuma o controle total <br /> 
            do seu faturamento.
          </motion.h2>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/signup">
              <Button className="bg-sky-500 text-white hover:bg-sky-400 font-bold px-12 py-8 rounded-full text-xl transition-all shadow-2xl shadow-sky-500/20">
                Começar agora gratuitamente
              </Button>
            </Link>
          </motion.div>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.3em]">
            Configuração em 2 minutos • Sem cartão de crédito • Suporte em Português
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 bg-white z-10 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={20} height={20} className="opacity-50" />
            <span>CaixaUp © 2026</span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-sky-600 transition-colors">Termos</a>
            <a href="#" className="hover:text-sky-600 transition-colors">Privacidade</a>
            <a href="/login" className="text-slate-900 hover:text-sky-600 transition-colors">Login</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
