import React from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'
import { 
  TrendingUp, 
  Receipt, 
  DollarSign, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus, 
  Upload, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

  // 1. Get dates
  const now = new Date()
  
  const currentMonthStart = format(startOfMonth(now), 'yyyy-MM-dd')
  const currentMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd')

  const prevMonthStart = format(startOfMonth(subMonths(now, 1)), 'yyyy-MM-dd')
  const prevMonthEnd = format(endOfMonth(subMonths(now, 1)), 'yyyy-MM-dd')

  const sixMonthsAgo = format(startOfMonth(subMonths(now, 5)), 'yyyy-MM-dd')

  // 2. Fetch current month's transactions
  const { data: currentTransactions } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .gte('date', currentMonthStart)
    .lte('date', currentMonthEnd)

  // 3. Fetch previous month's transactions
  const { data: prevTransactions } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .gte('date', prevMonthStart)
    .lte('date', prevMonthEnd)

  // 4. Fetch last 6 months of transactions (for charts)
  const { data: chartTransactions } = await supabase
    .from('transactions')
    .select('amount, type, date')
    .gte('date', sixMonthsAgo)
    .order('date', { ascending: true })

  // 5. Fetch recent transactions (limit 5)
  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .order('date', { ascending: false })
    .limit(5)

  // 6. Aggregate Current Month
  let faturamento = 0
  let despesas = 0

  currentTransactions?.forEach(tx => {
    if (tx.type === 'income') faturamento += Number(tx.amount)
    else despesas += Number(tx.amount)
  })

  const lucro = faturamento - despesas
  const margem = faturamento > 0 ? (lucro / faturamento) * 100 : 0

  // 7. Aggregate Previous Month
  let prevFaturamento = 0
  let prevDespesas = 0

  prevTransactions?.forEach(tx => {
    if (tx.type === 'income') prevFaturamento += Number(tx.amount)
    else prevDespesas += Number(tx.amount)
  })

  const prevLucro = prevFaturamento - prevDespesas
  const prevMargem = prevFaturamento > 0 ? (prevLucro / prevFaturamento) * 100 : 0

  // 8. Calculations for growth metrics
  const fatGrowth = prevFaturamento > 0 ? ((faturamento - prevFaturamento) / prevFaturamento) * 100 : 0
  const despGrowth = prevDespesas > 0 ? ((despesas - prevDespesas) / prevDespesas) * 100 : 0
  const lucroGrowth = prevLucro !== 0 ? ((lucro - prevLucro) / Math.abs(prevLucro)) * 100 : 0

  // 9. Prepare Chart Data (6 months historical grouping)
  const monthsList = [5, 4, 3, 2, 1, 0].map(m => {
    const d = subMonths(now, m)
    const yearMonth = format(d, 'yyyy-MM')
    
    // Label translations
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const label = months[d.getMonth()] + ' ' + format(d, 'yy')

    return {
      key: yearMonth,
      name: label,
      Entradas: 0,
      Saídas: 0,
    }
  })

  chartTransactions?.forEach(tx => {
    const monthKey = tx.date.substring(0, 7)
    const monthObj = monthsList.find(m => m.key === monthKey)
    if (monthObj) {
      if (tx.type === 'income') {
        monthObj.Entradas += Number(tx.amount)
      } else {
        monthObj.Saídas += Number(tx.amount)
      }
    }
  })

  const chartData = monthsList.map(m => ({
    name: m.name,
    Entradas: m.Entradas,
    Saídas: m.Saídas,
    Lucro: m.Entradas - m.Saídas
  }))

  // 10. Generate Smart Insights
  const insights = generateInsights({
    faturamento,
    despesas,
    lucro,
    margem,
    prevFaturamento,
    prevDespesas,
    prevLucro,
    prevMargem
  })

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Painel Principal</h1>
          <p className="text-slate-400 text-sm mt-1">Acompanhamento de fluxo de caixa e rentabilidade da sua empresa.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/import">
            <Button variant="outline" className="border-slate-800 hover:bg-slate-900 text-slate-300 font-semibold gap-2 rounded-xl py-5">
              <Upload className="h-4 w-4" />
              <span>Importar Extrato</span>
            </Button>
          </Link>
          <Link href="/dashboard/transactions?new=true">
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 rounded-xl py-5 shadow-lg shadow-emerald-500/10">
              <Plus className="h-4 w-4 text-slate-950" />
              <span>Nova Transação</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Faturamento */}
        <Card className="bg-slate-900 border-slate-850 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faturamento (Entradas)</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{formatCurrency(faturamento)}</div>
            <p className="text-xs text-slate-450 mt-1 flex items-center gap-1">
              {fatGrowth >= 0 ? (
                <span className="text-emerald-400 font-semibold flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  {fatGrowth.toFixed(1)}%
                </span>
              ) : (
                <span className="text-red-400 font-semibold flex items-center">
                  <ArrowDownRight className="h-3 w-3" />
                  {Math.abs(fatGrowth).toFixed(1)}%
                </span>
              )}
              <span className="text-slate-500">desde o mês anterior</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Despesas */}
        <Card className="bg-slate-900 border-slate-850 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">Despesas (Saídas)</CardTitle>
            <Receipt className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{formatCurrency(despesas)}</div>
            <p className="text-xs text-slate-450 mt-1 flex items-center gap-1">
              {despGrowth <= 0 ? (
                <span className="text-emerald-400 font-semibold flex items-center">
                  <ArrowDownRight className="h-3 w-3" />
                  {Math.abs(despGrowth).toFixed(1)}%
                </span>
              ) : (
                <span className="text-red-400 font-semibold flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  {despGrowth.toFixed(1)}%
                </span>
              )}
              <span className="text-slate-500">em relação ao mês passado</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Lucro */}
        <Card className="bg-slate-900 border-slate-850 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{formatCurrency(lucro)}</div>
            <p className="text-xs text-slate-450 mt-1 flex items-center gap-1">
              {lucroGrowth >= 0 ? (
                <span className="text-emerald-400 font-semibold flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  {lucroGrowth.toFixed(1)}%
                </span>
              ) : (
                <span className="text-red-400 font-semibold flex items-center">
                  <ArrowDownRight className="h-3 w-3" />
                  {Math.abs(lucroGrowth).toFixed(1)}%
                </span>
              )}
              <span className="text-slate-500">desde o mês passado</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Margem */}
        <Card className="bg-slate-900 border-slate-850 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">Margem de Lucro</CardTitle>
            <PieChart className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{margem.toFixed(1)}%</div>
            <p className="text-xs text-slate-450 mt-1 flex items-center gap-1">
              <span className="font-semibold text-slate-350">{prevMargem.toFixed(1)}% no mês anterior</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Charts Layout */}
      <DashboardCharts data={chartData} />

      {/* Bottom Grid: Insights & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights (Left Column) */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            CaixaUp Insights
          </h3>
          
          <div className="space-y-4">
            {insights.map((insight, idx) => {
              const iconMap = {
                success: <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />,
                warning: <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />,
                danger: <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />,
                info: <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              }

              const bgMap = {
                success: 'bg-emerald-500/5 border-emerald-500/10',
                warning: 'bg-orange-500/5 border-orange-500/10',
                danger: 'bg-red-500/5 border-red-500/10',
                info: 'bg-blue-500/5 border-blue-500/10'
              }

              return (
                <div 
                  key={idx} 
                  className={`p-4 border rounded-2xl flex gap-3 ${bgMap[insight.type]}`}
                >
                  {iconMap[insight.type]}
                  <div>
                    <h4 className="text-sm font-bold">{insight.title}</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Transactions (Right Column) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Últimos Lançamentos</h3>
            <Link href="/dashboard/transactions" className="text-xs text-emerald-450 hover:text-emerald-400 transition font-semibold">
              Ver todas as transações
            </Link>
          </div>

          <Card className="bg-slate-900 border-slate-850 text-white">
            <CardContent className="p-0">
              {recentTransactions && recentTransactions.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  {recentTransactions.map((tx) => {
                    const isIncome = tx.type === 'income'
                    return (
                      <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-850/50 transition">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            <span className="font-bold text-sm">
                              {isIncome ? '+' : '-'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-sm text-slate-200 block truncate">{tx.description}</span>
                            <span className="text-[10px] text-slate-500 block">
                              {tx.categories?.name || 'Sem Categoria'} • {format(new Date(tx.date + 'T12:00:00'), 'dd/MM/yyyy')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-black text-sm block ${
                            isIncome ? 'text-emerald-400' : 'text-slate-250'
                          }`}>
                            {isIncome ? '+' : '-'} {formatCurrency(Number(tx.amount))}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">
                            {tx.payment_method}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <Receipt className="mx-auto h-8 w-8 text-slate-650 mb-3" />
                  <p className="text-sm">Nenhuma transação cadastrada ainda.</p>
                  <p className="text-xs text-slate-600 mt-1">Insira suas receitas ou despesas para começar.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
