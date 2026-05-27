'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/actions/auth'

interface SidebarNavProps {
  companyName: string
  userName: string
}

export function SidebarNav({ companyName, userName }: SidebarNavProps) {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: 'grid_view' },
    { name: 'Transações', href: '/dashboard/transactions', icon: 'receipt_long' },
    { name: 'Categorias', href: '/dashboard/categories', icon: 'sell' },
    { name: 'Importar', href: '/dashboard/import', icon: 'upload_file' },
    { name: 'Relatório DRE', href: '/dashboard/dre', icon: 'analytics' },
  ]

  return (
    <aside className="w-72 bg-white border-r border-outline-variant/20 flex flex-col justify-between h-screen sticky top-0 font-jakarta shadow-sm z-40">
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
      <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/10 space-y-4">
        <div className="flex items-center gap-3 px-2">
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
