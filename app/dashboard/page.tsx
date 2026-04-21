import { createClient } from '@/lib/supabase/server'
import type { Agendamento, StatusAgendamento } from '@/types/database'
import { CalendarDays, CheckCircle2, Clock, XCircle } from 'lucide-react'

function saudacao() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

function formatarData(data: Date) {
  return data.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const corStatus: Record<StatusAgendamento, { bg: string; text: string; label: string }> = {
  agendado:                 { bg: '#E6F1FB', text: '#185FA5', label: 'Agendado' },
  aguardando_confirmacao:   { bg: '#FAEEDA', text: '#854F0B', label: 'Aguardando' },
  confirmado:               { bg: '#E1F5EE', text: '#0F6E56', label: 'Confirmado' },
  cancelado:                { bg: '#FCEBEB', text: '#A32D2D', label: 'Cancelado' },
  reagendamento_solicitado: { bg: '#EEEDFE', text: '#534AB7', label: 'Reagend. sol.' },
  reagendado:               { bg: '#EDE9FE', text: '#4C1D95', label: 'Reagendado' },
  concluido:                { bg: '#F1EFE8', text: '#5F5E5A', label: 'Concluído' },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const hoje = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('agendamentos')
    .select('*, clientes(*), servicos(*), profissionais(*)')
    .eq('data', hoje)
    .order('hora_inicio', { ascending: true })

  const lista = (data ?? []) as Agendamento[]

  const total       = lista.length
  const confirmados = lista.filter(a => a.status === 'confirmado').length
  const pendentes   = lista.filter(a => a.status === 'agendado' || a.status === 'aguardando_confirmacao').length
  const cancelados  = lista.filter(a => a.status === 'cancelado').length

  const cards = [
    { label: 'Total hoje',   valor: total,       Icone: CalendarDays,  bg: '#E8F8F2', cor: '#17594A' },
    { label: 'Confirmados',  valor: confirmados, Icone: CheckCircle2,  bg: '#E1F5EE', cor: '#0F6E56' },
    { label: 'Pendentes',    valor: pendentes,   Icone: Clock,         bg: '#FAEEDA', cor: '#854F0B' },
    { label: 'Cancelados',   valor: cancelados,  Icone: XCircle,       bg: '#FCEBEB', cor: '#A32D2D' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: '#0F1A2E', letterSpacing: '-0.4px' }}>
          {saudacao()} 👋
        </h1>
        <p className="mt-1 text-sm capitalize" style={{ color: '#6B7280' }}>
          {formatarData(new Date())}
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        {cards.map(({ label, valor, Icone, bg, cor }) => (
          <div
            key={label}
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}
          >
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: bg }}
            >
              <Icone size={20} strokeWidth={2} style={{ color: cor }} />
            </div>
            <div className="text-3xl font-semibold" style={{ color: '#0F1A2E', letterSpacing: '-0.8px' }}>
              {valor}
            </div>
            <div className="mt-1 text-xs font-medium" style={{ color: '#9CA3AF', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Lista de agendamentos */}
      <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}>
        <div className="border-b px-6 py-4" style={{ borderColor: '#F5F5F5' }}>
          <h2 className="text-base font-semibold" style={{ color: '#0F1A2E', letterSpacing: '-0.3px' }}>
            Próximos agendamentos de hoje
          </h2>
        </div>

        {lista.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Nenhum agendamento para hoje.</p>
          </div>
        ) : (
          <ul>
            {lista.map((ag, i) => {
              const status = corStatus[ag.status]
              return (
                <li
                  key={ag.id}
                  className="flex items-center gap-4 px-6 py-4"
                  style={{ borderTop: i > 0 ? '1px solid #F5F5F5' : undefined }}
                >
                  <span
                    className="w-14 flex-shrink-0 text-sm font-medium tabular-nums"
                    style={{ color: '#0F1A2E' }}
                  >
                    {ag.hora_inicio.slice(0, 5)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" style={{ color: '#0F1A2E' }}>
                      {ag.clientes?.nome ?? '—'}
                    </p>
                    <p className="truncate text-xs" style={{ color: '#9CA3AF' }}>
                      {ag.servicos?.nome ?? '—'} · {ag.profissionais?.nome ?? '—'}
                    </p>
                  </div>

                  <span
                    className="flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ backgroundColor: status.bg, color: status.text }}
                  >
                    {status.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
