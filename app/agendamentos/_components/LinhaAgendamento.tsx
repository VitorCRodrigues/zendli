'use client'

import { useRouter } from 'next/navigation'

export default function LinhaAgendamento({
  id,
  style,
  children,
}: {
  id: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <tr
      onClick={() => router.push(`/agendamentos/${id}`)}
      className="cursor-pointer transition-colors hover:bg-gray-50"
      style={style}
    >
      {children}
    </tr>
  )
}
