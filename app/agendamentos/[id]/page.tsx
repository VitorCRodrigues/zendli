import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type {
  Agendamento,
  Mensagem,
  StatusAgendamento,
  TipoMensagem,
  StatusEnvio,
  OrigemAgendamento,
} from '@/types/database'
import AcoesAgendamento from './_components/AcoesAgendamento'

// ─── Labels ──────────────────────────────────────────────────────────────────

const corStatus: Record<StatusAgendamento, { bg: string; text: string; label: string }> = {
  agendado:                 { bg: '#E6F1FB', text: '#185FA5', label: 'Agendado' },
  aguardando_confirmacao:   { bg: '#FAEEDA', text: '#854F0B', label: 'Aguardando confirmação' },
  confirmado:               { bg: '#E1F5EE', text: '#0F6E56', label: 'Confirmado' },
  cancelado:                { bg: '#FCEBEB', text: '#A32D2D', label: 'Cancelado' },
  reagendamento_solicitado: { bg: '#EEEDFE', text: '#534AB7', label: 'Reagendamento solicitado' },
  reagendado:               { bg: '#EDE9FE', text: '#4C1D95', label: 'Reagendado' },
  concluido:                { bg: '#F1EFE8', text: '#5F5E5A', label: 'Concluído' },
}

const tipoLabel: Record<TipoMensagem, string> = {
  confirmacao_inicial: 'Confirmação inicial',
  lembrete_48h:        'Lembrete 48h',
  lembrete_24h:        'Lembrete 24h',
  cancelamento:        'Cancelamento',
  reagendamento:       'Reagendamento',
  resposta_cliente:    'Resposta do cliente',
}

const corEnvio: Record<StatusEnvio, { bg: string; text: string; label: string }> = {
  pendente:  { bg: '#F5F5F5', text: '#6B7280', label: 'Pendente' },
  enviada:   { bg: '#E6F1FB', text: '#185FA5', label: 'Enviada' },
  entregue:  { bg: '#EEEDFE', text: '#534AB7', label: 'Entregue' },
  lida:      { bg: '#E1F5EE', text: '#0F6E56', label: 'Lida' },
  erro:      { bg: '#FCEBEB', text: '#A32D2D', label: 'Erro' },
}

const origemLabel: Record<OrigemAgendamento, string> = {
  sistema:    'Sistema',
  whatsapp:   'WhatsApp',
  telefone:   'Telefone',
  presencial: 'Presencial',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatarData(data: string): string {
  return new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatarDataHora(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function calcularDuracao(horaInicio: string, horaFim: string): number {
  const [h1, m1] = horaInicio.split(':').map(Number)
  const [h2, m2] = horaFim.split(':').map(Number)
  return h2 * 60 + m2 - (h1 * 60 + m1)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoItem({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <p
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: '#9CA3AF' }}
      >
        {label}
      </p>
      <p className="mt-1 text-sm" style={{ color: '#0F1A2E' }}>
        {value}
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AgendamentoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: agData }, { data: mensagensData }] = await Promise.all([
    supabase
      .from('agendamentos')
      .select('*, clientes(*), servicos(*), profissionais(*)')
      .eq('id', id)
      .single(),
    supabase
      .from('mensagens')
      .select('*')
      .eq('agendamento_id', id)
      .order('created_at', { ascending: true }),
  ])

  if (!agData) redirect('/agendamentos')

  const ag = agData as Agendamento
  const mensagens = (mensagensData ?? []) as Mensagem[]
  const status = corStatus[ag.status]
  const duracao = calcularDuracao(ag.hora_inicio, ag.hora_fim)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/agendamentos"
          className="mb-4 inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: '#6B7280' }}
        >
          <ChevronLeft size={16} strokeWidth={2} />
          Agendamentos
        </Link>

        <div className="flex items-start justify-between gap-4">
          <h1
            className="text-2xl font-semibold"
            style={{ color: '#0F1A2E', letterSpacing: '-0.4px' }}
          >
            {ag.clientes?.nome ?? 'Cliente'}
          </h1>
          <span
            className="flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-medium"
            style={{ backgroundColor: status.bg, color: status.text }}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="space-y-6 lg:col-span-2">
          {/* Informações */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}
          >
            <h2
              className="mb-5 text-sm font-semibold uppercase tracking-wider"
              style={{ color: '#9CA3AF' }}
            >
              Informações do agendamento
            </h2>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <InfoItem
                label="Data"
                value={formatarData(ag.data)}
                className="col-span-2"
              />
              <InfoItem
                label="Horário"
                value={`${ag.hora_inicio.slice(0, 5)} – ${ag.hora_fim.slice(0, 5)} (${duracao} min)`}
              />
              <InfoItem
                label="Origem"
                value={origemLabel[ag.origem]}
              />
              <InfoItem
                label="Serviço"
                value={[
                  ag.servicos?.nome,
                  ag.servicos?.duracao_minutos != null
                    ? `${ag.servicos.duracao_minutos} min`
                    : null,
                  ag.servicos?.preco != null
                    ? `R$ ${ag.servicos.preco.toFixed(2).replace('.', ',')}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              />
              <InfoItem
                label="Profissional"
                value={[ag.profissionais?.nome, ag.profissionais?.especialidade]
                  .filter(Boolean)
                  .join(' · ')}
              />
              {ag.observacoes && (
                <InfoItem
                  label="Observações"
                  value={ag.observacoes}
                  className="col-span-2"
                />
              )}
            </div>
          </div>

          {/* Mensagens */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}
          >
            <h2
              className="mb-5 text-sm font-semibold uppercase tracking-wider"
              style={{ color: '#9CA3AF' }}
            >
              Histórico de mensagens
            </h2>

            {mensagens.length === 0 ? (
              <p className="text-sm" style={{ color: '#9CA3AF' }}>
                Nenhuma mensagem enviada ainda.
              </p>
            ) : (
              <ul className="space-y-4">
                {mensagens.map((msg, i) => {
                  const envio = corEnvio[msg.status_envio]
                  return (
                    <li
                      key={msg.id}
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: '#F9FAFB',
                        borderTop: i > 0 ? undefined : undefined,
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: '#0F1A2E' }}
                        >
                          {tipoLabel[msg.tipo]}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: envio.bg,
                              color: envio.text,
                            }}
                          >
                            {envio.label}
                          </span>
                          <span className="text-xs" style={{ color: '#9CA3AF' }}>
                            {formatarDataHora(msg.created_at)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        {msg.conteudo}
                      </p>

                      {msg.resposta_cliente && (
                        <div
                          className="mt-3 rounded-lg px-3 py-2.5"
                          style={{
                            backgroundColor: '#E8F8F2',
                            borderLeft: '3px solid #38C9A0',
                          }}
                        >
                          <p
                            className="mb-0.5 text-xs font-medium"
                            style={{ color: '#17594A' }}
                          >
                            Resposta do cliente
                          </p>
                          <p className="text-sm" style={{ color: '#0F1A2E' }}>
                            {msg.resposta_cliente}
                          </p>
                          {msg.respondida_em && (
                            <p
                              className="mt-1 text-xs"
                              style={{ color: '#6B7280' }}
                            >
                              {formatarDataHora(msg.respondida_em)}
                            </p>
                          )}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Coluna lateral — ações */}
        <div className="lg:col-span-1">
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}
          >
            <h2
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: '#9CA3AF' }}
            >
              Ações
            </h2>
            <AcoesAgendamento agendamentoId={ag.id} status={ag.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
