import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { startOfMonth, endOfMonth, format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DREClient } from '@/components/custom/dre-client'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DREPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const resolvedParams = await searchParams
  
  const now = new Date()
  const startDate = resolvedParams.start ? String(resolvedParams.start) : format(startOfMonth(now), 'yyyy-MM-dd')
  const endDate = resolvedParams.end ? String(resolvedParams.end) : format(endOfMonth(now), 'yyyy-MM-dd')

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .gte('date', startDate)
    .lte('date', endDate)

  let receitaBruta = 0
  let custos = 0
  let despesasOp = 0
  let despesasFixas = 0
  let despesasVariaveis = 0

  transactions?.forEach(tx => {
    const amount = Number(tx.amount)
    if (tx.type === 'income') {
      receitaBruta += amount
    } else {
      const isFixed = tx.cost_center === 'fixed'
      if (isFixed) despesasFixas += amount
      else despesasVariaveis += amount

      const catName = tx.categories?.name?.toLowerCase() || ''
      if (catName.includes('custo') || catName.includes('mercadoria') || catName.includes('fornecedor')) {
        custos += amount
      } else {
        despesasOp += amount
      }
    }
  })

  const receitaLiquida = receitaBruta
  const lucroBruto = receitaLiquida - custos
  const lucroLiquido = lucroBruto - despesasOp

  const rows = [
    { label: 'Receita Operacional Bruta', value: receitaBruta, type: 'main' },
    { label: '(-) Deduções e Impostos', value: 0, type: 'sub' },
    { label: '(=) Receita Operacional Líquida', value: receitaLiquida, type: 'total' },
    { label: '(-) Custos de Vendas (CMV/CPV)', value: -custos, type: 'sub' },
    { label: '(=) Lucro Bruto', value: lucroBruto, type: 'total' },
    { label: '(-) Despesas Operacionais', value: -despesasOp, type: 'sub' },
    { label: '   • Despesas Fixas', value: -despesasFixas, type: 'detail' },
    { label: '   • Despesas Variáveis', value: -despesasVariaveis, type: 'detail' },
    { label: '(=) Resultado Líquido do Período', value: lucroLiquido, type: 'final' },
  ]

  return (
    <DREClient 
      rows={rows} 
      startDate={startDate} 
      endDate={endDate} 
      formattedPeriod={
        format(parseISO(startDate), "dd 'de' MMM", { locale: ptBR }) + 
        ' a ' + 
        format(parseISO(endDate), "dd 'de' MMM 'de' yyyy", { locale: ptBR })
      } 
    />
  )
}
