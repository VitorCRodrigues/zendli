export type StatusAgendamento =
  | 'agendado'
  | 'aguardando_confirmacao'
  | 'confirmado'
  | 'cancelado'
  | 'reagendamento_solicitado'
  | 'reagendado'
  | 'concluido'

export type OrigemAgendamento = 'sistema' | 'whatsapp' | 'telefone' | 'presencial'

export type TipoMensagem =
  | 'confirmacao_inicial'
  | 'lembrete_48h'
  | 'lembrete_24h'
  | 'cancelamento'
  | 'reagendamento'
  | 'resposta_cliente'

export type StatusEnvio = 'pendente' | 'enviada' | 'entregue' | 'lida' | 'erro'

export interface Cliente {
  id: string
  nome: string
  telefone: string
  email?: string
  observacoes?: string
  ativo: boolean
  created_at: string
}

export interface Profissional {
  id: string
  nome: string
  especialidade?: string
  ativo: boolean
  created_at: string
}

export interface Servico {
  id: string
  nome: string
  duracao_minutos: number
  preco?: number
  ativo: boolean
  created_at: string
}

export interface Disponibilidade {
  id: string
  profissional_id: string
  dia_semana: number
  hora_inicio: string
  hora_fim: string
  ativo: boolean
  created_at: string
}

export interface Agendamento {
  id: string
  cliente_id: string
  servico_id: string
  profissional_id: string
  data: string
  hora_inicio: string
  hora_fim: string
  status: StatusAgendamento
  origem: OrigemAgendamento
  observacoes?: string
  created_at: string
  updated_at: string
  // Relações (quando usar joins)
  clientes?: Cliente
  servicos?: Servico
  profissionais?: Profissional
}

export interface Mensagem {
  id: string
  agendamento_id: string
  tipo: TipoMensagem
  conteudo: string
  status_envio: StatusEnvio
  resposta_cliente?: string
  enviada_em?: string
  respondida_em?: string
  created_at: string
}