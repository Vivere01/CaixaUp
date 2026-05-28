'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/actions/auth'
import { clearTransactions } from '@/actions/transactions'
import { toast } from 'sonner'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SidebarNavProps {
  companyName: string
  userName: string
  hasPhysicalStores?: boolean
}

export function SidebarNav({ companyName, userName, hasPhysicalStores }: SidebarNavProps) {
  const pathname = usePathname()
  const [isClearOpen, setIsClearOpen] = React.useState(false)

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: 'grid_view' },
    { name: 'Transações', href: '/dashboard/transactions', icon: 'receipt_long' },
    { name: 'Categorias', href: '/dashboard/categories', icon: 'sell' },
    { name: 'Importar', href: '/dashboard/import', icon: 'upload_file' },
    { name: 'Relatório DRE', href: '/dashboard/dre', icon: 'analytics' },
    ...(hasPhysicalStores ? [{ name: 'Lojas', href: '/dashboard/stores', icon: 'storefront' }] : []),
  ]

  const handleClearData = async () => {
    const res = await clearTransactions()
    if (res.error) toast.error(res.error)
    else {
      toast.success('Todos os dados foram limpos.')
      setIsClearOpen(false)
    }
  }

  return (
    <aside className="hidden lg:flex w-72 bg-white border-r border-outline-variant/20 flex-col justify-between h-screen sticky top-0 font-jakarta shadow-sm z-40">
      {/* Upper Section */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
        {/* Company Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-outline-variant/10">
          <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0 border border-primary/10 shadow-inner">
            <span className="material-symbols-outlined text-[28px]">bar_chart_4_bars</span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] block mb-0.5">CaixaUp</span>
            <span className="font-bold text-sm text-on-surface block truncate leading-none">{companyName}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-on-primary' : 'text-outline group-hover:text-primary'}`}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Section (Bottom) */}
      <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/10 space-y-2">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-secondary-container/30 flex items-center justify-center text-secondary font-bold border border-secondary/10">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-xs text-on-surface block truncate leading-none mb-1">{userName}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-sm shadow-tertiary/20" />
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>

        <Dialog open={isClearOpen} onOpenChange={setIsClearOpen}>
          <DialogTrigger render={
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-all border border-transparent">
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              <span>Limpar Painel</span>
            </button>
          } />
          <DialogContent className="max-w-sm rounded-3xl p-8 border-none">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-on-surface text-left">Limpar Painel?</DialogTitle>
              <DialogDescription className="font-medium text-on-surface-variant text-left mt-2 leading-relaxed">
                Isso irá excluir permanentemente todos os seus lançamentos e dados do dashboard. Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 pt-6">
              <Button variant="ghost" onClick={() => setIsClearOpen(false)} className="flex-1 rounded-xl font-bold py-6">Cancelar</Button>
              <Button onClick={handleClearData} className="flex-1 bg-error text-on-error font-bold rounded-xl shadow-lg shadow-error/20 py-6">Confirmar</Button>
            </div>
          </DialogContent>
        </Dialog>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-error hover:bg-error-container/50 transition-all border border-transparent hover:border-error/10 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sair da Conta</span>
        </button>
      </div>
    </aside>
  )
}
