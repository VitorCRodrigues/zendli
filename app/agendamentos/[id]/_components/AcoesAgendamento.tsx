'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { StatusAgendamento } from '@/types/database'

const statusFinal: StatusAgendamento[] = [
  'cancelado',
  'concluido',
  'reagendado',
  'reagendamento_solicitado',
]

const mensagemFinal: Partial<Record<StatusAgendamento, string>> = {
  cancelado: 'Este agendamento foi cancelado.',
  concluido: 'Atendimento concluído.',
  reagendado: 'Aguardando novo horário.',
  reagendamento_solicitado: 'Cliente solicitou reagendamento.',
}

type Acao = {
  label: string
  novoStatus: StatusAgendamento
  variante: 'jade' | 'vermelho'
}

const acoesPorStatus: Partial<Record<StatusAgendamento, Acao[]>> = {
  agendado: [
    { label: 'Enviar confirmação', novoStatus: 'aguardando_confirmacao', variante: 'jade' },
    { label: 'Cancelar agendamento', novoStatus: 'cancelado', variante: 'vermelho' },
  ],
  aguardando_confirmacao: [
    { label: 'Confirmar manualmente', novoStatus: 'confirmado', variante: 'jade' },
    { label: 'Cancelar agendamento', novoStatus: 'cancelado', variante: 'vermelho' },
  ],
  confirmado: [
    { label: 'Marcar como concluído', novoStatus: 'concluido', variante: 'jade' },
    { label: 'Cancelar agendamento', novoStatus: 'cancelado', variante: 'vermelho' },
  ],
}

export default function AcoesAgendamento({
  agendamentoId,
  status,
}: {
  agendamentoId: string
  status: StatusAgendamento
}) {
  const router = useRouter()
  const [atualizando, setAtualizando] = useState(false)
  const [erro, setErro] = useState('')

  async function atualizarStatus(novoStatus: StatusAgendamento) {
    setAtualizando(true)
    setErro('')
    const supabase = createClient()
    const { error } = await supabase
      .from('agendamentos')
      .update({ status: novoStatus })
      .eq('id', agendamentoId)
    setAtualizando(false)
    if (error) {
      setErro('Erro ao atualizar. Tente novamente.')
      return
    }
    router.refresh()
  }

  if (statusFinal.includes(status)) {
    return (
      <div
        className="rounded-2xl px-5 py-4"
        style={{ backgroundColor: '#F5F5F5' }}
      >
        <p className="text-sm" style={{ color: '#6B7280' }}>
          {mensagemFinal[status] ?? 'Agendamento em estado final.'}
        </p>
      </div>
    )
  }

  const acoes = acoesPorStatus[status]
  if (!acoes) return null

  return (
    <div className="space-y-2.5">
      {erro && (
        <p
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: '#FCEBEB', color: '#A32D2D' }}
        >
          {erro}
        </p>
      )}
      {acoes.map(acao => (
        <button
          key={acao.novoStatus}
          onClick={() => atualizarStatus(acao.novoStatus)}
          disabled={atualizando}
          className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
          style={
            acao.variante === 'jade'
              ? { backgroundColor: '#38C9A0', color: '#0F1A2E' }
              : {
                  backgroundColor: 'transparent',
                  color: '#A32D2D',
                  border: '1px solid #FCEBEB',
                }
          }
        >
          {atualizando ? '...' : acao.label}
        </button>
      ))}
    </div>
  )
}
