'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, CalendarPlus, Users, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const itensNav = [
  { href: '/dashboard',      label: 'Dashboard',      Icone: LayoutDashboard },
  { href: '/agenda',         label: 'Agenda',          Icone: Calendar },
  { href: '/agendamentos',   label: 'Agendamentos',    Icone: CalendarPlus },
  { href: '/clientes',       label: 'Clientes',        Icone: Users },
  { href: '/configuracoes',  label: 'Configurações',   Icone: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 flex w-60 flex-col"
      style={{ backgroundColor: '#0F1A2E' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center"
          style={{ backgroundColor: '#38C9A0', borderRadius: '28%' }}
        >
          <svg width="20" height="16" viewBox="0 0 22 18" fill="none">
            <line x1="2" y1="2" x2="20" y2="2" stroke="#0F1A2E" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="20" y1="2" x2="2" y2="16" stroke="#0F1A2E" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="2" y1="16" x2="20" y2="16" stroke="#0F1A2E" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="20" cy="16" r="1.5" fill="#17594A"/>
          </svg>
        </div>
        <span className="text-xl font-semibold text-white" style={{ letterSpacing: '-0.4px' }}>
          zendli
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-0.5 px-3">
        {itensNav.map(({ href, label, Icone }) => {
          const ativo = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              style={
                ativo
                  ? { backgroundColor: '#38C9A0', color: '#0F1A2E' }
                  : { color: 'rgba(255,255,255,0.7)' }
              }
              onMouseEnter={e => { if (!ativo) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { if (!ativo) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <Icone size={17} strokeWidth={2} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <LogOut size={17} strokeWidth={2} />
          Sair
        </button>
      </div>
    </aside>
  )
}
