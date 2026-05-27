'use client'

import React, { useState, useTransition } from 'react'
import { format } from 'date-fns'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}
import { bulkCreateTransactions } from '@/actions/transactions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  FileSpreadsheet, 
  ArrowRight, 
  Check, 
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
}

interface ImportClientProps {
  categories: Category[]
}

interface ParsedRow {
  [key: string]: unknown
}

interface TransactionItem {
  description: string
  amount: number
  type: 'income' | 'expense'
  category_id: string | null
  date: string
  payment_method: string
  status: 'paid' | 'pending'
  notes: string
}

export function ImportClient({ categories }: ImportClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // File upload state
  const [file, setFile] = useState<File | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rawData, setRawData] = useState<ParsedRow[]>([])
  
  // Setup State
  const [step, setStep] = useState<1 | 2 | 3>(1) // 1: Upload, 2: Map, 3: Preview/Verify
  
  // Column Mappings
  const [descCol, setDescCol] = useState('')
  const [amountCol, setAmountCol] = useState('')
  const [dateCol, setDateCol] = useState('')
  const [defaultType, setDefaultType] = useState<'income' | 'expense' | 'deduce'>('deduce')

  // Import Items (Calculated in Step 3)
  const [itemsToImport, setItemsToImport] = useState<TransactionItem[]>([])

  // Parse file on change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()

    if (fileExtension === 'csv') {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.meta.fields) {
            setHeaders(results.meta.fields)
            setRawData(results.data as ParsedRow[])
            // Auto detect standard headers
            autoDetectHeaders(results.meta.fields)
            setStep(2)
          } else {
            toast.error('Erro ao ler os cabeçalhos do arquivo CSV.')
          }
        },
        error: (err: Error) => {
          toast.error(`Erro no processamento do CSV: ${err.message}`)
        }
      })
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result as string
          const wb = XLSX.read(bstr, { type: 'binary' })
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const data = XLSX.utils.sheet_to_json(ws, { defval: '' }) as ParsedRow[]
          
          if (data.length > 0) {
            const sheetHeaders = Object.keys(data[0])
            setHeaders(sheetHeaders)
            setRawData(data)
            autoDetectHeaders(sheetHeaders)
            setStep(2)
          } else {
            toast.error('O arquivo Excel está vazio.')
          }
        } catch (err: unknown) {
          const error = err as Error
          toast.error(`Erro ao decodificar Excel: ${error.message}`)
        }
      }
      reader.readAsBinaryString(selectedFile)
    } else {
      toast.error('Formato inválido. Insira apenas arquivos CSV ou Excel.')
    }
  }

  // Auto detect typical column names
  const autoDetectHeaders = (headerList: string[]) => {
    const descMatches = ['descricao', 'description', 'historico', 'lançamento', 'nome', 'titulo', 'detalhe']
    const valMatches = ['valor', 'amount', 'total', 'quantia', 'movimentação', 'receita', 'despesa']
    const dateMatches = ['data', 'date', 'vencimento', 'pagamento']

    headerList.forEach(h => {
      const norm = h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (descMatches.includes(norm) && !descCol) setDescCol(h)
      if (valMatches.includes(norm) && !amountCol) setAmountCol(h)
      if (dateMatches.includes(norm) && !dateCol) setDateCol(h)
    })
  }

  // Parse a date string into YYYY-MM-DD
  const parseDate = (val: string): string => {
    if (!val) return format(new Date(), 'yyyy-MM-dd')
    
    // Check if Excel serial number date
    if (!isNaN(Number(val)) && Number(val) > 30000) {
      try {
        const dateObj = new Date((Number(val) - 25569) * 86400 * 1000)
        return format(dateObj, 'yyyy-MM-dd')
      } catch {}
    }

    // Typical DD/MM/YYYY or YYYY-MM-DD
    const parts = val.split('/')
    if (parts.length === 3) {
      // dd/mm/yyyy
      const [d, m, y] = parts
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    }

    const isoParts = val.split('-')
    if (isoParts.length === 3) {
      // yyyy-mm-dd
      return val.substring(0, 10)
    }

    return format(new Date(), 'yyyy-MM-dd')
  }

  // Proceed to Step 3 - Preview
  const handleMapConfirm = () => {
    if (!descCol || !amountCol || !dateCol) {
      toast.error('Selecione as colunas correspondentes de Descrição, Valor e Data.')
      return
    }

    const mappedItems: TransactionItem[] = rawData.map(row => {
      const rawValStr = String(row[amountCol] || '0')
        .replace('R$', '')
        .replace(/\s/g, '')
        // Convert Brazilian decimal format if needed (e.g. 1.250,50 -> 1250.50)
        .replace(/\./g, '')
        .replace(',', '.')

      let parsedAmount = parseFloat(rawValStr) || 0
      
      let type: 'income' | 'expense' = 'expense'
      if (defaultType === 'income') {
        type = 'income'
      } else if (defaultType === 'expense') {
        type = 'expense'
      } else {
        // Deduce: positive amount is income, negative is expense
        if (parsedAmount > 0) {
          type = 'income'
        } else {
          type = 'expense'
          parsedAmount = Math.abs(parsedAmount) // Convert to positive value for our schema
        }
      }

      const dateStr = parseDate(String(row[dateCol]))

      // Try auto category matching based on keywords in description
      const descLower = String(row[descCol]).toLowerCase()
      let categoryId: string | null = null

      const matchingCategory = categories.find(cat => {
        if (cat.type !== type) return false
        const catNameLower = cat.name.toLowerCase()
        return descLower.includes(catNameLower) || catNameLower.includes(descLower)
      })

      if (matchingCategory) {
        categoryId = matchingCategory.id
      }

      return {
        description: String(row[descCol] || 'Sem descrição'),
        amount: parsedAmount,
        type,
        category_id: categoryId,
        date: dateStr,
        payment_method: 'other',
        status: 'paid',
        notes: `Importado de planilha: ${file?.name || ''}`
      }
    })

    setItemsToImport(mappedItems)
    setStep(3)
  }

  // Update Category on Preview row
  const handleCategoryChangeOnRow = (index: number, catId: string) => {
    setItemsToImport(prev => {
      const copy = [...prev]
      copy[index].category_id = catId
      return copy
    })
  }

  // Update Type on Preview row
  const handleTypeChangeOnRow = (index: number, type: 'income' | 'expense') => {
    setItemsToImport(prev => {
      const copy = [...prev]
      copy[index].type = type
      // Reset category since types mismatch
      copy[index].category_id = null
      return copy
    })
  }

  // Trigger Bulk Save Server Action
  const handleImportSave = () => {
    if (itemsToImport.length === 0) return

    startTransition(async () => {
      const res = await bulkCreateTransactions(itemsToImport)

      if (res.error) {
        toast.error(`Erro na importação: ${res.error}`)
      } else {
        toast.success(`Importação realizada com sucesso! ${itemsToImport.length} registros inseridos.`)
        router.push('/dashboard/transactions')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black">Importar Lançamentos</h1>
        <p className="text-slate-400 text-xs mt-1">Suba extratos de cartão ou conta bancária em formato CSV ou Excel.</p>
      </div>

      {/* STEP 1: Upload File */}
      {step === 1 && (
        <Card className="bg-slate-900 border-slate-850 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Carregar arquivo</CardTitle>
            <CardDescription className="text-slate-400 text-xs">Arraste ou selecione a planilha exportada pelo seu banco.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40 hover:bg-slate-950/70 transition cursor-pointer relative">
            <input 
              type="file" 
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="h-16 w-16 bg-slate-900 border border-slate-800 text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
              <Upload className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-base">Arraste seu arquivo de banco</h3>
            <p className="text-xs text-slate-500 mt-1.5">Formatos suportados: CSV, XLSX e XLS (tamanho máximo: 10MB)</p>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Map Headers */}
      {step === 2 && (
        <Card className="bg-slate-900 border-slate-850 text-white max-w-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
              Mapeamento de Colunas
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">Escolha os campos corretos da sua planilha para associar ao CaixaUp.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-350 text-xs font-semibold">Descrição / Histórico</Label>
                <Select value={descCol} onValueChange={(val) => setDescCol(val || '')}>
                  <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    {headers.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-350 text-xs font-semibold">Valor da Transação</Label>
                <Select value={amountCol} onValueChange={(val) => setAmountCol(val || '')}>
                  <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    {headers.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-350 text-xs font-semibold">Data do Lançamento</Label>
                <Select value={dateCol} onValueChange={(val) => setDateCol(val || '')}>
                  <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    {headers.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-350 text-xs font-semibold">Como tratar a natureza da transação?</Label>
              <Select value={defaultType} onValueChange={(val) => setDefaultType((val || 'deduce') as 'income' | 'expense' | 'deduce')}>
                <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="deduce">Deduzir pelo sinal (+/- na coluna de valor)</SelectItem>
                  <SelectItem value="expense">Tratar todas as linhas como Saídas (Despesas)</SelectItem>
                  <SelectItem value="income">Tratar todas as linhas como Entradas (Receitas)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t border-slate-850 flex justify-between gap-4">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleMapConfirm}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 rounded-xl"
              >
                <span>Visualizar Preview</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Preview Table */}
      {step === 3 && (
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-850 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-400" />
                  Visualização de Lançamentos ({itemsToImport.length})
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">Associe as categorias e confirme as transações para a inserção final.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="border-slate-800 hover:bg-slate-850 text-slate-300 rounded-xl text-xs py-2 h-9"
                >
                  Corrigir Mapeamento
                </Button>
                <Button 
                  disabled={isPending}
                  onClick={handleImportSave}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs py-2 h-9 flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
                >
                  {isPending && <RefreshCw className="h-3 w-3 animate-spin" />}
                  <span>Confirmar Importação</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-950 border-b border-slate-800">
                  <TableRow>
                    <TableHead className="text-slate-450 font-bold text-xs">Descrição</TableHead>
                    <TableHead className="text-slate-450 font-bold text-xs w-28">Natureza</TableHead>
                    <TableHead className="text-slate-450 font-bold text-xs w-32">Valor</TableHead>
                    <TableHead className="text-slate-450 font-bold text-xs w-28">Data</TableHead>
                    <TableHead className="text-slate-450 font-bold text-xs w-48">Categoria Recomendada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsToImport.map((item, idx) => {
                    const filteredCats = categories.filter(c => c.type === item.type)
                    return (
                      <TableRow key={idx} className="border-b border-slate-850 hover:bg-slate-850/20 transition">
                        <TableCell className="font-semibold text-slate-200 text-xs max-w-xs truncate">{item.description}</TableCell>
                        <TableCell>
                          <Select 
                            value={item.type} 
                            onValueChange={(val) => handleTypeChangeOnRow(idx, (val || 'expense') as 'income' | 'expense')}
                          >
                            <SelectTrigger className="bg-slate-950 border-slate-850 h-8 rounded-lg text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                              <SelectItem value="income">Entrada</SelectItem>
                              <SelectItem value="expense">Saída</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className={`font-black text-xs ${item.type === 'income' ? 'text-emerald-400' : 'text-slate-250'}`}>
                          {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">{item.date.split('-').reverse().join('/')}</TableCell>
                        <TableCell>
                          <Select 
                            value={item.category_id || 'none'} 
                            onValueChange={(val) => handleCategoryChangeOnRow(idx, val === 'none' ? '' : (val || ''))}
                          >
                            <SelectTrigger className="bg-slate-950 border-slate-850 h-8 rounded-lg text-xs">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                              <SelectItem value="none">Sem categoria</SelectItem>
                              {filteredCats.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
