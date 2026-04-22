import { createClient } from '@/lib/supabase/server'
import { enviarMensagem } from '@/lib/whatsapp/send'
import { templateConfirmacaoInicial } from '@/lib/whatsapp/templates'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { agendamentoId } = await request.json()

    const supabase = await createClient()

    const { data: agendamento, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        clientes (nome, telefone),
        servicos (nome),
        profissionais (nome)
      `)
      .eq('id', agendamentoId)
      .single()

    if (error || !agendamento) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }

    const data = new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long',
    })
    const hora = agendamento.hora_inicio.slice(0, 5)

    const mensagem = templateConfirmacaoInicial({
      nomeCliente: agendamento.clientes.nome,
      servico: agendamento.servicos.nome,
      data,
      hora,
      profissional: agendamento.profissionais.nome,
    })

    await enviarMensagem(agendamento.clientes.telefone, mensagem)

    await supabase
      .from('agendamentos')
      .update({ status: 'aguardando_confirmacao' })
      .eq('id', agendamentoId)

    await supabase.from('mensagens').insert({
      agendamento_id: agendamentoId,
      tipo: 'confirmacao_inicial',
      conteudo: mensagem,
      status_envio: 'enviada',
      enviada_em: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao enviar confirmação:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
