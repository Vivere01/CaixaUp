'use client'

import React, { useState, useTransition } from 'react'
import { createStore, finishStoreOnboarding } from '@/actions/stores'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function StoresOnboardingPage() {
  const [isPending, startTransition] = useTransition()
  const [storeName, setStoreName] = useState('')
  const [stores, setStores] = useState<string[]>([])

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeName) return

    startTransition(async () => {
      const formData = new FormData()
      formData.append('name', storeName)
      const res = await createStore(formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        setStores([...stores, storeName])
        setStoreName('')
        toast.success('Loja adicionada!')
      }
    })
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface font-jakarta relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-lg relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-on-surface">Configurar Lojas</h1>
          <p className="text-on-surface-variant text-sm">
            Adicione suas unidades físicas para separar o faturamento.
          </p>
        </div>

        <div className="bg-white border border-outline-variant/20 p-10 rounded-[2.5rem] shadow-xl shadow-primary/5 space-y-8">
          <form onSubmit={handleAddStore} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-on-surface font-semibold ml-1">Nome da Unidade/Loja</Label>
              <div className="flex gap-2">
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ex: Loja Centro, Unidade Shopping..."
                  className="py-6 bg-surface-container-lowest border-outline-variant/30 rounded-2xl transition-all"
                />
                <Button type="submit" disabled={isPending} className="h-auto px-6 rounded-2xl">
                  {isPending ? '...' : 'Add'}
                </Button>
              </div>
            </div>
          </form>

          {stores.length > 0 && (
            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-outline-variant uppercase tracking-widest block">Lojas Adicionadas:</Label>
              <div className="grid grid-cols-1 gap-2">
                {stores.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/10 text-xs font-bold">
                    <span className="material-symbols-outlined text-primary text-[18px]">store</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={() => finishStoreOnboarding()} 
            disabled={stores.length === 0}
            className="w-full bg-primary text-on-primary font-bold py-4 rounded-full shadow-lg shadow-primary/20"
          >
            Concluir e Ir para o Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
