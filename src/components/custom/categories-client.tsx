'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/actions/categories'
import { toast } from 'sonner'
import * as Icons from 'lucide-react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Lock,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  is_default: boolean
}

interface CategoriesClientProps {
  initialCategories: Category[]
}

const colorPresets = [
  { value: '#10b981', name: 'Esmeralda' },
  { value: '#3b82f6', name: 'Azul' },
  { value: '#6366f1', name: 'Índigo' },
  { value: '#8b5cf6', name: 'Roxo' },
  { value: '#ec4899', name: 'Rosa' },
  { value: '#f43f5e', name: 'Carmim' },
  { value: '#f97316', name: 'Laranja' },
  { value: '#f59e0b', name: 'Âmbar' },
  { value: '#14b8a6', name: 'Menta' },
  { value: '#06b6d4', name: 'Ciano' },
  { value: '#6b7280', name: 'Cinza' }
]

const iconPresets = [
  'ShoppingBag', 'Briefcase', 'TrendingUp', 'DollarSign', 'Truck', 
  'Users', 'Percent', 'Home', 'Megaphone', 'Cpu', 'Settings', 
  'UserCheck', 'CreditCard', 'Coffee', 'Utensils', 'Car', 
  'Wrench', 'BookOpen', 'Heart', 'Tag'
]

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name] || Tag
  return <IconComponent className={className} />
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isPending, startTransition] = useTransition()

  // Modals Open State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Selected Category
  const [selectedCat, setSelectedCat] = useState<Category | null>(null)

  // Form Fields
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState<'income' | 'expense'>('expense')
  const [formColor, setFormColor] = useState('#6b7280')
  const [formIcon, setFormIcon] = useState('Tag')

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const resetForm = () => {
    setFormName('')
    setFormType('expense')
    setFormColor('#6b7280')
    setFormIcon('Tag')
  }

  // Open Edit Dialog
  const handleOpenEdit = (cat: Category) => {
    setSelectedCat(cat)
    setFormName(cat.name)
    setFormType(cat.type)
    setFormColor(cat.color)
    setFormIcon(cat.icon)
    setIsEditOpen(true)
  }

  // Open Delete Dialog
  const handleOpenDelete = (cat: Category) => {
    setSelectedCat(cat)
    setIsDeleteOpen(true)
  }

  // Handle Add Category
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName) {
      toast.error('Preencha o nome da categoria.')
      return
    }

    startTransition(async () => {
      const res = await createCategory({
        name: formName,
        type: formType,
        color: formColor,
        icon: formIcon
      })

      if (res.error) {
        toast.error(`Erro ao criar: ${res.error}`)
      } else {
        toast.success('Categoria criada!')
        setIsAddOpen(false)
        resetForm()
      }
    })
  }

  // Handle Edit Category
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCat) return
    if (!formName) {
      toast.error('O nome é obrigatório.')
      return
    }

    startTransition(async () => {
      const res = await updateCategory(selectedCat.id, {
        name: formName,
        color: formColor,
        icon: formIcon
      })

      if (res.error) {
        toast.error(`Erro ao atualizar: ${res.error}`)
      } else {
        toast.success('Categoria atualizada!')
        setIsEditOpen(false)
      }
    })
  }

  // Handle Delete Category
  const handleDeleteConfirm = () => {
    if (!selectedCat) return

    startTransition(async () => {
      const res = await deleteCategory(selectedCat.id)
      if (res.error) {
        toast.error(`Erro ao excluir: ${res.error}`)
      } else {
        toast.success('Categoria excluída.')
        setIsDeleteOpen(false)
      }
    })
  }

  const incomes = categories.filter(c => c.type === 'income')
  const expenses = categories.filter(c => c.type === 'expense')

  const renderCategoryCard = (c: Category) => (
    <Card key={c.id} className="bg-slate-900 border-slate-850 text-white relative overflow-hidden group">
      <CardHeader className="flex flex-row items-center gap-3.5 pb-3">
        <div 
          className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: `${c.color}20`, color: c.color, border: `1px solid ${c.color}30` }}
        >
          <CategoryIcon name={c.icon} className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <CardTitle className="text-sm font-bold truncate pr-6">{c.name}</CardTitle>
          <CardDescription className="text-slate-500 text-[10px] uppercase font-semibold mt-0.5">
            {c.is_default ? 'Padrão do Sistema' : 'Customizada'}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Action Buttons (Hover-triggered on custom categories, otherwise locked) */}
      <CardContent className="pt-0 flex justify-end gap-2 border-t border-slate-850/40 mt-3 p-3">
        {c.is_default ? (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase p-1">
            <Lock className="h-3 w-3" />
            <span>Travada</span>
          </div>
        ) : (
          <>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => handleOpenEdit(c)}
              className="h-7 px-2 text-slate-400 hover:text-white rounded-lg text-xs font-semibold"
            >
              <Edit2 className="h-3 w-3 mr-1" />
              Editar
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => handleOpenDelete(c)}
              className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg text-xs font-semibold"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Excluir
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Categorias</h1>
          <p className="text-slate-400 text-xs mt-1">Organize suas movimentações em classificações lógicas.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={(val) => { setIsAddOpen(val); if(!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 rounded-xl py-5 shadow-lg shadow-emerald-500/10">
              <Plus className="h-4 w-4" />
              <span>Nova Categoria</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md rounded-2xl">
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Criar Categoria</DialogTitle>
                <DialogDescription className="text-slate-450 text-xs">Crie uma categoria personalizada para classificar suas movimentações.</DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Nome da Categoria</Label>
                <Input 
                  placeholder="Ex: Assinatura de Softwares, Fretes..." 
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="bg-slate-950 border-slate-850 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Tipo de Categoria</Label>
                <Select value={formType} onValueChange={(val: 'income' | 'expense') => setFormType(val)}>
                  <SelectTrigger className="bg-slate-950 border-slate-850 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="expense">Saída (Despesa / Custo)</SelectItem>
                    <SelectItem value="income">Entrada (Receita / Ganho)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Grid Selector */}
              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Selecione uma Cor</Label>
                <div className="grid grid-cols-6 gap-2">
                  {colorPresets.map(preset => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setFormColor(preset.value)}
                      className={`h-8 w-full rounded-lg transition-transform border border-slate-950 ${
                        formColor === preset.value ? 'scale-110 ring-2 ring-emerald-400' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              {/* Icon presets grid */}
              <div className="space-y-2">
                <Label className="text-slate-350 text-xs">Selecione um Ícone</Label>
                <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-950/40 border border-slate-850 rounded-xl">
                  {iconPresets.map(iconName => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormIcon(iconName)}
                      className={`p-2.5 rounded-lg flex items-center justify-center transition border ${
                        formIcon === iconName 
                          ? 'bg-slate-850 border-emerald-400 text-emerald-400' 
                          : 'border-slate-850 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      <CategoryIcon name={iconName} className="h-4 w-4" />
                    </button>
                  ))}
                </div>
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
                  {isPending ? 'Criando...' : 'Criar Categoria'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs list for Income and Expenses */}
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-850 p-1 rounded-xl">
          <TabsTrigger value="expenses" className="rounded-lg font-semibold text-xs px-6 py-2.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950">
            Saídas (Custos e Despesas) ({expenses.length})
          </TabsTrigger>
          <TabsTrigger value="incomes" className="rounded-lg font-semibold text-xs px-6 py-2.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950">
            Entradas (Receitas) ({incomes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {expenses.map(renderCategoryCard)}
          </div>
        </TabsContent>

        <TabsContent value="incomes" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {incomes.map(renderCategoryCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md rounded-2xl">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Editar Categoria</DialogTitle>
              <DialogDescription className="text-slate-450 text-xs">Altere as opções estéticas e de nome da sua categoria.</DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label className="text-slate-350 text-xs">Nome da Categoria</Label>
              <Input 
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-slate-950 border-slate-850 rounded-xl"
              />
            </div>

            {/* Color Grid Selector */}
            <div className="space-y-2">
              <Label className="text-slate-350 text-xs">Cor da Categoria</Label>
              <div className="grid grid-cols-6 gap-2">
                {colorPresets.map(preset => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFormColor(preset.value)}
                    className={`h-8 w-full rounded-lg transition-transform border border-slate-950 ${
                      formColor === preset.value ? 'scale-110 ring-2 ring-emerald-400' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* Icon presets grid */}
            <div className="space-y-2">
              <Label className="text-slate-350 text-xs">Ícone da Categoria</Label>
              <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-950/40 border border-slate-850 rounded-xl">
                {iconPresets.map(iconName => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setFormIcon(iconName)}
                    className={`p-2.5 rounded-lg flex items-center justify-center transition border ${
                      formIcon === iconName 
                        ? 'bg-slate-850 border-emerald-400 text-emerald-400' 
                        : 'border-slate-850 hover:bg-slate-900 text-slate-400'
                      }`}
                  >
                    <CategoryIcon name={iconName} className="h-4 w-4" />
                  </button>
                ))}
              </div>
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
            <h3 className="text-lg font-bold">Excluir Categoria</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Tem certeza que deseja excluir esta categoria? As transações vinculadas a ela passarão a constar como "Sem Categoria".
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
