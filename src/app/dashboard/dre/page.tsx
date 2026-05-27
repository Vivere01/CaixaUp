import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { startOfMonth, endOfMonth, format } from 'date-fns'

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val)
}

export default async function DREPage() {
  const supabase = await createClient()
  const now = new Date()
  const currentMonthStart = format(startOfMonth(now), 'yyyy-MM-dd')
  const currentMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd')

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .gte('date', currentMonthStart)
    .lte('date', currentMonthEnd)

  let receitaBruta = 0
  let custos = 0
  let despesasOp = 0

  transactions?.forEach(tx => {
    const amount = Number(tx.amount)
    if (tx.type === 'income') {
      receitaBruta += amount
    } else {
      // Very simplified logic for DRE categorization if not explicitly mapped
      const catName = tx.categories?.name?.toLowerCase() || ''
      if (catName.includes('custo') || catName.includes('mercadoria') || catName.includes('fornecedor')) {
        custos += amount
      } else {
        despesasOp += amount
      }
    }
  })

  const receitaLiquida = receitaBruta // Assuming no taxes for simplified DRE
  const lucroBruto = receitaLiquida - custos
  const lucroLiquido = lucroBruto - despesasOp

  const rows = [
    { label: 'Receita Operacional Bruta', value: receitaBruta, type: 'main' },
    { label: '(-) Deduções e Impostos', value: 0, type: 'sub' },
    { label: '(=) Receita Operacional Líquida', value: receitaLiquida, type: 'total' },
    { label: '(-) Custos de Vendas (CMV/CPV)', value: -custos, type: 'sub' },
    { label: '(=) Lucro Bruto', value: lucroBruto, type: 'total' },
    { label: '(-) Despesas Operacionais', value: -despesasOp, type: 'sub' },
    { label: '(=) Resultado Líquido do Período', value: lucroLiquido, type: 'final' },
  ]

  return (
    <div className="space-y-10 font-jakarta">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-display-hero">Demonstrativo de Resultado (DRE)</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-medium italic">Visão contábil do seu lucro no mês de {format(now, 'MMMM yyyy')}.</p>
        </div>
      </div>

      <div className="bg-white border border-outline-variant/20 rounded-[2.5rem] p-10 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[120px] text-primary">analytics</span>
        </div>

        <div className="relative z-10 space-y-2">
          {rows.map((row, i) => {
            const isTotal = row.type === 'total'
            const isFinal = row.type === 'final'
            const isMain = row.type === 'main'
            
            return (
              <div 
                key={i} 
                className={`flex justify-between items-center py-4 px-6 rounded-2xl transition-colors ${
                  isFinal ? 'bg-primary text-on-primary mt-8 shadow-lg shadow-primary/20' : 
                  isTotal ? 'bg-surface-container-low font-bold text-on-surface mt-4' : 
                  isMain ? 'font-bold text-on-surface' :
                  'text-on-surface-variant'
                }`}
              >
                <span className={`text-sm ${isFinal ? 'text-lg font-black' : ''}`}>
                  {row.label}
                </span>
                <span className={`font-mono ${isFinal ? 'text-2xl font-black' : isTotal ? 'text-lg font-black' : 'font-bold'}`}>
                  {formatCurrency(Math.abs(row.value))}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10">
          <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">info</span>
            O que é este relatório?
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            O DRE é um relatório que confronta suas receitas e despesas para evidenciar se a sua empresa teve lucro ou prejuízo em um determinado período. Diferente do fluxo de caixa, ele foca na rentabilidade econômica.
          </p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10">
          <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
            Insight CaixaUp
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Sua margem bruta atual indica eficiência na operação central. Continue monitorando seus custos fixos para garantir que o resultado final permaneça saudável.
          </p>
        </div>
      </div>
    </div>
  )
}
