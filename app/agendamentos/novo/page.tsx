'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Cliente, Servico, Profissional, OrigemAgendamento } from '@/types/database'

function calcularHoraFim(horaInicio: string, duracaoMinutos: number): string {
  const [h, m] = horaInicio.split(':').map(Number)
  const total = h * 60 + m + duracaoMinutos
  const novaH = Math.floor(total / 60) % 24
  const novoM = total % 60
  return `${String(novaH).padStart(2, '0')}:${String(novoM).padStart(2, '0')}`
}

const origensLabel: Record<OrigemAgendamento, string> = {
  sistema: 'Sistema',
  whatsapp: 'WhatsApp',
  telefone: 'Telefone',
  presencial: 'Presencial',
}

const inputClass =
  'w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#38C9A0] transition-colors bg-white'
const inputStyle = { borderColor: '#E5E7EB', color: '#0F1A2E' }

export default function NovoAgendamentoPage() {
  const router = useRouter()

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [carregando, setCarregando] = useState(true)

  const [clienteId, setClienteId] = useState('')
  const [servicoId, setServicoId] = useState('')
  const [profissionalId, setProfissionalId] = useState('')
  const [data, setData] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [origem, setOrigem] = useState<OrigemAgendamento>('sistema')
  const [observacoes, setObservacoes] = useState('')

  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const hoje = new Date().toISOString().split('T')[0]

  const servicoSelecionado = servicos.find(s => s.id === servicoId)
  const horaFim =
    servicoSelecionado && horaInicio
      ? calcularHoraFim(horaInicio, servicoSelecionado.duracao_minutos)
      : null

  useEffect(() => {
    async function carregarDados() {
      const supabase = createClient()
      const [resClientes, resServicos, resProfissionais] = await Promise.all([
        supabase.from('clientes').select('*').eq('ativo', true).order('nome'),
        supabase.from('servicos').select('*').eq('ativo', true).order('nome'),
        supabase.from('profissionais').select('*').eq('ativo', true).order('nome'),
      ])
      setClientes((resClientes.data ?? []) as Cliente[])
      setServicos((resServicos.data ?? []) as Servico[])
      setProfissionais((resProfissionais.data ?? []) as Profissional[])
      setCarregando(false)
    }
    carregarDados()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (!clienteId || !servicoId || !profissionalId || !data || !horaInicio) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    setSalvando(true)
    const supabase = createClient()

    const { data: agInserted, error: agError } = await supabase
      .from('agendamentos')
      .insert({
        cliente_id: clienteId,
        servico_id: servicoId,
        profissional_id: profissionalId,
        data,
        hora_inicio: horaInicio,
        hora_fim: horaFim ?? horaInicio,
        status: 'agendado',
        origem,
        observacoes: observacoes.trim() || null,
      })
      .select()
      .single()

    if (agError || !agInserted) {
      setErro('Erro ao criar agendamento. Tente novamente.')
      setSalvando(false)
      return
    }

    const cliente = clientes.find(c => c.id === clienteId)
    const servico = servicos.find(s => s.id === servicoId)
    const dataFormatada = new Date(data + 'T12:00:00').toLocaleDateString('pt-BR')
    const conteudo = `Olá, ${cliente?.nome ?? 'cliente'}! Seu agendamento de ${servico?.nome ?? 'serviço'} foi marcado para ${dataFormatada} às ${horaInicio}. Aguardamos sua confirmação.`

    await supabase.from('mensagens').insert({
      agendamento_id: agInserted.id,
      tipo: 'confirmacao_inicial',
      conteudo,
      status_envio: 'pendente',
    })

    setSalvando(false)
    router.push('/agendamentos')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: '#0F1A2E', letterSpacing: '-0.4px' }}>
          Novo agendamento
        </h1>
      </div>

      <div
        className="max-w-xl rounded-2xl p-8"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}
      >
        {carregando ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Carregando dados...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cliente */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0F1A2E' }}>
                Cliente <span style={{ color: '#A32D2D' }}>*</span>
              </label>
              <select
                value={clienteId}
                onChange={e => setClienteId(e.target.value)}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">Selecione um cliente</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Serviço */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0F1A2E' }}>
                Serviço <span style={{ color: '#A32D2D' }}>*</span>
              </label>
              <select
                value={servicoId}
                onChange={e => setServicoId(e.target.value)}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">Selecione um serviço</option>
                {servicos.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
              {servicoSelecionado && (
                <p className="mt-1.5 text-xs" style={{ color: '#6B7280' }}>
                  {servicoSelecionado.duracao_minutos} min
                  {servicoSelecionado.preco != null
                    ? ` · R$ ${servicoSelecionado.preco.toFixed(2).replace('.', ',')}`
                    : ''}
                </p>
              )}
            </div>

            {/* Profissional */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0F1A2E' }}>
                Profissional <span style={{ color: '#A32D2D' }}>*</span>
              </label>
              <select
                value={profissionalId}
                onChange={e => setProfissionalId(e.target.value)}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">Selecione um profissional</option>
                {profissionais.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0F1A2E' }}>
                Data <span style={{ color: '#A32D2D' }}>*</span>
              </label>
              <input
                type="date"
                value={data}
                min={hoje}
                onChange={e => setData(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            {/* Hora de início */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0F1A2E' }}>
                Hora de início <span style={{ color: '#A32D2D' }}>*</span>
              </label>
              <input
                type="time"
                value={horaInicio}
                step="900"
                onChange={e => setHoraInicio(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
              {horaFim && (
                <p className="mt-1.5 text-xs" style={{ color: '#6B7280' }}>
                  Término previsto: {horaFim}
                </p>
              )}
            </div>

            {/* Origem */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0F1A2E' }}>
                Origem
              </label>
              <select
                value={origem}
                onChange={e => setOrigem(e.target.value as OrigemAgendamento)}
                className={inputClass}
                style={inputStyle}
              >
                {(Object.entries(origensLabel) as [OrigemAgendamento, string][]).map(
                  ([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Observações */}
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
                placeholder="Informações adicionais..."
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
                {salvando ? 'Salvando...' : 'Salvar agendamento'}
              </button>
              <Link
                href="/agendamentos"
                className="flex-1 rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
