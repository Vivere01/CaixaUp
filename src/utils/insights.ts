export interface InsightCardData {
  title: string
  description: string
  type: 'success' | 'warning' | 'danger' | 'info'
}

export function generateInsights(metrics: {
  faturamento: number
  despesas: number
  lucro: number
  margem: number
  prevFaturamento: number
  prevDespesas: number
  prevLucro: number
  prevMargem: number
}): InsightCardData[] {
  const insights: InsightCardData[] = []

  const { faturamento, despesas, lucro, margem, prevFaturamento, prevDespesas, prevMargem } = metrics

  if (faturamento === 0 && despesas === 0) {
    insights.push({
      title: 'Comece a usar o CaixaUp',
      description: 'Nenhuma transação encontrada no mês atual. Vá para "Importar Extrato" para subir seus arquivos de banco de forma automatizada.',
      type: 'info',
    })
    return insights
  }

  if (lucro < 0) {
    insights.push({
      title: 'Prejuízo Operacional Detectado',
      description: `Sua empresa está gastando mais do que fatura neste mês, resultando em um saldo de ${formatBRL(lucro)}. Revise suas despesas.`,
      type: 'danger',
    })
  }

  if (faturamento > prevFaturamento && prevFaturamento > 0) {
    const pct = ((faturamento - prevFaturamento) / prevFaturamento) * 100
    insights.push({
      title: 'Aceleração de Vendas',
      description: `Parabéns! Seu faturamento cresceu ${pct.toFixed(1)}% comparado ao mês anterior. Mantendo este ritmo, seu negócio ganha musculatura.`,
      type: 'success',
    })
  }

  if (despesas > prevDespesas * 1.15 && prevDespesas > 0) {
    const pct = ((despesas - prevDespesas) / prevDespesas) * 100
    insights.push({
      title: 'Aumento Expressivo nas Despesas',
      description: `Suas saídas cresceram ${pct.toFixed(1)}% em relação ao mês anterior. É recomendável analisar a aba de "Transações" para rastrear o vazamento.`,
      type: 'warning',
    })
  }

  if (margem < prevMargem && prevMargem > 0) {
    const diff = prevMargem - margem
    insights.push({
      title: 'Aperto na Margem Operacional',
      description: `Sua margem líquida encolheu ${diff.toFixed(1)}% comparado ao mês passado. Fique atento a reajustes de preços ou custos.`,
      type: 'warning',
    })
  } else if (margem > 40 && faturamento > 0) {
    insights.push({
      title: 'Excelente Margem de Lucro',
      description: `Sua margem está em ${margem.toFixed(1)}%, acima da média da maioria das empresas. Excelente eficiência de custos.`,
      type: 'success',
    })
  }

  if (insights.length === 0) {
    insights.push({
      title: 'Consistência Financeira',
      description: 'Suas receitas e despesas permanecem estáveis e proporcionais em comparação com o mês passado.',
      type: 'info',
    })
  }

  return insights
}

function formatBRL(val: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val)
}
