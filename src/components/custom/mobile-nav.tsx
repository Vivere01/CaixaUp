'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/actions/auth'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface MobileNavProps {
  companyName: string
  userName: string
  hasPhysicalStores?: boolean
}

export function MobileNav({ companyName, userName, hasPhysicalStores }: MobileNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: 'grid_view' },
    { name: 'Transações', href: '/dashboard/transactions', icon: 'receipt_long' },
    { name: 'Categorias', href: '/dashboard/categories', icon: 'sell' },
    { name: 'Importar', href: '/dashboard/import', icon: 'upload_file' },
    { name: 'Relatório DRE', href: '/dashboard/dre', icon: 'analytics' },
    ...(hasPhysicalStores ? [{ name: 'Lojas', href: '/dashboard/stores', icon: 'storefront' }] : []),
  ]

  return (
    <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-outline-variant/10 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[28px]">bar_chart_4_bars</span>
        <span className="text-headline-md font-display-hero font-bold text-primary">CaixaUp</span>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger render={
          <button className="p-2 text-on-surface">
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
        } />
        <DialogContent 
          showCloseButton={false}
          className="fixed inset-y-0 left-0 z-50 h-full w-[280px] border-none bg-white p-0 shadow-2xl transition-transform duration-300 ease-in-out data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 translate-y-0 top-0 sm:max-w-none rounded-none"
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                    <span className="material-symbols-outlined text-[24px]">bar_chart_4_bars</span>
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] block mb-0.5">CaixaUp</span>
                    <span className="font-bold text-sm text-on-surface block truncate leading-none">{companyName}</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-surface-container rounded-xl transition-colors">
                  <span className="material-symbols-outlined text-outline text-[24px]">close</span>
                </button>
              </div>

              <nav className="space-y-1.5 pt-4">
                {links.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
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

            <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="h-10 w-10 rounded-xl bg-secondary-container/30 flex items-center justify-center text-secondary font-bold border border-secondary/10">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-on-surface block truncate leading-none mb-1">{userName}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                    <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false)
                  signOut()
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-error hover:bg-error-container/50 transition-all border border-transparent hover:border-error/10"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
