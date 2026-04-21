import Sidebar from './_components/Sidebar'

export default function DashboardLayout(props: LayoutProps<'/dashboard'>) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F5FAF8' }}>
      <Sidebar />
      <main className="ml-60 flex-1">
        {props.children}
      </main>
    </div>
  )
}
