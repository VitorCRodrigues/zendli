import { createClient } from '@/lib/supabase/server'
import type { Cliente } from '@/types/database'
import Link from 'next/link'
import { UserPlus, Users, Pencil } from 'lucide-react'
import { revalidatePath } from 'next/cache'

async function toggleAtivo(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const ativo = formData.get('ativo') === 'true'
  const supabase = await createClient()
  await supabase.from('clientes').update({ ativo: !ativo }).eq('id', id)
  revalidatePath('/clientes')
}

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('clientes')
    .select('*')
    .order('nome', { ascending: true })

  const clientes = (data ?? []) as Cliente[]

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: '#0F1A2E', letterSpacing: '-0.4px' }}>
          Clientes
        </h1>
        <Link
          href="/clientes/novo"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#38C9A0', color: '#0F1A2E' }}
        >
          <UserPlus size={16} strokeWidth={2} />
          Novo cliente
        </Link>
      </div>

      {clientes.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-20"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: '#E8F8F2' }}
          >
            <Users size={28} strokeWidth={1.5} style={{ color: '#38C9A0' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: '#0F1A2E' }}>
            Nenhum cliente cadastrado ainda.
          </p>
          <p className="mt-1 text-sm" style={{ color: '#9CA3AF' }}>
            Clique em &quot;Novo cliente&quot; para começar.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #F5F5F5' }}>
                {(['Nome', 'Telefone', 'E-mail', 'Status'] as const).map(col => (
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
              {clientes.map((cliente, i) => (
                <tr
                  key={cliente.id}
                  style={{ borderTop: i > 0 ? '1px solid #F5F5F5' : undefined }}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium" style={{ color: '#0F1A2E' }}>
                      {cliente.nome}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: '#6B7280' }}>
                      {cliente.telefone}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: '#6B7280' }}>
                      {cliente.email ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={
                        cliente.ativo
                          ? { backgroundColor: '#E1F5EE', color: '#0F6E56' }
                          : { backgroundColor: '#F5F5F5', color: '#6B7280' }
                      }
                    >
                      {cliente.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/clientes/${cliente.id}/editar`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-50"
                        title="Editar"
                        style={{ color: '#6B7280' }}
                      >
                        <Pencil size={15} strokeWidth={2} />
                      </Link>
                      <form action={toggleAtivo}>
                        <input type="hidden" name="id" value={cliente.id} />
                        <input type="hidden" name="ativo" value={String(cliente.ativo)} />
                        <button
                          type="submit"
                          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                          style={
                            cliente.ativo
                              ? { backgroundColor: '#FCEBEB', color: '#A32D2D' }
                              : { backgroundColor: '#E1F5EE', color: '#0F6E56' }
                          }
                        >
                          {cliente.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
