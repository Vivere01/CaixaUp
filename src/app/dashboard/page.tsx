import React from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'
import { DashboardCharts } from '@/components/custom/dashboard-charts'
import { generateInsights } from '@/utils/insights'

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val)
}

export default async function DashboardPage() {
  const supabase = await createClient()

  let transactions: any[] = []
  let chartTransactions: any[] = []
  let recentTransactions: any[] = []

  try {
    const now = new Date()
    const currentMonthStart = format(startOfMonth(now), 'yyyy-MM-dd')
    const currentMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd')
    const sixMonthsAgo = format(startOfMonth(subMonths(now, 5)), 'yyyy-MM-dd')

    const { data: t } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .gte('date', currentMonthStart)
      .lte('date', currentMonthEnd)
    transactions = t || []

    const { data: ct } = await supabase
      .from('transactions')
      .select('amount, type, date')
      .gte('date', sixMonthsAgo)
      .order('date', { ascending: true })
    chartTransactions = ct || []

    const { data: rt } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .order('date', { ascending: false })
      .limit(6)
    recentTransactions = rt || []
  } catch (e) {
    console.error('Dashboard data fetch error:', e)
  }

  let faturamento = 0
  let despesas = 0
  transactions.forEach(tx => {
    if (tx.type === 'income') faturamento += Number(tx.amount)
    else despesas += Number(tx.amount)
  })

  const lucro = faturamento - despesas
  const margem = faturamento > 0 ? (lucro / faturamento) * 100 : 0

  const monthsList = [5, 4, 3, 2, 1, 0].map(m => {
    const d = subMonths(new Date(), m)
    const yearMonth = format(d, 'yyyy-MM')
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return { key: yearMonth, name: months[d.getMonth()] + ' ' + format(d, 'yy'), Entradas: 0, Saídas: 0 }
  })

  chartTransactions.forEach(tx => {
    const monthKey = tx.date?.substring(0, 7)
    const monthObj = monthsList.find(m => m.key === monthKey)
    if (monthObj) {
      if (tx.type === 'income') monthObj.Entradas += Number(tx.amount)
      else monthObj.Saídas += Number(tx.amount)
    }
  })

  const chartData = monthsList.map(m => ({
    name: m.name,
    Entradas: m.Entradas,
    Saídas: m.Saídas,
    Lucro: m.Entradas - m.Saídas
  }))

  const insights = generateInsights({ 
    faturamento, despesas, lucro, margem, 
    prevFaturamento: 0, prevDespesas: 0, prevLucro: 0, prevMargem: 0 
  })

  return (
    <div className="space-y-10 md:space-y-12 font-jakarta max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-1">
             <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
             Visão em Tempo Real
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-on-surface tracking-tight font-display-hero">
            Olá, <span className="text-primary italic">Seja Bem-vindo.</span>
          </h1>
          <p className="text-on-surface-variant/70 text-sm md:text-base font-medium max-w-xl leading-relaxed">
            Aqui está o resumo da performance financeira da sua empresa este mês.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/import">
            <button className="bg-white hover:bg-surface-container text-on-surface-variant border border-outline-variant/30 font-bold px-5 py-3.5 rounded-2xl flex items-center gap-2.5 transition-all active:scale-95 shadow-sm group">
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">upload_file</span>
              <span className="text-sm">Importar</span>
            </button>
          </Link>
          <Link href="/dashboard/transactions?new=true">
            <button className="bg-primary text-on-primary font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2.5 hover:bg-primary-container transition-all active:scale-95 shadow-xl shadow-primary/20 group">
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">add_circle</span>
              <span className="text-sm">Novo Lançamento</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <KPICard title="Receita Bruta" value={formatCurrency(faturamento)} icon="payments" color="primary" trend="+12.5%" />
        <KPICard title="Despesas Totais" value={formatCurrency(despesas)} icon="receipt_long" color="error" trend="-2.4%" inverse />
        <KPICard title="Lucro Líquido" value={formatCurrency(lucro)} icon="trending_up" color="tertiary" trend="+8.1%" />
        <KPICard title="Margem Líquida" value={`${margem.toFixed(1)}%`} icon="pie_chart" color="primary" highlight />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10">
        <div className="xl:col-span-8 space-y-8 md:space-y-10">
          <div className="bg-white border border-outline-variant/20 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
               <span className="material-symbols-outlined text-[200px] text-primary">monitoring</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10">
              <div>
                <h3 className="text-xl font-black text-on-surface flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                  </span>
                  Performance Histórica
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Comparativo de entradas e saídas dos últimos 6 meses.</p>
              </div>
              <div className="flex items-center gap-4 bg-surface p-1 rounded-xl border border-outline-variant/10">
                 <div className="flex items-center gap-1.5 px-3 py-1.5">
                    <div className="h-2 w-2 rounded-full bg-tertiary" />
                    <span className="text-[10px] font-black uppercase text-on-surface-variant">Entradas</span>
                 </div>
                 <div className="flex items-center gap-1.5 px-3 py-1.5">
                    <div className="h-2 w-2 rounded-full bg-error" />
                    <span className="text-[10px] font-black uppercase text-on-surface-variant">Saídas</span>
                 </div>
              </div>
            </div>
            <div className="relative h-[450px]">
              <DashboardCharts data={chartData} />
            </div>
          </div>

          <div className="bg-white border border-outline-variant/20 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-outline-variant/10">
              <div>
                <h3 className="text-xl font-black text-on-surface flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                    <span className="material-symbols-outlined text-[20px]">history</span>
                  </span>
                  Lançamentos Recentes
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Últimas movimentações registradas no sistema.</p>
              </div>
              <Link href="/dashboard/transactions" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/5 px-4 py-2 rounded-full border border-primary/20 transition-all flex items-center gap-2">
                Explorar Tudo <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
              ) : (
                <div className="col-span-full py-16 text-center">
                   <div className="h-20 w-20 bg-surface rounded-3xl flex items-center justify-center text-on-surface-variant/20 mx-auto mb-4 border-2 border-dashed border-outline-variant/30">
                      <span className="material-symbols-outlined text-[32px]">inbox</span>
                   </div>
                   <p className="text-sm font-bold text-on-surface-variant/40 uppercase tracking-widest">Nenhuma transação encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8 md:space-y-10">
          <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group h-full">
            <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-on-surface flex items-center gap-2.5">
                <span className="h-8 w-8 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                </span>
                Inteligência
              </h3>
              <div className="h-8 w-8 rounded-full border border-primary/20 flex items-center justify-center">
                 <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              {insights.map((insight, idx) => <InsightItem key={idx} insight={insight} />)}
            </div>

            <div className="mt-12 pt-10 border-t border-primary/10 space-y-6 relative z-10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Acesso Rápido</h4>
               <div className="grid grid-cols-2 gap-3">
                  <QuickAction title="Gerar DRE" href="/dashboard/dre" icon="description" />
                  <QuickAction title="Categorias" href="/dashboard/categories" icon="sell" />
                  <QuickAction title="Exportar" href="/dashboard/transactions" icon="ios_share" />
                  <QuickAction title="Configurações" href="/dashboard" icon="settings" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({ title, value, icon, color, trend, inverse, highlight }: any) {
  const isError = color === 'error'
  const isTertiary = color === 'tertiary'
  
  return (
    <div className={`bg-white border ${highlight ? 'border-primary/20' : 'border-outline-variant/20'} p-8 rounded-[2.5rem] shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
      {highlight && <div className="absolute top-0 right-0 bg-primary/10 px-4 py-1.5 rounded-bl-3xl text-[9px] font-black text-primary uppercase tracking-widest">Destaque</div>}
      <div className="flex items-center justify-between mb-6">
        <div className={`h-12 w-12 rounded-2xl ${isError ? 'bg-error-container/20 text-error' : isTertiary ? 'bg-tertiary-container/10 text-tertiary' : 'bg-primary/5 text-primary'} flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        {trend && (
           <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${inverse ? 'bg-error-container/20 text-error' : 'bg-tertiary-container/10 text-tertiary'}`}>
              <span className="material-symbols-outlined text-[14px]">{inverse ? 'trending_down' : 'trending_up'}</span>
              {trend}
           </div>
        )}
      </div>
      <p className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-[0.15em] mb-2">{title}</p>
      <h4 className={`text-2xl md:text-3xl font-black tracking-tight ${highlight ? 'text-primary' : 'text-on-surface'}`}>{value}</h4>
    </div>
  )
}

function TransactionRow({ tx }: any) {
  const isIncome = tx.type === 'income'
  return (
    <div className="flex items-center justify-between p-5 rounded-3xl hover:bg-surface transition-all group border border-transparent hover:border-outline-variant/10">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${isIncome ? 'bg-tertiary-container/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">{isIncome ? 'arrow_upward' : 'arrow_downward'}</span>
        </div>
        <div className="min-w-0">
          <span className="font-bold text-sm text-on-surface block truncate group-hover:text-primary transition-colors">{tx.description}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/40">{tx.categories?.name || 'Sem Categoria'}</span>
            <span className="h-1 w-1 rounded-full bg-outline-variant/50" />
            <span className="text-[10px] font-bold text-on-surface-variant/30">{format(new Date(tx.date + 'T12:00:00'), 'dd MMM')}</span>
          </div>
        </div>
      </div>
      <div className="text-right ml-4">
        <span className={`font-black text-base block ${isIncome ? 'text-tertiary' : 'text-on-surface'}`}>
          {isIncome ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Math.abs(Number(tx.amount)))}
        </span>
      </div>
    </div>
  )
}

function InsightItem({ insight }: any) {
  const colorMap: any = { 
    success: 'text-tertiary bg-white border-tertiary/10', 
    warning: 'text-orange-500 bg-white border-orange-500/10', 
    danger: 'text-error bg-white border-error/10', 
    info: 'text-primary bg-white border-primary/10' 
  }
  const iconMap: any = { success: 'check_circle', warning: 'warning', danger: 'dangerous', info: 'info' }
  
  return (
    <div className={`p-6 rounded-[2rem] border shadow-sm ${colorMap[insight.type]} group hover:shadow-md transition-all`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-[20px]">{iconMap[insight.type]}</span>
        <h4 className="text-xs font-black uppercase tracking-widest">{insight.title}</h4>
      </div>
      <p className="text-xs font-medium leading-relaxed text-on-surface-variant/80">{insight.description}</p>
    </div>
  )
}

function QuickAction({ title, href, icon }: any) {
  return (
    <Link href={href} className="bg-white border border-primary/5 p-4 rounded-2xl flex flex-col gap-3 hover:border-primary/30 hover:shadow-md transition-all group">
       <span className="material-symbols-outlined text-primary text-[18px] group-hover:scale-110 transition-transform">{icon}</span>
       <span className="text-[10px] font-black text-on-surface-variant/70 uppercase tracking-wider">{title}</span>
    </Link>
  )
}
