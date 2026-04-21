@AGENTS.md
# Zendli — Contexto do projeto para Claude Code

## O que é
Sistema de agendamento com confirmação, lembretes e reagendamento automático via WhatsApp para clínicas de estética pequenas/médias. Reduz no-shows e poupa tempo da recepção.

## Stack
- **Front-end:** Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **Banco:** Supabase (PostgreSQL)
- **Automações:** n8n
- **WhatsApp:** Evolution API (a definir)
- **Hospedagem:** Vercel (front) + Supabase (banco)

## Estrutura de pastas
```
app/
  login/          → tela de login
  dashboard/      → métricas do dia
  agenda/         → visualização da agenda
  agendamentos/   → lista e novo agendamento
  clientes/       → lista e cadastro de clientes
  configuracoes/  → horários, textos das mensagens
lib/
  supabase/
    client.ts     → cliente browser (use client)
    server.ts     → cliente servidor (server components)
types/
  database.ts     → tipos TypeScript do banco
proxy.ts          → autenticação e proteção de rotas
```

## Banco de dados (Supabase)
Tabelas: `clientes`, `profissionais`, `servicos`, `disponibilidade`, `agendamentos`, `mensagens`

### Status possíveis de agendamento
`agendado` → `aguardando_confirmacao` → `confirmado` / `cancelado` / `reagendamento_solicitado` → `reagendado` → `concluido`

### Importar cliente Supabase
```typescript
// Em Server Components / Route Handlers:
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Em Client Components:
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

## Padrões de código
- Sempre usar TypeScript com os tipos de `@/types/database`
- Tailwind para estilo — sem CSS separado
- Server Components por padrão, `'use client'` só quando necessário (formulários, interatividade)
- Tratamento de erro em todas as queries do Supabase
- Nomes de variáveis e comentários em português

## Fluxos principais (para automação n8n)
1. Criação de agendamento → envia confirmação via WhatsApp
2. Resposta do cliente → atualiza status no banco
3. Lembrete 48h antes → disparo automático
4. Lembrete 24h antes → disparo automático
5. Reagendamento → sistema envia 3 opções de horário

## Telas do MVP (em ordem de prioridade)
1. Login ✓
2. Dashboard (total do dia, confirmados, pendentes, cancelados)
3. Agenda (lista por dia com status)
4. Novo agendamento (cliente + serviço + profissional + data/hora)
5. Clientes (lista + cadastro)
6. Detalhes do agendamento (status, histórico de mensagens, ações)
7. Configurações (horários, textos das mensagens)

## Comandos úteis
```bash
npm run dev        # desenvolvimento
npm run build      # build de produção
npm run lint       # verificar erros
```

## Variáveis de ambiente necessárias
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```