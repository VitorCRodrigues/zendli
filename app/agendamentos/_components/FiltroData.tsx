'use client'

import { useRouter } from 'next/navigation'

export default function FiltroData({ valor }: { valor: string }) {
  const router = useRouter()

  return (
    <input
      type="date"
      defaultValue={valor}
      onChange={e => {
        if (e.target.value) router.push(`/agendamentos?data=${e.target.value}`)
      }}
      className="rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#38C9A0] transition-colors"
      style={{ borderColor: '#E5E7EB', color: '#0F1A2E' }}
    />
  )
}
