'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Agendamento, StatusAgendamento } from '@/types/database'

// Grid constants
const SLOT_HEIGHT = 64 // px per 30-min slot
const HORA_INICIO = 8
const HORA_FIM = 20
const INICIO_MIN = HORA_INICIO * 60
const TOTAL_SLOTS = ((HORA_FIM - HORA_INICIO) * 60) / 30 // 24 slots

const corStatus: Record<StatusAgendamento, { bg: string; border: string; text: string; label: string }> = {
  agendado:                 { bg: '#E6F1FB', border: '#185FA5', text: '#185FA5', label: 'Agendado' },
  aguardando_confirmacao:   { bg: '#FAEEDA', border: '#854F0B', text: '#854F0B', label: 'Aguardando' },
  confirmado:               { bg: '#E1F5EE', border: '#0F6E56', text: '#0F6E56', label: 'Confirmado' },
  cancelado:                { bg: '#FCEBEB', border: '#A32D2D', text: '#A32D2D', label: 'Cancelado' },
  reagendamento_solicitado: { bg: '#EEEDFE', border: '#534AB7', text: '#534AB7', label: 'Reagend. sol.' },
  reagendado:               { bg: '#EDE9FE', border: '#4C1D95', text: '#4C1D95', label: 'Reagendado' },
  concluido:                { bg: '#F1EFE8', border: '#5F5E5A', text: '#5F5E5A', label: 'Concluído' },
}

const slots: string[] = []
for (let h = HORA_INICIO; h < HORA_FIM; h++) {
  slots.push(`${String(h).padStart(2, '0')}:00`)
  slots.push(`${String(h).padStart(2, '0')}:30`)
}

function parsearMin(hora: string): number {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

function formatarDataDisplay(data: string): string {
  return new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function somarDia(data: string, delta: number): string {
  const d = new Date(data + 'T12:00:00')
  d.setDate(d.getDate() + delta)
  return d.toISOString().split('T')[0]
}

export default function AgendaPage() {
  const router = useRouter()
  const hoje = new Date().toISOString().split('T')[0]

  const [dataSelecionada, setDataSelecionada] = useState(hoje)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [carregando, setCarregando] = useState(true)

  const isHoje = dataSelecionada === hoje

  const carregarAgendamentos = useCallback(async (data: string) => {
    setCarregando(true)
    const supabase = createClient()
    const { data: resultado } = await supabase
      .from('agendamentos')
      .select('*, clientes(*), servicos(*), profissionais(*)')
      .eq('data', data)
      .order('hora_inicio', { ascending: true })
    setAgendamentos((resultado ?? []) as Agendamento[])
    setCarregando(false)
  }, [])

  useEffect(() => {
    carregarAgendamentos(dataSelecionada)
  }, [dataSelecionada, carregarAgendamentos])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-2xl font-semibold"
          style={{ color: '#0F1A2E', letterSpacing: '-0.4px' }}
        >
          Agenda
        </h1>

        <div className="flex items-center gap-3">
          {!isHoje && (
            <button
              onClick={() => setDataSelecionada(hoje)}
              className="rounded-xl px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#E8F8F2', color: '#17594A' }}
            >
              Hoje
            </button>
          )}

          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}
          >
            <button
              onClick={() => setDataSelecionada(d => somarDia(d, -1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-50"
              style={{ color: '#0F1A2E' }}
              aria-label="Dia anterior"
            >
              <ChevronLeft size={17} strokeWidth={2} />
            </button>

            <span
              className="min-w-56 select-none text-center text-sm font-medium capitalize"
              style={{ color: '#0F1A2E' }}
            >
              {formatarDataDisplay(dataSelecionada)}
            </span>

            <button
              onClick={() => setDataSelecionada(d => somarDia(d, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-50"
              style={{ color: '#0F1A2E' }}
              aria-label="Próximo dia"
            >
              <ChevronRight size={17} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Grade */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}
      >
        {carregando ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              Carregando...
            </p>
          </div>
        ) : (
          <div className="flex">
            {/* Coluna de horários */}
            <div
              className="w-16 flex-shrink-0"
              style={{ borderRight: '1px solid #F0F0F0' }}
            >
              {slots.map((slot, i) => (
                <div
                  key={slot}
                  className="flex items-start justify-end pr-3 pt-1.5"
                  style={{
                    height: SLOT_HEIGHT,
                    borderTop: i > 0 ? '1px solid #F5F5F5' : undefined,
                  }}
                >
                  <span
                    className="text-xs tabular-nums leading-none"
                    style={{ color: '#9CA3AF' }}
                  >
                    {slot}
                  </span>
                </div>
              ))}
            </div>

            {/* Área de agendamentos */}
            <div
              className="relative flex-1"
              style={{ height: TOTAL_SLOTS * SLOT_HEIGHT }}
            >
              {/* Linhas divisórias */}
              {slots.map((slot, i) => (
                <div
                  key={`linha-${slot}`}
                  className="pointer-events-none absolute left-0 right-0"
                  style={{
                    top: i * SLOT_HEIGHT,
                    borderTop: i > 0 ? '1px solid #F5F5F5' : undefined,
                  }}
                />
              ))}

              {/* Slots clicáveis para criar agendamento */}
              {slots.map((slot, i) => (
                <div
                  key={`slot-${slot}`}
                  onClick={() =>
                    router.push(
                      `/agendamentos/novo?data=${dataSelecionada}&hora=${slot}`,
                    )
                  }
                  className="group absolute left-0 right-0 cursor-pointer"
                  style={{ top: i * SLOT_HEIGHT, height: SLOT_HEIGHT, zIndex: 1 }}
                >
                  <div className="flex h-full items-center px-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-sm leading-none"
                      style={{ backgroundColor: '#E8F8F2', color: '#38C9A0' }}
                    >
                      +
                    </span>
                  </div>
                </div>
              ))}

              {/* Cards de agendamento */}
              {agendamentos.map(ag => {
                const inicioMin = parsearMin(ag.hora_inicio)
                const fimMin = parsearMin(ag.hora_fim)
                const duracaoMin = Math.max(fimMin - inicioMin, 30)
                const top = ((inicioMin - INICIO_MIN) / 30) * SLOT_HEIGHT
                const cardHeight = (duracaoMin / 30) * SLOT_HEIGHT
                const cor = corStatus[ag.status]

                return (
                  <div
                    key={ag.id}
                    onClick={e => {
                      e.stopPropagation()
                      router.push(`/agendamentos/${ag.id}`)
                    }}
                    className="absolute cursor-pointer overflow-hidden rounded-lg px-2.5 py-1.5 transition-opacity hover:opacity-90"
                    style={{
                      top: top + 2,
                      height: cardHeight - 4,
                      left: 8,
                      right: 8,
                      backgroundColor: cor.bg,
                      borderLeft: `3px solid ${cor.border}`,
                      zIndex: 2,
                    }}
                  >
                    <p
                      className="truncate text-xs font-semibold leading-tight"
                      style={{ color: cor.text }}
                    >
                      {ag.hora_inicio.slice(0, 5)} · {ag.clientes?.nome ?? '—'}
                    </p>

                    {cardHeight > 64 && (
                      <p
                        className="mt-0.5 truncate text-xs leading-tight"
                        style={{ color: cor.text, opacity: 0.8 }}
                      >
                        {ag.servicos?.nome ?? '—'}
                      </p>
                    )}

                    {cardHeight > 100 && (
                      <span
                        className="mt-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: cor.text,
                          border: `1px solid ${cor.border}`,
                        }}
                      >
                        {cor.label}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
