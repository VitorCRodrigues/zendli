'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function formatarTelefone(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 11)
  if (nums.length === 0) return ''
  if (nums.length <= 2) return `(${nums}`
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`
}

const inputStyle = {
  borderColor: '#E5E7EB',
  color: '#0F1A2E',
}

export default function NovoClientePage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) {
      setErro('Nome é obrigatório.')
      return
    }
    if (telefone.replace(/\D/g, '').length < 10) {
      setErro('Telefone inválido. Use o formato (11) 99999-9999.')
      return
    }

    setSalvando(true)
    const supabase = createClient()
    const { error } = await supabase.from('clientes').insert({
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim() || null,
      observacoes: observacoes.trim() || null,
      ativo: true,
    })
    setSalvando(false)

    if (error) {
      setErro('Erro ao salvar cliente. Tente novamente.')
      return
    }
    router.push('/clientes')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: '#0F1A2E', letterSpacing: '-0.4px' }}>
          Novo cliente
        </h1>
      </div>

      <div
        className="max-w-xl rounded-2xl p-8"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0F1A2E' }}>
              Nome completo <span style={{ color: '#A32D2D' }}>*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Maria Silva"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#38C9A0] transition-colors"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0F1A2E' }}>
              Telefone <span style={{ color: '#A32D2D' }}>*</span>
            </label>
            <input
              type="tel"
              value={telefone}
              onChange={e => setTelefone(formatarTelefone(e.target.value))}
              placeholder="(11) 99999-9999"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#38C9A0] transition-colors"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0F1A2E' }}>
              E-mail{' '}
              <span className="text-xs font-normal" style={{ color: '#9CA3AF' }}>
                (opcional)
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="maria@email.com"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#38C9A0] transition-colors"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0F1A2E' }}>
              Observações{' '}
              <span className="text-xs font-normal" style={{ color: '#9CA3AF' }}>
                (opcional)
              </span>
            </label>
            <textarea
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              placeholder="Informações adicionais sobre o cliente..."
              rows={3}
              className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#38C9A0] transition-colors"
              style={inputStyle}
            />
          </div>

          {erro && (
            <p
              className="rounded-xl px-4 py-3 text-sm"
              style={{ backgroundColor: '#FCEBEB', color: '#A32D2D' }}
            >
              {erro}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#38C9A0', color: '#0F1A2E' }}
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
            <Link
              href="/clientes"
              className="flex-1 rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
