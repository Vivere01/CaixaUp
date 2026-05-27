'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Receipt, 
  Tags, 
  FileSpreadsheet, 
  LineChart, 
  LogOut
} from 'lucide-react'
import { signOut } from '@/actions/auth'

interface SidebarNavProps {
  companyName: string
  userName: string
}

export function SidebarNav({ companyName, userName }: SidebarNavProps) {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transações', href: '/dashboard/transactions', icon: Receipt },
    { name: 'Categorias', href: '/dashboard/categories', icon: Tags },
    { name: 'Importar Extrato', href: '/dashboard/import', icon: FileSpreadsheet },
    { name: 'DRE Relatório', href: '/dashboard/dre', icon: LineChart },
  ]

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 text-white">
      {/* Upper Section */}
      <div className="p-6 space-y-8 flex-1">
        {/* Company Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center text-slate-950 font-bold text-base flex-shrink-0">
            {companyName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">EMPRESA</span>
            <span className="font-bold text-sm text-slate-200 block truncate">{companyName}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive 
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Section (Bottom) */}
      <div className="p-6 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-300">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-xs text-slate-200 block truncate">{userName}</span>
            <span className="text-[10px] text-slate-500 block">Usuário Ativo</span>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair da Conta</span>
        </button>
      </div>
    </aside>
  )
}
