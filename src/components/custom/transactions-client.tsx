'use client'

import React, { useState, useTransition } from 'react'
import { 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '@/actions/transactions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
}

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  payment_method: string
  status: 'paid' | 'pending'
  category_id: string | null
  notes: string
  categories: Category | null
}

interface TransactionsClientProps {
  initialTransactions: Transaction[]
  categories: Category[]
  openNewModalOnMount?: boolean
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val)
}

export function TransactionsClient({ initialTransactions, categories, openNewModalOnMount = false }: TransactionsClientProps) {
  const [prevInitialTransactions, setPrevInitialTransactions] = useState(initialTransactions)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

  if (initialTransactions !== prevInitialTransactions) {
    setPrevInitialTransactions(initialTransactions)
    setTransactions(initialTransactions)
  }

  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(openNewModalOnMount)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const [formDescription, setFormDescription] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formType, setFormType] = useState<'income' | 'expense'>('expense')
  const [formCategoryId, setFormCategoryId] = useState('')
  const [formDate, setFormDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [formPaymentMethod, setFormPaymentMethod] = useState('pix')
  const [formStatus, setFormStatus] = useState<'paid' | 'pending'>('paid')
  const [formNotes, setFormNotes] = useState('')

  const handleOpenEdit = (tx: Transaction) => {
    setSelectedTx(tx)
    setFormDescription(tx.description); setFormAmount(tx.amount.toString()); setFormType(tx.type);
    setFormCategoryId(tx.category_id || ''); setFormDate(tx.date); setFormPaymentMethod(tx.payment_method);
    setFormStatus(tx.status); setFormNotes(tx.notes || ''); setIsEditOpen(true);
  }

  const handleOpenDelete = (tx: Transaction) => { setSelectedTx(tx); setIsDeleteOpen(true); }

  const resetAddForm = () => {
    setFormDescription(''); setFormAmount(''); setFormType('expense'); setFormCategoryId('');
    setFormDate(format(new Date(), 'yyyy-MM-dd')); setFormPaymentMethod('pix'); setFormStatus('paid'); setFormNotes('');
  }

  const filteredFormCategories = categories.filter(c => c.type === formType)

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formDescription || !formAmount || !formDate) return toast.error('Preencha os obrigatórios.')
    startTransition(async () => {
      const res = await createTransaction({ description: formDescription, amount: parseFloat(formAmount), type: formType, category_id: formCategoryId || null, date: formDate, payment_method: formPaymentMethod, status: formStatus, notes: formNotes })
      if (res.error) toast.error(res.error)
      else { toast.success('Lançamento realizado!'); setIsAddOpen(false); resetAddForm(); }
    })
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' ? true : tx.type === typeFilter
    const matchesCategory = categoryFilter === 'all' ? true : tx.category_id === categoryFilter
    const matchesMonth = monthFilter === 'all' ? true : tx.date.substring(0, 7) === monthFilter
    return matchesSearch && matchesType && matchesCategory && matchesMonth
  })

  const uniqueMonths = Array.from(new Set(transactions.map(tx => tx.date.substring(0, 7)))).sort().reverse()
  const getMonthLabel = (ym: string) => {
    const [y, m] = ym.split('-'); const names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${names[parseInt(m) - 1]} ${y}`
  }

  return (
    <div className="space-y-8 md:space-y-10 font-jakarta">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight font-display-hero">Transações</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-medium italic">Gerencie o fluxo de entradas e saídas do seu caixa.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={
            <button className="w-full sm:w-auto bg-primary text-on-primary font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Novo Lançamento</span>
            </button>
          } />
          <DialogContent className="max-w-md rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-none">
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-black text-on-surface">Lançar Transação</DialogTitle>
                <DialogDescription className="font-medium text-on-surface-variant">Registre uma nova movimentação financeira.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label className="font-bold ml-1">Tipo</Label>
                   <Select value={formType} onValueChange={(v: any) => { setFormType(v); setFormCategoryId(''); }}>
                      <SelectTrigger className="rounded-xl py-6 bg-surface border-outline-variant/30"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="expense">Saída</SelectItem><SelectItem value="income">Entrada</SelectItem></SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="font-bold ml-1">Valor (R$)</Label>
                   <Input type="number" step="0.01" required value={formAmount} onChange={e => setFormAmount(e.target.value)} className="rounded-xl py-6 bg-surface border-outline-variant/30" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold ml-1">Descrição</Label>
                <Input required value={formDescription} onChange={e => setFormDescription(e.target.value)} className="rounded-xl py-6 bg-surface border-outline-variant/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="font-bold ml-1">Categoria</Label>
                    <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                       <SelectTrigger className="rounded-xl py-6 bg-surface border-outline-variant/30"><SelectValue placeholder="Selecione" /></SelectTrigger>
                       <SelectContent>{filteredFormCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label className="font-bold ml-1">Data</Label>
                    <Input type="date" required value={formDate} onChange={e => setFormDate(e.target.value)} className="rounded-xl py-6 bg-surface border-outline-variant/30" />
                 </div>
              </div>
              <div className="flex gap-3 pt-4">
                 <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="flex-1 py-6 font-bold rounded-xl">Cancelar</Button>
                 <Button type="submit" disabled={isPending} className="flex-1 bg-primary text-on-primary py-6 font-bold rounded-xl">Confirmar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border border-outline-variant/20 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 md:gap-4">
          <div className="relative">
             <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-outline-variant"><span className="material-symbols-outlined text-[20px]">search</span></span>
             <Input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-12 bg-surface border-outline-variant/30 rounded-2xl py-6" />
          </div>
          <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
            <SelectTrigger className="bg-surface border-outline-variant/30 rounded-2xl py-6"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos os tipos</SelectItem><SelectItem value="income">Entradas</SelectItem><SelectItem value="expense">Saídas</SelectItem></SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-surface border-outline-variant/30 rounded-2xl py-6"><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todas</SelectItem>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="bg-surface border-outline-variant/30 rounded-2xl py-6"><SelectValue placeholder="Mês" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos os meses</SelectItem>{uniqueMonths.map(m => <SelectItem key={m} value={m}>{getMonthLabel(m)}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block border border-outline-variant/10 rounded-3xl overflow-hidden">
          <Table>
            <TableHeader className="bg-surface">
              <TableRow className="border-none">
                <TableHead className="font-bold text-on-surface px-6 py-4">Descrição</TableHead>
                <TableHead className="font-bold text-on-surface">Categoria</TableHead>
                <TableHead className="font-bold text-on-surface">Valor</TableHead>
                <TableHead className="font-bold text-on-surface">Data</TableHead>
                <TableHead className="font-bold text-on-surface">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map(tx => (
                <TableRow key={tx.id} className="hover:bg-surface-container-low transition-colors border-outline-variant/5">
                  <TableCell className="px-6 py-4 font-bold text-on-surface">{tx.description}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ backgroundColor: `${tx.categories?.color}10`, color: tx.categories?.color, borderColor: `${tx.categories?.color}20` }}>
                      {tx.categories?.name || 'Sem Categoria'}
                    </span>
                  </TableCell>
                  <TableCell className={`font-black ${tx.type === 'income' ? 'text-tertiary' : 'text-on-surface'}`}>
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(Number(tx.amount))}
                  </TableCell>
                  <TableCell className="text-on-surface-variant font-medium text-xs">{format(new Date(tx.date + 'T12:00:00'), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${tx.status === 'paid' ? 'bg-tertiary-container/10 text-tertiary' : 'bg-orange-500/10 text-orange-500'}`}>
                       <span className="material-symbols-outlined text-[14px]">{tx.status === 'paid' ? 'check_circle' : 'schedule'}</span>
                       {tx.status === 'paid' ? 'Pago' : 'Pendente'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button className="p-2 hover:bg-surface-container-high rounded-xl transition-colors"><span className="material-symbols-outlined text-outline-variant">more_vert</span></button></DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-2xl p-2 shadow-xl border-outline-variant/20">
                         <DropdownMenuItem onClick={() => handleOpenEdit(tx)} className="rounded-xl font-bold gap-2"><span className="material-symbols-outlined text-[18px]">edit</span>Editar</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleOpenDelete(tx)} className="rounded-xl font-bold gap-2 text-error focus:bg-error-container/20"><span className="material-symbols-outlined text-[18px]">delete</span>Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {filteredTransactions.map(tx => {
            const isIncome = tx.type === 'income'
            return (
              <div key={tx.id} className="p-4 rounded-2xl bg-surface border border-outline-variant/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <p className="font-bold text-on-surface truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border" style={{ backgroundColor: `${tx.categories?.color}10`, color: tx.categories?.color, borderColor: `${tx.categories?.color}20` }}>
                        {tx.categories?.name || 'Sem Categoria'}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-medium">{format(new Date(tx.date + 'T12:00:00'), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><button className="p-1 hover:bg-surface-container-high rounded-lg transition-colors"><span className="material-symbols-outlined text-outline-variant">more_vert</span></button></DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded-2xl p-2 shadow-xl border-outline-variant/20">
                       <DropdownMenuItem onClick={() => handleOpenEdit(tx)} className="rounded-xl font-bold gap-2"><span className="material-symbols-outlined text-[18px]">edit</span>Editar</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleOpenDelete(tx)} className="rounded-xl font-bold gap-2 text-error focus:bg-error-container/20"><span className="material-symbols-outlined text-[18px]">delete</span>Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-outline-variant/5">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${tx.status === 'paid' ? 'bg-tertiary-container/10 text-tertiary' : 'bg-orange-500/10 text-orange-500'}`}>
                    <span className="material-symbols-outlined text-[12px]">{tx.status === 'paid' ? 'check_circle' : 'schedule'}</span>
                    {tx.status === 'paid' ? 'Pago' : 'Pendente'}
                  </div>
                  <p className={`font-black text-sm ${isIncome ? 'text-tertiary' : 'text-on-surface'}`}>
                    {isIncome ? '+' : '-'} {formatCurrency(Number(tx.amount))}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
