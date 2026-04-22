export function templateConfirmacaoInicial(dados: {
  nomeCliente: string
  servico: string
  data: string
  hora: string
  profissional: string
}) {
  return `Olá, ${dados.nomeCliente}! 👋

Seu agendamento foi confirmado:

📋 *${dados.servico}*
👩 ${dados.profissional}
📅 ${dados.data}
🕐 ${dados.hora}

Para confirmar sua presença, responda:
*1* - Confirmar ✅
*2* - Cancelar ❌
*3* - Reagendar 🔄

_Zendli — Agendamento sem no-show_`
}

export function templateLembrete48h(dados: {
  nomeCliente: string
  servico: string
  data: string
  hora: string
}) {
  return `Olá, ${dados.nomeCliente}! ⏰

Lembrete: você tem um agendamento *amanhã*!

📋 *${dados.servico}*
📅 ${dados.data}
🕐 ${dados.hora}

Responda:
*1* - Confirmar ✅
*2* - Cancelar ❌
*3* - Reagendar 🔄`
}

export function templateLembrete24h(dados: {
  nomeCliente: string
  servico: string
  hora: string
}) {
  return `Olá, ${dados.nomeCliente}! 🔔

Seu agendamento é *hoje* às ${dados.hora}!

📋 *${dados.servico}*

Responda:
*1* - Confirmar ✅
*2* - Cancelar ❌
*3* - Reagendar 🔄`
}

export function templateOpcoesReagendamento(opcoes: {
  data: string
  hora: string
}[]) {
  const lista = opcoes.map((o, i) => `*${i + 1}* - ${o.data} às ${o.hora}`).join('\n')
  return `Claro! Escolha um dos horários disponíveis:\n\n${lista}\n\nResponda com o número da opção desejada.`
}

export function templateCancelamentoConfirmado(nomeCliente: string) {
  return `Olá, ${nomeCliente}. Seu agendamento foi cancelado com sucesso. Quando quiser remarcar, é só nos chamar! 😊`
}
