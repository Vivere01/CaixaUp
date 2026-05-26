'use client'

import React from 'react'
import Link from 'next/link'
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
  Building2, 
  Receipt,
  FileCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-400 selection:text-slate-900 overflow-x-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="font-extrabold text-lg text-slate-950">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              Caixa<span className="text-emerald-400">Up</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
            <a href="#features" className="hover:text-white transition">Funcionalidades</a>
            <a href="#how-it-works" className="hover:text-white transition">Como Funciona</a>
            <a href="#dashboard-preview" className="hover:text-white transition">DRE Inteligente</a>
            <a href="#pricing" className="hover:text-white transition">Planos</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-350 hover:text-white transition">
              Entrar
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/10">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-sm animate-pulse">
            <Zap className="h-3.5 w-3.5" />
            <span>Feito para empresários brasileiros</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight md:leading-none">
            A clareza financeira que seu negócio <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-350 to-blue-500 bg-clip-text text-transparent">
              realmente precisa.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Esqueça planilhas complicadas de Excel ou ERPs antigos. Visualize o DRE do seu negócio, controle as margens de lucro e tome decisões sem dor de cabeça.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-8 py-7 rounded-xl text-lg transition shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-2">
                Experimentar Grátis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#dashboard-preview" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white px-8 py-7 rounded-xl text-lg transition">
                Ver Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Simulator */}
      <section id="dashboard-preview" className="px-6 pb-28">
        <div className="max-w-6xl mx-auto bg-slate-900/40 border border-slate-800 rounded-3xl p-4 md:p-8 shadow-3xl relative overflow-hidden backdrop-blur-md">
          {/* Top title bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Dashboard Demo</span>
              <h2 className="text-2xl font-bold mt-1">CaixaUp Analytics</h2>
            </div>
            <div className="flex gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs rounded-lg font-semibold border border-emerald-500/20">
                Ativo
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 text-xs rounded-lg font-semibold">
                Maio 2026
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Faturamento bruto</span>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold mt-2">R$ 124.500,00</p>
              <span className="text-[10px] text-emerald-400 mt-1 block">+12% comparado ao mês anterior</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Total de custos</span>
                <Receipt className="h-4 w-4 text-orange-400" />
              </div>
              <p className="text-2xl font-extrabold mt-2">R$ 48.200,00</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Custos variáveis e operacionais</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Margem Operacional</span>
                <PieChart className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-2xl font-extrabold mt-2">61.2%</p>
              <span className="text-[10px] text-blue-400 mt-1 block">Altamente saudável</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Lucro Líquido</span>
                <FileCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold mt-2">R$ 76.300,00</p>
              <span className="text-[10px] text-emerald-400 mt-1 block">Disponível para caixa</span>
            </div>
          </div>

          {/* DRE simulation area */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <LineChart className="h-5 w-5 text-emerald-400" />
              Demonstração do Resultado do Exercício (DRE) Simplificado
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-900 text-slate-350">
                <span>(+) Receita Bruta (Vendas e Serviços)</span>
                <span className="font-semibold text-white">R$ 124.500,00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-900 text-slate-450">
                <span>(-) Deduções de impostos</span>
                <span className="font-semibold text-red-400">- R$ 7.470,00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-900 text-slate-350 font-medium">
                <span>(=) Receita Líquida</span>
                <span className="font-semibold text-white">R$ 117.030,00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-900 text-slate-450">
                <span>(-) Custos Variáveis (Fornecedores e Logística)</span>
                <span className="font-semibold text-red-400">- R$ 40.730,00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-900 text-slate-350 font-bold">
                <span>(=) Lucro Bruto</span>
                <span className="font-bold text-emerald-400">R$ 76.300,00</span>
              </div>
            </div>
            
            {/* Human Summary Box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold mt-0.5">
                ★
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                <span className="font-bold text-white block mb-0.5">Resumo em Linguagem Humana:</span>
                Sua empresa faturou muito bem este mês e a margem de contribuição foi de 61.2%. O maior peso de gastos foi em Fornecedores. Você tem espaço seguro para reinvestir ou retirar lucros.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-slate-900 bg-slate-900/10 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Controle Total</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">O que o CaixaUp entrega</h2>
            <p className="text-slate-400">
              Elimine o trabalho manual e simplifique a leitura dos dados para você focar no que importa: crescer o seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 border border-slate-850 p-8 rounded-3xl shadow-xl hover:border-slate-800 transition group space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Importação Inteligente</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Importe faturas e extratos em formato CSV ou XLSX com mapeamento de colunas automático e inteligente.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-850 p-8 rounded-3xl shadow-xl hover:border-slate-800 transition group space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">DRE Automático</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Esqueça fechamentos demorados no final do mês. Veja seus demonstrativos de resultado atualizados em tempo real.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-850 p-8 rounded-3xl shadow-xl hover:border-slate-800 transition group space-y-4">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                <PieChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Margem & Contribuição</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Descubra a lucratividade real dos seus serviços ou produtos com divisão por categorias customizáveis.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-850 p-8 rounded-3xl shadow-xl hover:border-slate-800 transition group space-y-4">
              <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Desenvolvido com Contadores</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                O CaixaUp pode ser compartilhado com seu escritório contábil, agilizando a exportação de relatórios.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-850 p-8 rounded-3xl shadow-xl hover:border-slate-800 transition group space-y-4">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Isolamento Multi-Tenant</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Seus dados financeiros protegidos por criptografia e políticas de Row Level Security (RLS) no banco de dados.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-850 p-8 rounded-3xl shadow-xl hover:border-slate-800 transition group space-y-4">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Insights Inteligentes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Avisos automáticos sobre gastos fora do padrão, queda em margens operacionais e projeções de fluxo de caixa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Simplicidade</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Onboarding em 3 passos</h2>
            <p className="text-slate-400">Sem processos de implantação longos ou ligações de suporte demoradas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-4 relative">
              <span className="text-6xl font-extrabold text-slate-850 absolute top-[-30px] left-0 pointer-events-none select-none">01</span>
              <h3 className="text-xl font-bold pt-4 relative z-10">Crie seu cadastro</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Preencha os dados básicos do seu negócio e ative seu espaço de trabalho em segundos.
              </p>
            </div>
            <div className="space-y-4 relative">
              <span className="text-6xl font-extrabold text-slate-850 absolute top-[-30px] left-0 pointer-events-none select-none">02</span>
              <h3 className="text-xl font-bold pt-4 relative z-10">Importe seu Extrato</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Arraste e solte o arquivo CSV/XLSX exportado pelo seu banco comercial (ou cadastre transações manualmente).
              </p>
            </div>
            <div className="space-y-4 relative">
              <span className="text-6xl font-extrabold text-slate-850 absolute top-[-30px] left-0 pointer-events-none select-none">03</span>
              <h3 className="text-xl font-bold pt-4 relative z-10">Veja seus Resultados</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visualize seu DRE, margens e receitas organizadas por categorias prontas e fáceis de analisar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Planos Flexíveis</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Investimento no seu Lucro</h2>
            <p className="text-slate-400">Escolha o plano ideal para a escala de faturamento da sua empresa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="bg-slate-950 border border-slate-850 p-8 rounded-3xl flex flex-col justify-between shadow-lg relative">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Empresário</span>
                <h3 className="text-2xl font-bold">Essencial</h3>
                <p className="text-slate-400 text-xs">Ideal para autônomos e pequenas empresas iniciais.</p>
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">R$ 97</span>
                  <span className="text-slate-500 text-xs">/mês</span>
                </div>
                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-slate-350">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Importação de CSVs</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-350">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Demonstrativo DRE automático</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-350">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Até 1 usuário ativo</span>
                  </div>
                </div>
              </div>
              <Link href="/signup" className="pt-8">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-850 py-5 rounded-xl text-sm font-semibold transition">
                  Começar Plano
                </Button>
              </Link>
            </div>

            {/* Plan 2 - Featured */}
            <div className="bg-slate-900 border-2 border-emerald-500 p-8 rounded-3xl flex flex-col justify-between shadow-2xl relative">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-emerald-500 text-slate-950 px-3.5 py-1 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                Mais Vendido
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Contador + Empresa</span>
                <h3 className="text-2xl font-bold">Pro Financeiro</h3>
                <p className="text-slate-300 text-xs">Perfeito para empresas faturando acima de R$50k/mês.</p>
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-emerald-400">R$ 197</span>
                  <span className="text-slate-400 text-xs">/mês</span>
                </div>
                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Todas as ferramentas do Essencial</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Acesso direto ao seu Contador</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Até 5 usuários ativos</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Histórico de relatórios ilimitado</span>
                  </div>
                </div>
              </div>
              <Link href="/signup" className="pt-8">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20">
                  Assinar Agora
                </Button>
              </Link>
            </div>

            {/* Plan 3 */}
            <div className="bg-slate-950 border border-slate-850 p-8 rounded-3xl flex flex-col justify-between shadow-lg relative">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Multi-Empresas</span>
                <h3 className="text-2xl font-bold">Premium</h3>
                <p className="text-slate-400 text-xs">Ideal para holdings ou empresários com múltiplos CNPJs.</p>
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">R$ 397</span>
                  <span className="text-slate-500 text-xs">/mês</span>
                </div>
                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-slate-350">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Até 3 CNPJs gerenciados</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-350">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Usuários ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-350">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Insights preditivos avançados</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-350">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Suporte prioritário via WhatsApp</span>
                  </div>
                </div>
              </div>
              <Link href="/signup" className="pt-8">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-850 py-5 rounded-xl text-sm font-semibold transition">
                  Falar com Consultor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-center relative border-t border-slate-900">
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Pare de administrar sua empresa <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-350 bg-clip-text text-transparent">no escuro.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Seja o mestre do fluxo de caixa e tome decisões embasadas em dados estruturados. Crie sua conta grátis agora.
          </p>
          <div className="pt-4">
            <Link href="/signup">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-7 rounded-xl text-lg transition shadow-xl shadow-emerald-500/20">
                Criar minha Conta CaixaUp
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-16 px-6 border-t border-slate-900 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center">
              <span className="font-extrabold text-sm text-slate-950">C</span>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              Caixa<span className="text-emerald-400">Up</span>
            </span>
          </div>

          <div className="flex gap-6">
            <a href="#features" className="hover:text-slate-350 transition">Funcionalidades</a>
            <a href="#pricing" className="hover:text-slate-350 transition">Planos</a>
            <a href="/login" className="hover:text-slate-350 transition">Acesso ao Painel</a>
          </div>

          <div>
            © {new Date().getFullYear()} CaixaUp. Desenvolvido com segurança bancária.
          </div>
        </div>
      </footer>
    </div>
  )
}
