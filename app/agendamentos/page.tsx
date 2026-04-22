import { createClient } from '@/lib/supabase/server'
import type { Agendamento, StatusAgendamento } from '@/types/database'
import Link from 'next/link'
import { CalendarPlus, CalendarX } from 'lucide-react'
import FiltroData from './_components/FiltroData'
import LinhaAgendamento from './_components/LinhaAgendamento'

const corStatus: Record<StatusAgendamento, { bg: string; text: string; label: string }> = {
  agendado:                 { bg: '#E6F1FB', text: '#185FA5', label: 'Agendado' },
  aguardando_confirmacao:   { bg: '#FAEEDA', text: '#854F0B', label: 'Aguardando' },
  confirmado:               { bg: '#E1F5EE', text: '#0F6E56', label: 'Confirmado' },
  cancelado:                { bg: '#FCEBEB', text: '#A32D2D', label: 'Cancelado' },
  reagendamento_solicitado: { bg: '#EEEDFE', text: '#534AB7', label: 'Reagend. sol.' },
  reagendado:               { bg: '#EDE9FE', text: '#4C1D95', label: 'Reagendado' },
  concluido:                { bg: '#F1EFE8', text: '#5F5E5A', label: 'Concluído' },
}

export default async function AgendamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>
}) {
  const params = await searchParams
  const hoje = new Date().toISOString().split('T')[0]
  const dataFiltro = params.data ?? hoje

  const supabase = await createClient()
  const { data } = await supabase
    .from('agendamentos')
    .select('*, clientes(*), servicos(*), profissionais(*)')
    .eq('data', dataFiltro)
    .order('hora_inicio', { ascending: true })

  const agendamentos = (data ?? []) as Agendamento[]

  const dataFormatada = new Date(dataFiltro + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#0F1A2E', letterSpacing: '-0.4px' }}>
            Agendamentos
          </h1>
          <p className="mt-1 text-sm capitalize" style={{ color: '#6B7280' }}>
            {dataFormatada}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FiltroData valor={dataFiltro} />
          <Link
            href="/agendamentos/novo"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#38C9A0', color: '#0F1A2E' }}
          >
            <CalendarPlus size={16} strokeWidth={2} />
            Novo agendamento
          </Link>
        </div>
      </div>

      {agendamentos.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-20"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: '#E8F8F2' }}
          >
            <CalendarX size={28} strokeWidth={1.5} style={{ color: '#38C9A0' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: '#0F1A2E' }}>
            Nenhum agendamento para este dia.
          </p>
          <p className="mt-1 text-sm" style={{ color: '#9CA3AF' }}>
            Clique em &quot;Novo agendamento&quot; para adicionar.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #F5F5F5' }}>
                {(['Hora', 'Cliente', 'Serviço', 'Profissional', 'Status'] as const).map(col => (
                  <th
                    key={col}
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: '#9CA3AF' }}
                  >
                    {col}
                  </th>
                ))}
                <th
                  className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#9CA3AF' }}
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((ag, i) => {
                const status = corStatus[ag.status]
                return (
                  <LinhaAgendamento
                    key={ag.id}
                    id={ag.id}
                    style={{ borderTop: i > 0 ? '1px solid #F5F5F5' : undefined }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium tabular-nums" style={{ color: '#0F1A2E' }}>
                        {ag.hora_inicio.slice(0, 5)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium" style={{ color: '#0F1A2E' }}>
                        {ag.clientes?.nome ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: '#6B7280' }}>
                        {ag.servicos?.nome ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: '#6B7280' }}>
                        {ag.profissionais?.nome ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: status.bg, color: status.text }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-medium" style={{ color: '#38C9A0' }}>
                        Ver →
                      </span>
                    </td>
                  </LinhaAgendamento>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
