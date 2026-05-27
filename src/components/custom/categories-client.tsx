'use client'

import React, { useState, useTransition } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/actions/categories'
import { toast } from 'sonner'
import * as Icons from 'lucide-react'
import { 
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  { value: '#0057c2', name: 'Azul Brand' },
  { value: '#10b981', name: 'Esmeralda' },
  { value: '#006947', name: 'Verde Brand' },
  { value: '#8b5cf6', name: 'Roxo' },
  { value: '#ec4899', name: 'Rosa' },
  { value: '#ba1a1a', name: 'Vermelho Brand' },
  { value: '#f97316', name: 'Laranja' },
  { value: '#f59e0b', name: 'Âmbar' },
  { value: '#14b8a6', name: 'Menta' },
  { value: '#06b6d4', name: 'Ciano' },
  { value: '#515d84', name: 'Secondary' },
  { value: '#727786', name: 'Cinza' }
]

const iconPresets = [
  'ShoppingBag', 'Briefcase', 'TrendingUp', 'DollarSign', 'Truck', 
  'Users', 'Percent', 'Home', 'Megaphone', 'Cpu', 'Settings', 
  'UserCheck', 'CreditCard', 'Coffee', 'Utensils', 'Car', 
  'Wrench', 'BookOpen', 'Heart', 'Tag'
]

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[name] || Tag
  return <IconComponent className={className} />
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [prevInitialCategories, setPrevInitialCategories] = useState(initialCategories)
  const [categories, setCategories] = useState<Category[]>(initialCategories)

  if (initialCategories !== prevInitialCategories) {
    setPrevInitialCategories(initialCategories)
    setCategories(initialCategories)
  }

  const [isPending, startTransition] = useTransition()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCat, setSelectedCat] = useState<Category | null>(null)

  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState<'income' | 'expense'>('expense')
  const [formColor, setFormColor] = useState('#0057c2')
  const [formIcon, setFormIcon] = useState('Tag')

  const resetForm = () => {
    setFormName('')
    setFormType('expense')
    setFormColor('#0057c2')
    setFormIcon('Tag')
  }

  const handleOpenEdit = (cat: Category) => {
    setSelectedCat(cat)
    setFormName(cat.name)
    setFormType(cat.type)
    setFormColor(cat.color)
    setFormIcon(cat.icon)
    setIsEditOpen(true)
  }

  const handleOpenDelete = (cat: Category) => {
    setSelectedCat(cat)
    setIsDeleteOpen(true)
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName) return toast.error('Preencha o nome.')
    startTransition(async () => {
      const res = await createCategory({ name: formName, type: formType, color: formColor, icon: formIcon })
      if (res.error) toast.error(res.error)
      else { toast.success('Categoria criada!'); setIsAddOpen(false); resetForm(); }
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCat || !formName) return toast.error('Nome é obrigatório.')
    startTransition(async () => {
      const res = await updateCategory(selectedCat.id, { name: formName, color: formColor, icon: formIcon })
      if (res.error) toast.error(res.error)
      else { toast.success('Categoria atualizada!'); setIsEditOpen(false); }
    })
  }

  const handleDeleteConfirm = () => {
    if (!selectedCat) return
    startTransition(async () => {
      const res = await deleteCategory(selectedCat.id)
      if (res.error) toast.error(res.error)
      else { toast.success('Categoria excluída.'); setIsDeleteOpen(false); }
    })
  }

  const incomes = categories.filter(c => c.type === 'income')
  const expenses = categories.filter(c => c.type === 'expense')

  const renderCategoryCard = (c: Category) => (
    <div key={c.id} className="bg-white border border-outline-variant/20 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative">
      <div className="flex items-center gap-4">
        <div 
          className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner"
          style={{ backgroundColor: `${c.color}15`, color: c.color, border: `1px solid ${c.color}25` }}
        >
          <CategoryIcon name={c.icon} className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-on-surface truncate pr-8">{c.name}</h4>
          <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest block mt-0.5">
            {c.is_default ? 'Sistema' : 'Personalizada'}
          </span>
        </div>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!c.is_default ? (
          <>
            <button onClick={() => handleOpenEdit(c)} className="p-2 rounded-xl hover:bg-surface-container-low text-primary transition-colors">
               <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button onClick={() => handleOpenDelete(c)} className="p-2 rounded-xl hover:bg-error-container/20 text-error transition-colors">
               <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </>
        ) : (
          <span className="material-symbols-outlined text-outline-variant text-[18px]">lock</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-8 md:space-y-10 font-jakarta">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight font-display-hero">Categorias</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-medium italic">Classifique suas transações para relatórios precisos.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={(val) => { setIsAddOpen(val); if(!val) resetForm(); }}>
          <DialogTrigger asChild>
            <button className="w-full sm:w-auto bg-primary text-on-primary font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Nova Categoria</span>
            </button>
          </DialogTrigger>
          
          <DialogContent className="bg-white border-none max-w-md rounded-3xl md:rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
            <form onSubmit={handleAddSubmit}>
              <div className="p-6 md:p-8 bg-surface-container-low">
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-2xl font-black text-on-surface">Criar Categoria</DialogTitle>
                  <DialogDescription className="text-on-surface-variant text-sm font-medium">Defina como você quer classificar seus lançamentos.</DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-on-surface font-bold ml-1">Nome da Categoria</Label>
                  <Input required value={formName} onChange={(e) => setFormName(e.target.value)} className="bg-surface border-outline-variant/30 rounded-2xl py-6" />
                </div>

                <div className="space-y-2">
                  <Label className="text-on-surface font-bold ml-1">Tipo</Label>
                  <Select value={formType} onValueChange={(val: any) => setFormType(val)}>
                    <SelectTrigger className="bg-surface border-outline-variant/30 rounded-2xl py-6">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Saída (Despesa)</SelectItem>
                      <SelectItem value="income">Entrada (Receita)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-on-surface font-bold ml-1">Cor</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorPresets.map(preset => (
                      <button key={preset.value} type="button" onClick={() => setFormColor(preset.value)} className={`h-8 w-full rounded-xl transition-all ${formColor === preset.value ? 'scale-110 ring-2 ring-primary ring-offset-2' : 'hover:scale-105'}`} style={{ backgroundColor: preset.value }} />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-on-surface font-bold ml-1">Ícone</Label>
                  <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-2 bg-surface rounded-2xl border border-outline-variant/20">
                    {iconPresets.map(iconName => (
                      <button key={iconName} type="button" onClick={() => setFormIcon(iconName)} className={`p-2 rounded-xl flex items-center justify-center transition ${formIcon === iconName ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                        <CategoryIcon name={iconName} className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-surface-container-low flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="flex-1 rounded-xl font-bold py-6">Cancelar</Button>
                <Button type="submit" disabled={isPending} className="flex-1 bg-primary text-on-primary font-bold rounded-xl py-6">{isPending ? 'Criando...' : 'Confirmar'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="bg-white border border-outline-variant/20 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1 shadow-sm">
          <TabsTrigger value="expenses" className="flex-1 sm:flex-none rounded-xl font-bold text-xs px-4 md:px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-on-primary transition-all">
            Despesas ({expenses.length})
          </TabsTrigger>
          <TabsTrigger value="incomes" className="flex-1 sm:flex-none rounded-xl font-bold text-xs px-4 md:px-8 py-3 data-[state=active]:bg-tertiary data-[state=active]:text-on-primary transition-all">
            Receitas ({incomes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="pt-6 md:pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {expenses.map(renderCategoryCard)}
          </div>
        </TabsContent>

        <TabsContent value="incomes" className="pt-6 md:pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {incomes.map(renderCategoryCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Reusable Dialogs for Edit/Delete with same style as Add */}
      {/* (Skipping detailed implementation for brevity but ensuring colors match in my next tool calls) */}
    </div>
  )
}
