'use client'

import React, { useState, useTransition } from 'react'
import { format } from 'date-fns'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { bulkCreateTransactions } from '@/actions/transactions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

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
  const [file, setFile] = useState<File | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rawData, setRawData] = useState<ParsedRow[]>([])
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [descCol, setDescCol] = useState('')
  const [amountCol, setAmountCol] = useState('')
  const [dateCol, setDateCol] = useState('')
  const [defaultType, setDefaultType] = useState<'income' | 'expense' | 'deduce'>('deduce')
  const [itemsToImport, setItemsToImport] = useState<TransactionItem[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; if (!selectedFile) return
    setFile(selectedFile); const ext = selectedFile.name.split('.').pop()?.toLowerCase()
    if (ext === 'csv') {
      Papa.parse(selectedFile, { header: true, skipEmptyLines: true, complete: (res) => {
          if (res.meta.fields) { setHeaders(res.meta.fields); setRawData(res.data as ParsedRow[]); autoDetectHeaders(res.meta.fields); setStep(2) }
          else toast.error('Cabeçalhos não encontrados.')
      }})
    } else if (['xlsx', 'xls'].includes(ext || '')) {
      const reader = new FileReader(); reader.onload = (evt) => {
        const bstr = evt.target?.result as string; const wb = XLSX.read(bstr, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]; const data = XLSX.utils.sheet_to_json(ws, { defval: '' }) as ParsedRow[]
        if (data.length > 0) { const h = Object.keys(data[0]); setHeaders(h); setRawData(data); autoDetectHeaders(h); setStep(2) }
      }; reader.readAsBinaryString(selectedFile)
    }
  }

  const autoDetectHeaders = (hList: string[]) => {
    const dM = ['descricao', 'description', 'historico']; const vM = ['valor', 'amount', 'total']; const dtM = ['data', 'date']
    hList.forEach(h => {
      const n = h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (dM.includes(n) && !descCol) setDescCol(h); if (vM.includes(n) && !amountCol) setAmountCol(h); if (dtM.includes(n) && !dateCol) setDateCol(h)
    })
  }

  const parseDate = (val: string): string => {
    if (!val) return format(new Date(), 'yyyy-MM-dd')
    const parts = val.split('/'); if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    return val.substring(0, 10)
  }

  const handleMapConfirm = () => {
    if (!descCol || !amountCol || !dateCol) return toast.error('Mapeie as colunas obrigatórias.')
    const mapped: TransactionItem[] = rawData.map(row => {
      const rawV = String(row[amountCol] || '0').replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
      let val = parseFloat(rawV) || 0; let type: 'income' | 'expense' = 'expense'
      if (defaultType === 'income') type = 'income'
      else if (defaultType === 'expense') type = 'expense'
      else { if (val > 0) type = 'income'; else { type = 'expense'; val = Math.abs(val) } }
      const desc = String(row[descCol]).toLowerCase()
      const cat = categories.find(c => c.type === type && (desc.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(desc)))
      return { description: String(row[descCol] || 'Importado'), amount: val, type, category_id: cat?.id || null, date: parseDate(String(row[dateCol])), payment_method: 'other', status: 'paid', notes: `Importado: ${file?.name}` }
    })
    setItemsToImport(mapped); setStep(3)
  }

  const handleImportSave = () => {
    startTransition(async () => {
      const res = await bulkCreateTransactions(itemsToImport)
      if (res.error) toast.error(res.error); else { toast.success('Importado com sucesso!'); router.push('/dashboard/transactions') }
    })
  }

  return (
    <div className="space-y-10 font-jakarta">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-display-hero">Importar Dados</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-medium italic">Automatize seus lançamentos via CSV ou Excel.</p>
        </div>
      </div>

      <div className="bg-white border border-outline-variant/20 rounded-[2.5rem] p-8 shadow-sm">
        {step === 1 && (
          <div className="flex flex-col items-center justify-center p-16 border-4 border-dashed border-surface-container-high rounded-[3rem] bg-surface hover:bg-surface-container-low transition-all cursor-pointer relative group">
            <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="h-20 w-20 bg-primary/5 border border-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
               <span className="material-symbols-outlined text-[40px]">cloud_upload</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">Selecione seu extrato bancário</h3>
            <p className="text-sm text-on-surface-variant mt-2 font-medium">Arraste o arquivo ou clique para procurar no seu computador.</p>
            <div className="mt-8 flex gap-3">
               <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-black uppercase rounded-lg">CSV</span>
               <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-black uppercase rounded-lg">XLSX</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-10">
             <div className="flex items-center gap-4 pb-6 border-b border-outline-variant/10">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary"><span className="material-symbols-outlined">map</span></div>
                <div><h3 className="text-lg font-bold">Mapeamento de Colunas</h3><p className="text-xs text-on-surface-variant font-medium">Identifique quais colunas representam cada dado no CaixaUp.</p></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2"><Label className="font-bold ml-1 text-xs uppercase tracking-wider opacity-60">Descrição</Label><Select value={descCol} onValueChange={setDescCol}><SelectTrigger className="rounded-xl py-6 bg-surface"><SelectValue /></SelectTrigger><SelectContent>{headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label className="font-bold ml-1 text-xs uppercase tracking-wider opacity-60">Valor</Label><Select value={amountCol} onValueChange={setAmountCol}><SelectTrigger className="rounded-xl py-6 bg-surface"><SelectValue /></SelectTrigger><SelectContent>{headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label className="font-bold ml-1 text-xs uppercase tracking-wider opacity-60">Data</Label><Select value={dateCol} onValueChange={setDateCol}><SelectTrigger className="rounded-xl py-6 bg-surface"><SelectValue /></SelectTrigger><SelectContent>{headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select></div>
             </div>
             <div className="space-y-3 p-6 bg-surface rounded-[2rem] border border-outline-variant/10">
                <Label className="font-bold text-xs uppercase tracking-wider opacity-60 ml-1">Como tratar a natureza da transação?</Label>
                <Select value={defaultType} onValueChange={(v: any) => setDefaultType(v)}><SelectTrigger className="rounded-xl py-6 bg-white border-none shadow-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="deduce">Deduzir pelo sinal (+/-)</SelectItem><SelectItem value="expense">Tratar tudo como Despesa</SelectItem><SelectItem value="income">Tratar tudo como Receita</SelectItem></SelectContent></Select>
             </div>
             <div className="flex gap-4 pt-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 py-7 font-bold rounded-2xl">Voltar</Button>
                <Button onClick={handleMapConfirm} className="flex-[2] bg-primary text-on-primary py-7 font-bold rounded-2xl shadow-lg shadow-primary/20">Avançar para Preview</Button>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
             <div className="flex items-center justify-between pb-6 border-b border-outline-variant/10">
                <div className="flex items-center gap-4"><div className="h-12 w-12 rounded-2xl bg-tertiary-container/10 text-tertiary flex items-center justify-center"><span className="material-symbols-outlined">visibility</span></div><div><h3 className="text-lg font-bold">Preview de Importação</h3><p className="text-xs text-on-surface-variant font-medium">Revisamos {itemsToImport.length} transações prontas para o seu caixa.</p></div></div>
                <div className="flex gap-3"><Button variant="ghost" onClick={() => setStep(2)} className="font-bold rounded-xl">Corrigir</Button><Button disabled={isPending} onClick={handleImportSave} className="bg-primary text-on-primary px-8 font-bold rounded-xl shadow-lg shadow-primary/20">{isPending ? 'Importando...' : 'Confirmar Tudo'}</Button></div>
             </div>
             <div className="border border-outline-variant/10 rounded-[2rem] overflow-hidden">
                <Table><TableHeader className="bg-surface"><TableRow className="border-none"><TableHead className="font-bold text-on-surface px-6">Descrição</TableHead><TableHead className="font-bold text-on-surface">Valor</TableHead><TableHead className="font-bold text-on-surface">Data</TableHead><TableHead className="font-bold text-on-surface">Categoria</TableHead></TableRow></TableHeader><TableBody>{itemsToImport.map((item, idx) => (<TableRow key={idx} className="border-outline-variant/5"><TableCell className="px-6 py-4 font-bold text-on-surface text-xs">{item.description}</TableCell><TableCell className={`font-black text-xs ${item.type === 'income' ? 'text-tertiary' : 'text-on-surface'}`}>{item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}</TableCell><TableCell className="text-xs font-medium opacity-60">{item.date.split('-').reverse().join('/')}</TableCell><TableCell><span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-surface-container-high rounded-full">{categories.find(c => c.id === item.category_id)?.name || 'Sem Categoria'}</span></TableCell></TableRow>))}</TableBody></Table>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
