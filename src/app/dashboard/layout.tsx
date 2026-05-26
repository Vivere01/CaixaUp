import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SidebarNav } from '@/components/custom/sidebar-nav'
import { Toaster } from '@/components/ui/sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch company/profile info
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, companies(*)')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.company_id) {
    redirect('/onboarding')
  }

  const companyName = profile.companies?.name || 'Sua Empresa'
  const userName = profile.full_name || profile.email

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <SidebarNav companyName={companyName} userName={userName} />
      <main className="flex-1 overflow-y-auto max-h-screen text-slate-100 bg-slate-950">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
      <Toaster position="top-right" theme="dark" />
    </div>
  )
}
