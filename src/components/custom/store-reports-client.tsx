'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

interface StorePerformanceData {
  name: string
  receita: number
  despesa: number
  lucro: number
}

interface StoreReportsClientProps {
  storesData: StorePerformanceData[]
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value)
}

export function StoreReportsClient({ storesData }: StoreReportsClientProps) {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by Store */}
        <div className="bg-white border border-outline-variant/20 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-xl font-black mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">storefront</span>
            Receita por Unidade
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storesData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  fontWeight={700}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                   cursor={{ fill: 'transparent' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                   formatter={(val: any) => formatCurrency(val)}
                />
                <Bar dataKey="receita" fill="#006947" radius={[0, 8, 8, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit by Store */}
        <div className="bg-white border border-outline-variant/20 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-xl font-black mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">trending_up</span>
            Lucro Líquido por Unidade
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storesData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  fontWeight={700}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                   cursor={{ fill: 'transparent' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                   formatter={(val: any) => formatCurrency(val)}
                />
                <Bar dataKey="lucro" radius={[0, 8, 8, 0]} barSize={32}>
                  {storesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.lucro >= 0 ? '#0057c2' : '#ba1a1a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white border border-outline-variant/20 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-outline-variant/10 bg-surface">
          <h3 className="text-xl font-black">Detalhamento por Loja</h3>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Visão comparativa de performance operacional.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Unidade</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Receita</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Despesa</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Lucro Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {storesData.map((s, i) => (
                <tr key={i} className="hover:bg-surface transition-colors">
                  <td className="px-8 py-5 font-bold text-sm">{s.name}</td>
                  <td className="px-8 py-5 text-tertiary font-bold text-sm">{formatCurrency(s.receita)}</td>
                  <td className="px-8 py-5 text-on-surface-variant font-bold text-sm">{formatCurrency(s.despesa)}</td>
                  <td className={`px-8 py-5 text-right font-black text-sm ${s.lucro >= 0 ? 'text-primary' : 'text-error'}`}>
                    {formatCurrency(s.lucro)}
                  </td>
                </tr>
              ))}
              <tr className="bg-primary/5 font-black">
                <td className="px-8 py-6 text-primary uppercase tracking-widest text-xs">Total Consolidado</td>
                <td className="px-8 py-6 text-tertiary text-base">{formatCurrency(storesData.reduce((acc, curr) => acc + curr.receita, 0))}</td>
                <td className="px-8 py-6 text-on-surface-variant text-base">{formatCurrency(storesData.reduce((acc, curr) => acc + curr.despesa, 0))}</td>
                <td className="px-8 py-6 text-right text-primary text-lg">
                  {formatCurrency(storesData.reduce((acc, curr) => acc + curr.lucro, 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
