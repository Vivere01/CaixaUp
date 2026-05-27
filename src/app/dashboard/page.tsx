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

  const now = new Date()
  const currentMonthStart = format(startOfMonth(now), 'yyyy-MM-dd')
  const currentMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd')
  const prevMonthStart = format(startOfMonth(subMonths(now, 1)), 'yyyy-MM-dd')
  const prevMonthEnd = format(endOfMonth(subMonths(now, 1)), 'yyyy-MM-dd')
  const sixMonthsAgo = format(startOfMonth(subMonths(now, 5)), 'yyyy-MM-dd')

  const { data: currentTransactions } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .gte('date', currentMonthStart)
    .lte('date', currentMonthEnd)

  const { data: prevTransactions } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .gte('date', prevMonthStart)
    .lte('date', prevMonthEnd)

  const { data: chartTransactions } = await supabase
    .from('transactions')
    .select('amount, type, date')
    .gte('date', sixMonthsAgo)
    .order('date', { ascending: true })

  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .order('date', { ascending: false })
    .limit(5)

  let faturamento = 0
  let despesas = 0
  currentTransactions?.forEach(tx => {
    if (tx.type === 'income') faturamento += Number(tx.amount)
    else despesas += Number(tx.amount)
  })

  const lucro = faturamento - despesas
  const margem = faturamento > 0 ? (lucro / faturamento) * 100 : 0

  let prevFaturamento = 0
  let prevDespesas = 0
  prevTransactions?.forEach(tx => {
    if (tx.type === 'income') prevFaturamento += Number(tx.amount)
    else prevDespesas += Number(tx.amount)
  })

  const prevLucro = prevFaturamento - prevDespesas
  const prevMargem = prevFaturamento > 0 ? (prevLucro / prevFaturamento) * 100 : 0

  const fatGrowth = prevFaturamento > 0 ? ((faturamento - prevFaturamento) / prevFaturamento) * 100 : 0
  const lucroGrowth = prevLucro !== 0 ? ((lucro - prevLucro) / Math.abs(prevLucro)) * 100 : 0

  const monthsList = [5, 4, 3, 2, 1, 0].map(m => {
    const d = subMonths(now, m)
    const yearMonth = format(d, 'yyyy-MM')
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const label = months[d.getMonth()] + ' ' + format(d, 'yy')
    return { key: yearMonth, name: label, Entradas: 0, Saídas: 0 }
  })

  chartTransactions?.forEach(tx => {
    const monthKey = tx.date.substring(0, 7)
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

  const insights = generateInsights({ faturamento, despesas, lucro, margem, prevFaturamento, prevDespesas, prevLucro, prevMargem })

  return (
    <div className="space-y-10 font-jakarta">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-display-hero">Painel de Gestão</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-medium italic">Visão consolidada da performance da sua empresa.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/import">
            <button className="bg-white text-primary border border-outline-variant/30 font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-surface-container transition-all active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
              <span>Importar Extrato</span>
            </button>
          </Link>
          <Link href="/dashboard/transactions?new=true">
            <button className="bg-primary text-on-primary font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Lançar Transação</span>
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Faturamento" 
          value={formatCurrency(faturamento)} 
          growth={fatGrowth} 
          icon="payments" 
          color="primary"
        />
        <KPICard 
          title="Despesas" 
          value={formatCurrency(despesas)} 
          icon="receipt_long" 
          color="error"
        />
        <KPICard 
          title="Lucro Líquido" 
          value={formatCurrency(lucro)} 
          growth={lucroGrowth} 
          icon="trending_up" 
          color="tertiary"
        />
        <KPICard 
          title="Margem de Lucro" 
          value={`${margem.toFixed(1)}%`} 
          subtitle={`${prevMargem.toFixed(1)}% no mês anterior`} 
          icon="pie_chart" 
          color="primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-outline-variant/20 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-outline-variant/10">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Fluxo de Caixa Mensal
              </h3>
            </div>
            <DashboardCharts data={chartData} />
          </div>

          {/* Recent Transactions List */}
          <div className="bg-white border border-outline-variant/20 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-outline-variant/10">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Lançamentos Recentes
              </h3>
              <Link href="/dashboard/transactions" className="text-xs text-primary hover:underline font-bold uppercase tracking-widest">
                Ver Todos
              </Link>
            </div>

            <div className="space-y-1">
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))
              ) : (
                <div className="py-12 text-center text-on-surface-variant/40">
                   <span className="material-symbols-outlined text-[48px] block mb-2">inbox</span>
                   <p className="text-sm font-medium">Nenhuma transação encontrada.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Insights Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-outline-variant/20 rounded-[2.5rem] p-8 shadow-sm h-full">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-8 pb-6 border-b border-outline-variant/10">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              Inteligência Financeira
            </h3>
            
            <div className="space-y-6">
              {insights.map((insight, idx) => (
                <InsightItem key={idx} insight={insight} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-components for better organization

function KPICard({ title, value, growth, subtitle, icon, color }: any) {
  const isPositive = growth !== undefined && growth >= 0
  const colorClass = color === 'error' ? 'text-error' : color === 'tertiary' ? 'text-tertiary' : 'text-primary'
  const bgClass = color === 'error' ? 'bg-error-container/20' : color === 'tertiary' ? 'bg-tertiary-container/10' : 'bg-primary/5'

  return (
    <div className="bg-white border border-outline-variant/20 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{title}</p>
        <div className={`h-10 w-10 rounded-xl ${bgClass} flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="text-2xl font-black text-on-surface">{value}</h4>
        {growth !== undefined && (
          <div className={`flex items-center gap-1.5 text-[12px] font-bold ${isPositive ? 'text-tertiary' : 'text-error'}`}>
             <span className="material-symbols-outlined text-[16px]">{isPositive ? 'trending_up' : 'trending_down'}</span>
             <span>{Math.abs(growth).toFixed(1)}%</span>
             <span className="text-on-surface-variant font-normal lowercase tracking-tight">vs mês anterior</span>
          </div>
        )}
        {subtitle && <p className="text-[12px] text-on-surface-variant font-medium">{subtitle}</p>}
      </div>
    </div>
  )
}

function TransactionRow({ tx }: any) {
  const isIncome = tx.type === 'income'
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low transition-colors group">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
          isIncome ? 'bg-tertiary-container/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'
        }`}>
          <span className="material-symbols-outlined text-[20px]">
            {isIncome ? 'arrow_upward' : 'arrow_downward'}
          </span>
        </div>
        <div className="min-w-0">
          <span className="font-bold text-sm text-on-surface block truncate">{tx.description}</span>
          <span className="text-[11px] text-on-surface-variant font-medium block">
            {tx.categories?.name || 'Sem Categoria'} • {format(new Date(tx.date + 'T12:00:00'), 'dd/MM/yyyy')}
          </span>
        </div>
      </div>
      <div className="text-right ml-4">
        <span className={`font-black text-sm block ${isIncome ? 'text-tertiary' : 'text-on-surface'}`}>
          {isIncome ? '+' : '-'} {formatCurrency(Number(tx.amount))}
        </span>
        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">{tx.payment_method}</span>
      </div>
    </div>
  )
}

function InsightItem({ insight }: any) {
  const colorMap: any = {
    success: 'text-tertiary bg-tertiary-container/10 border-tertiary/10',
    warning: 'text-orange-500 bg-orange-500/10 border-orange-500/10',
    danger: 'text-error bg-error-container/20 border-error/10',
    info: 'text-primary bg-primary/5 border-primary/10'
  }
  
  const iconMap: any = {
    success: 'check_circle',
    warning: 'warning',
    danger: 'dangerous',
    info: 'info'
  }

  return (
    <div className={`p-5 rounded-[1.5rem] border ${colorMap[insight.type]} space-y-2`}>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">{iconMap[insight.type]}</span>
        <h4 className="text-xs font-bold uppercase tracking-wider">{insight.title}</h4>
      </div>
      <p className="text-xs font-medium leading-relaxed opacity-80">{insight.description}</p>
    </div>
  )
}
