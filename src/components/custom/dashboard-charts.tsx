'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

interface ChartDataPoint {
  name: string
  Entradas: number
  Saídas: number
  Lucro: number
}

interface DashboardChartsProps {
  data: ChartDataPoint[]
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value)
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Historical Area Chart */}
      <div className="lg:col-span-2 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#006947" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#006947" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ fontWeight: '800', color: '#0b1c30', marginBottom: '4px' }}
              itemStyle={{ fontSize: '12px', fontWeight: '600' }}
              formatter={(value: any) => [formatCurrency(Number(value || 0)), '']}
            />
            <Area 
              type="monotone" 
              dataKey="Entradas" 
              stroke="#006947" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorEntradas)" 
            />
            <Area 
              type="monotone" 
              dataKey="Saídas" 
              stroke="#ba1a1a" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSaidas)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Net Profit Bar Chart */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ fontWeight: '800', color: '#0b1c30', marginBottom: '4px' }}
              itemStyle={{ fontSize: '12px', fontWeight: '600' }}
              formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Lucro']}
            />
            <Bar 
              dataKey="Lucro" 
              fill="#0057c2" 
              radius={[8, 8, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
