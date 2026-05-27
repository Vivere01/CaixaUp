'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val)
}

interface DREClientProps {
  rows: any[]
  startDate: string
  endDate: string
  formattedPeriod: string
}

export function DREClient({ rows, startDate, endDate, formattedPeriod }: DREClientProps) {
  const router = useRouter()
  const [start, setStart] = useState(startDate)
  const [end, setEnd] = useState(endDate)

  const handleFilter = () => {
    router.push(`/dashboard/dre?start=${start}&end=${end}`)
  }

  return (
    <div className="space-y-8 md:space-y-10 font-jakarta">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight font-display-hero">Demonstrativo de Resultado (DRE)</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-medium italic">Visão contábil do seu lucro no período de {formattedPeriod}.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-3 bg-white p-4 rounded-3xl border border-outline-variant/20 shadow-sm">
          <div className="space-y-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-outline-variant uppercase ml-1">Início</span>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="rounded-xl border-outline-variant/30" />
          </div>
          <div className="space-y-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-outline-variant uppercase ml-1">Fim</span>
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded-xl border-outline-variant/30" />
          </div>
          <Button onClick={handleFilter} className="bg-primary text-on-primary font-bold px-6 py-2 rounded-xl w-full sm:w-auto">
            Filtrar
          </Button>
        </div>
      </div>

      <div className="bg-white border border-outline-variant/20 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[80px] md:text-[120px] text-primary">analytics</span>
        </div>

        <div className="relative z-10 space-y-1.5 md:space-y-2">
          {rows.map((row, i) => {
            const isTotal = row.type === 'total'
            const isFinal = row.type === 'final'
            const isMain = row.type === 'main'
            const isDetail = row.type === 'detail'
            
            return (
              <div 
                key={i} 
                className={`flex justify-between items-center py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl transition-colors ${
                  isFinal ? 'bg-primary text-on-primary mt-6 md:mt-8 shadow-lg shadow-primary/20' : 
                  isTotal ? 'bg-surface-container-low font-bold text-on-surface mt-3 md:mt-4' : 
                  isMain ? 'font-bold text-on-surface' :
                  isDetail ? 'text-[11px] md:text-xs text-on-surface-variant/70 italic' :
                  'text-on-surface-variant'
                }`}
              >
                <span className={`text-[13px] md:text-sm ${isFinal ? 'text-base md:text-lg font-black' : ''}`}>
                  {row.label}
                </span>
                <span className={`font-mono text-sm md:text-base ${isFinal ? 'text-xl md:text-2xl font-black' : isTotal ? 'text-base md:text-lg font-black' : 'font-bold'}`}>
                  {formatCurrency(Math.abs(row.value))}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-surface-container-low p-6 md:p-8 rounded-3xl md:rounded-[2rem] border border-outline-variant/10">
          <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">info</span>
            O que é este relatório?
          </h4>
          <p className="text-[11px] md:text-xs text-on-surface-variant leading-relaxed">
            O DRE é um relatório que confronta suas receitas e despesas para evidenciar se a sua empresa teve lucro ou prejuízo em um determinado período.
          </p>
        </div>
        <div className="bg-surface-container-low p-6 md:p-8 rounded-3xl md:rounded-[2rem] border border-outline-variant/10">
          <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
            Insight CaixaUp
          </h4>
          <p className="text-[11px] md:text-xs text-on-surface-variant leading-relaxed">
            Agora você pode visualizar a quebra entre despesas fixas e variáveis, ajudando a identificar onde sua operação é mais sensível a mudanças de volume.
          </p>
        </div>
      </div>
    </div>
  )
}
