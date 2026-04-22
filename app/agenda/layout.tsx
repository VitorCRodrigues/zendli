import Sidebar from '../dashboard/_components/Sidebar'

export default function AgendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F5FAF8' }}>
      <Sidebar />
      <main className="ml-60 flex-1">
        {children}
      </main>
    </div>
  )
}
