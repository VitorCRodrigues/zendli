'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0F1A2E' }}
    >
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ backgroundColor: '#F5FAF8' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#38C9A0', borderRadius: '28%' }}
          >
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
              <line x1="2" y1="2" x2="20" y2="2" stroke="#0F1A2E" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="20" y1="2" x2="2" y2="16" stroke="#0F1A2E" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="2" y1="16" x2="20" y2="16" stroke="#0F1A2E" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="16" r="1.5" fill="#17594A"/>
            </svg>
          </div>
          <span className="text-2xl font-semibold" style={{ color: '#0F1A2E', letterSpacing: '-0.4px' }}>
            zendli
          </span>
        </div>

        {/* Cabeçalho */}
        <h1 className="text-xl font-semibold mb-1" style={{ color: '#0F1A2E', letterSpacing: '-0.4px' }}>
          Bem-vinda de volta
        </h1>
        <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
          Acesse o painel da sua clínica
        </p>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="sua@clinica.com.br"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-colors"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#0F1A2E' }}
              onFocus={e => (e.target.style.borderColor = '#38C9A0')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-colors"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#0F1A2E' }}
              onFocus={e => (e.target.style.borderColor = '#38C9A0')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm px-3.5 py-2.5 rounded-xl" style={{ backgroundColor: '#FCEBEB', color: '#A32D2D' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="7" cy="7" r="6" stroke="#A32D2D" strokeWidth="1.5"/>
                <line x1="7" y1="4" x2="7" y2="7.5" stroke="#A32D2D" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="7" cy="9.5" r="0.75" fill="#A32D2D"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 mt-2"
            style={{ backgroundColor: '#38C9A0', color: '#0F1A2E', letterSpacing: '-0.2px' }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.backgroundColor = '#17594A'; e.currentTarget.style.color = '#FFFFFF' }}}
            onMouseLeave={e => { if (!loading) { e.currentTarget.style.backgroundColor = '#38C9A0'; e.currentTarget.style.color = '#0F1A2E' }}}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#9CA3AF' }}>
          Agendamento sem no-show.
        </p>
      </div>
    </div>
  )
}
