'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  useEffect(() => {
    const heroText = document.querySelector('h1')
    if (heroText) {
      heroText.classList.add('translate-y-4', 'opacity-0')
      setTimeout(() => {
        heroText.classList.remove('translate-y-4', 'opacity-0')
        heroText.classList.add('translate-y-0', 'opacity-100', 'transition-all', 'duration-1000')
      }, 100)
    }
  }, [])

  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen">
      {/* Navigation */}
      <nav className="full-width top-0 sticky z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">bar_chart_4_bars</span>
            <span className="text-headline-lg font-display-hero font-extrabold text-primary">CaixaUp</span>
          </div>
          <div className="hidden md:flex items-center gap-stack-lg">
            <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Recursos</a>
            <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Como Funciona</a>
            <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Preços</a>
            <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Sobre</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="text-on-surface-variant font-medium hover:text-primary px-4 py-2 transition-all">Entrar</button>
            </Link>
            <Link href="/signup">
              <button className="bg-primary text-on-primary font-bold px-6 py-3 rounded-full hover:bg-primary-container transition-all active:scale-95">Começar Grátis</button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="hero-gradient relative">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop pt-20 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col items-start gap-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[18px]">update</span>
              <span className="text-label-sm text-primary uppercase tracking-wider">Finanças com clareza</span>
            </div>
            <h1 className="font-display-hero text-display-hero text-on-surface">
              Gestão <br />
              <span className="text-primary">Inteligente.</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg">
              Transforme dados bancários em decisões estratégicas. Controle seu DRE, fluxo de caixa e margens com a simplicidade que você sempre quis.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link href="/signup">
                <button className="bg-primary text-on-primary font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-primary-container shadow-lg shadow-primary/20 transition-all active:scale-95 group">
                  Criar Conta Grátis
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </Link>
              <a className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all" href="#">
                <span className="material-symbols-outlined text-[24px]">play_circle</span>
                Ver demonstração
              </a>
            </div>
            {/* Small Features Row (Desktop only) */}
            <div className="hidden md:grid grid-cols-4 gap-8 pt-16">
              <div className="flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary bg-surface-container-low p-2 rounded-lg w-fit">verified_user</span>
                <div>
                  <h4 className="text-headline-md text-on-surface">Segurança</h4>
                  <p className="text-label-sm text-on-surface-variant">Seus dados protegidos</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary bg-surface-container-low p-2 rounded-lg w-fit">sync_alt</span>
                <div>
                  <h4 className="text-headline-md text-on-surface">Conexão Fácil</h4>
                  <p className="text-label-sm text-on-surface-variant">Integre em minutos</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary bg-surface-container-low p-2 rounded-lg w-fit">query_stats</span>
                <div>
                  <h4 className="text-headline-md text-on-surface">Insights Reais</h4>
                  <p className="text-label-sm text-on-surface-variant">Relatórios que geram valor</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary bg-surface-container-low p-2 rounded-lg w-fit">bolt</span>
                <div>
                  <h4 className="text-headline-md text-on-surface">Decisões Ágeis</h4>
                  <p className="text-label-sm text-on-surface-variant">Mais controle, menos planilhas</p>
                </div>
              </div>
            </div>
          </div>
          {/* Dashboard Preview */}
          <div className="lg:col-span-7 relative z-0">
            <div className="relative dashboard-shadow rounded-[2rem] overflow-hidden bg-white border border-outline-variant/20 transform rotate-[-1deg] transition-transform hover:rotate-0 duration-700">
              <img 
                alt="CaixaUp Dashboard Preview" 
                className="w-full h-auto object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRndfsVZzqsH4EJGp0LtTjYMOa8qoMvCX3Gn8Oqqr5Uk4PuNNcDkksuIeA2dAoNLKqymqauOT7cftpMYs8uXFg8lDjMaYhU0fFfFhmJvjOIDE4yQv2IKH_Km8Z_PnDNAI9I7ShbjqJysH53TKsaxbTaxHALdgUG1JazXjCjjwABD0FMH9wNnMPfqv4_MWLUPo-U8CItP7-q949vEOj2tLiH6Z4vb2O3-idRUrXwsMibCzpQ6POzH76jytJN4NiTGxnhnJ8Q3SVH_En"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-surface-container-highest rounded-full blur-[80px] opacity-60 -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
          </div>
        </section>

        {/* Mobile Features Section (visible on mobile) */}
        <section className="md:hidden px-margin-mobile py-16 grid grid-cols-2 gap-stack-md bg-white">
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-low">
            <span className="material-symbols-outlined text-primary">verified_user</span>
            <h4 className="font-bold text-on-surface">Segurança</h4>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-low">
            <span className="material-symbols-outlined text-primary">sync_alt</span>
            <h4 className="font-bold text-on-surface">Conexão Fácil</h4>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-low">
            <span className="material-symbols-outlined text-primary">query_stats</span>
            <h4 className="font-bold text-on-surface">Insights Reais</h4>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-low">
            <span className="material-symbols-outlined text-primary">bolt</span>
            <h4 className="font-bold text-on-surface">Decisões Ágeis</h4>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-surface py-20">
          <div className="max-w-container-max mx-auto px-margin-desktop text-center">
            <p className="text-label-sm text-primary uppercase tracking-[0.2em] font-bold mb-12">Empresas que confiam</p>
            <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">rocket_launch</span>
                <span className="font-display-hero text-headline-md font-bold text-on-surface-variant group-hover:text-primary transition-colors">TechStart</span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">circle_notifications</span>
                <span className="font-display-hero text-headline-md font-bold text-on-surface-variant group-hover:text-primary transition-colors">Innova</span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">hub</span>
                <span className="font-display-hero text-headline-md font-bold text-on-surface-variant group-hover:text-primary transition-colors">NEXUS</span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">trending_up</span>
                <span className="font-display-hero text-headline-md font-bold text-on-surface-variant group-hover:text-primary transition-colors">Eleva</span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">public</span>
                <span className="font-display-hero text-headline-md font-bold text-on-surface-variant group-hover:text-primary transition-colors">GlobalCo</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant/30">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-12 max-w-container-max mx-auto gap-stack-md">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[28px]">bar_chart_4_bars</span>
              <span className="text-headline-md font-display-hero font-bold text-primary">CaixaUp</span>
            </div>
            <p className="text-body-md text-on-surface-variant">Gestão financeira descomplicada para o seu negócio.</p>
            <p className="text-label-sm text-on-surface-variant">© 2024 CaixaUp. Todos os direitos reservados.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-stack-lg">
            <a className="text-on-surface-variant font-medium hover:underline transition-all" href="#">Termos de Uso</a>
            <a className="text-on-surface-variant font-medium hover:underline transition-all" href="#">Privacidade</a>
            <a className="text-on-surface-variant font-medium hover:underline transition-all" href="#">Contato</a>
            <a className="text-on-surface-variant font-medium hover:underline transition-all" href="#">Blog</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
