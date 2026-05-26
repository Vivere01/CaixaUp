'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '@/actions/transactions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [isPending, startTransition] = useTransition()

  // Filters State
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')

  // Modals Open State
  const [isAddOpen, setIsAddOpen] = useState(openNewModalOnMount)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Selected for Edit/Delete
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  // Form Fields State
  const [formDescription, setFormDescription] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formType, setFormType] = useState<'income' | 'expense'>('expense')
  const [formCategoryId, setFormCategoryId] = useState('')
  const [formDate, setFormDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [formPaymentMethod, setFormPaymentMethod] = useState('pix')
  const [formStatus, setFormStatus] = useState<'paid' | 'pending'>('paid')
  const [formNotes, setFormNotes] = useState('')

  // Sync initialTransactions on prop changes
  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  // Open Edit Modal
  const handleOpenEdit = (tx: Transaction) => {
    setSelectedTx(tx)
    setFormDescription(tx.description)
    setFormAmount(tx.amount.toString())
    setFormType(tx.type)
    setFormCategoryId(tx.category_id || '')
    setFormDate(tx.date)
    setFormPaymentMethod(tx.payment_method)
    setFormStatus(tx.status)
    setFormNotes(tx.notes || '')
    setIsEditOpen(true)
  }

  // Open Delete Modal
  const handleOpenDelete = (tx: Transaction) => {
    setSelectedTx(tx)
    setIsDeleteOpen(true)
  }

  // Reset Add Form
  const resetAddForm = () => {
    setFormDescription('')
    setFormAmount('')
    setFormType('expense')
    setFormCategoryId('')
    setFormDate(format(new Date(), 'yyyy-MM-dd'))
    setFormPaymentMethod('pix')
    setFormStatus('paid')
    setFormNotes('')
  }

  // Filter Categories by selected form type
  const filteredFormCategories = categories.filter(c => c.type === formType)

  // Handle Create Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formDescription || !formAmount || !formDate) {
      toast.error('Preencha os campos obrigatórios.')
      return
    }

    startTransition(async () => {
      const res = await createTransaction({
        description: formDescription,
        amount: parseFloat(formAmount),
        type: formType,
        category_id: formCategoryId || null,
        date: formDate,
        payment_method: formPaymentMethod,
        status: formStatus,
        notes: formNotes
      })

      if (res.error) {
        toast.error(`Erro ao criar transação: ${res.error}`)
      } else {
        toast.success('Transação criada com sucesso!')
        setIsAddOpen(false)
        resetAddForm()
      }
    })
  }

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTx) return

    if (!formDescription || !formAmount || !formDate) {
      toast.error('Preencha os campos obrigatórios.')
      return
    }

    startTransition(async () => {
      const res = await updateTransaction(selectedTx.id, {
        description: formDescription,
        amount: parseFloat(formAmount),
        type: formType,
        category_id: formCategoryId || null,
        date: formDate,
        payment_method: formPaymentMethod,
        status: formStatus,
        notes: formNotes
      })

      if (res.error) {
        toast.error(`Erro ao salvar alterações: ${res.error}`)
      } else {
        toast.success('Transação atualizada!')
        setIsEditOpen(false)
      }
    })
  }

  // Handle Delete Confirm
  const handleDeleteConfirm = () => {
    if (!selectedTx) return

    startTransition(async () => {
      const res = await deleteTransaction(selectedTx.id)
      if (res.error) {
        toast.error(`Erro ao excluir: ${res.error}`)
      } else {
        toast.success('Transação excluída.')
        setIsDeleteOpen(false)
      }
    })
  }

  // Apply filters on front-end
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' ? true : tx.type === typeFilter
    const matchesCategory = categoryFilter === 'all' ? true : tx.category_id === categoryFilter
    
    // Month Filter: matching Year-Month ('yyyy-MM')
    const matchesMonth = monthFilter === 'all' ? true : tx.date.substring(0, 7) === monthFilter

    return matchesSearch && matchesType && matchesCategory && matchesMonth
  })

  // Extract unique months from transactions list
  const uniqueMonths = Array.from(
    new Set(transactions.map(tx => tx.date.substring(0, 7)))
  ).sort().reverse() // Sort descending (most recent first)

  const getMonthLabel = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Transações</h1>
          <p className="text-slate-400 text-xs mt-1">Lançamentos de entrada e saída financeira do seu caixa.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 rounded-xl py-5 shadow-lg shadow-emerald-500/10">
              <Plus className="h-4 w-4" />
              <span>Nova Transação</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md rounded-2xl">
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Cadastrar Lançamento</DialogTitle>
                <DialogDescription className="text-slate-450 text-xs">Preencha as informações para registrar a movimentação.</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-350 text-xs">Tipo</Label>
                  <Select 
                    value={formType} 
                    onValueChange={(val: 'income' | 'expense') => {
                      setFormType(val)
                      setFormCategoryId('') // Reset category selection
                    }}
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="expense">Saída (Despesa)</SelectItem>
                      <SelectItem value="income">Entrada (Receita)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-350 text-xs">Valor (R$)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="bg-slate-950 border-slate-850 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Descrição</Label>
                <Input 
                  placeholder="Ex: Fornecedor de insumos, Venda de serviço..." 
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="bg-slate-950 border-slate-850 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-350 text-xs">Categoria</Label>
                  <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                    <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      {filteredFormCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-350 text-xs">Data</Label>
                  <Input 
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="bg-slate-950 border-slate-850 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-350 text-xs">Método</Label>
                  <Select value={formPaymentMethod} onValueChange={setFormPaymentMethod}>
                    <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                      <SelectItem value="bank_slip">Boleto Bancário</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                      <SelectItem value="other">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-350 text-xs">Status</Label>
                  <Select value={formStatus} onValueChange={(val: 'paid' | 'pending') => setFormStatus(val)}>
                    <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="paid">Pago / Recebido</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Notas (Opcional)</Label>
                <Input 
                  placeholder="Informações adicionais..." 
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="bg-slate-950 border-slate-850 rounded-xl"
                />
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddOpen(false)}
                  className="border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
                >
                  {isPending ? 'Salvando...' : 'Confirmar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Area */}
      <Card className="bg-slate-900 border-slate-850 text-white">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 h-4 w-4 my-auto" />
            <Input 
              placeholder="Buscar descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-950 border-slate-850 text-white rounded-xl placeholder-slate-500"
            />
          </div>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={(val: any) => setTypeFilter(val)}>
            <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
              <SelectValue placeholder="Filtrar Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="income">Entradas (Receitas)</SelectItem>
              <SelectItem value="expense">Saídas (Despesas)</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
              <SelectValue placeholder="Filtrar Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Filter */}
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
              <SelectValue placeholder="Filtrar Mês" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="all">Todos os meses</SelectItem>
              {uniqueMonths.map((m) => (
                <SelectItem key={m} value={m}>{getMonthLabel(m)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-slate-900 border-slate-850 text-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950 border-b border-slate-800">
            <TableRow>
              <TableHead className="text-slate-450 font-bold">Descrição</TableHead>
              <TableHead className="text-slate-450 font-bold">Categoria</TableHead>
              <TableHead className="text-slate-450 font-bold">Valor</TableHead>
              <TableHead className="text-slate-450 font-bold">Data</TableHead>
              <TableHead className="text-slate-450 font-bold">Método</TableHead>
              <TableHead className="text-slate-450 font-bold">Status</TableHead>
              <TableHead className="w-12 text-slate-450 font-bold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income'
                return (
                  <TableRow key={tx.id} className="border-b border-slate-800/60 hover:bg-slate-850/30 transition">
                    <TableCell className="font-semibold text-slate-200">{tx.description}</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-950 text-slate-400 border border-slate-800 font-medium px-2 py-0.5 rounded-lg">
                        {tx.categories?.name || 'Sem Categoria'}
                      </Badge>
                    </TableCell>
                    <TableCell className={`font-black ${isIncome ? 'text-emerald-400' : 'text-slate-250'}`}>
                      {isIncome ? '+' : '-'} {formatCurrency(Number(tx.amount))}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {format(new Date(tx.date + 'T12:00:00'), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-slate-450 uppercase font-semibold text-xs">{tx.payment_method}</TableCell>
                    <TableCell>
                      <Badge className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                        tx.status === 'paid' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {tx.status === 'paid' ? 'Pago' : 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white rounded-lg">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-900 border-slate-800 text-white">
                          <DropdownMenuItem onClick={() => handleOpenEdit(tx)} className="gap-2 focus:bg-slate-800 focus:text-white font-semibold">
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenDelete(tx)} className="gap-2 focus:bg-red-500/10 focus:text-red-400 font-semibold text-red-400">
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                  Nenhum lançamento encontrado para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md rounded-2xl">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Editar Lançamento</DialogTitle>
              <DialogDescription className="text-slate-450 text-xs">Modifique as informações do lançamento selecionado.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Tipo</Label>
                <Select 
                  value={formType} 
                  onValueChange={(val: 'income' | 'expense') => {
                    setFormType(val)
                    setFormCategoryId('')
                  }}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="expense">Saída (Despesa)</SelectItem>
                    <SelectItem value="income">Entrada (Receita)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Valor (R$)</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="bg-slate-950 border-slate-850 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-350 text-xs">Descrição</Label>
              <Input 
                placeholder="Descrição" 
                required
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="bg-slate-950 border-slate-850 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Categoria</Label>
                <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                  <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    {filteredFormCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Data</Label>
                <Input 
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="bg-slate-950 border-slate-850 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Método</Label>
                <Select value={formPaymentMethod} onValueChange={setFormPaymentMethod}>
                  <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="bank_slip">Boleto Bancário</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Status</Label>
                <Select value={formStatus} onValueChange={(val: 'paid' | 'pending') => setFormStatus(val)}>
                  <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="paid">Pago / Recebido</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-350 text-xs">Notas (Opcional)</Label>
              <Input 
                placeholder="Notas" 
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="bg-slate-950 border-slate-850 rounded-xl"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditOpen(false)}
                className="border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
              >
                {isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-sm rounded-2xl text-center">
          <div className="py-4">
            <Trash2 className="mx-auto h-10 w-10 text-red-500 mb-3" />
            <h3 className="text-lg font-bold">Excluir Lançamento</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Você tem certeza que deseja excluir esta transação? Essa ação é permanente e não poderá ser desfeita.
            </p>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              className="border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 w-full"
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              disabled={isPending}
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-650 text-white font-bold rounded-xl w-full"
            >
              {isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
