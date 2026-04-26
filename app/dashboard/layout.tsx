import { Sidebar } from '@/components/layout/sidebar'
import { getCurrentUser } from '@/lib/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  const safeUser = user ?? { id: '', name: 'Usuario', email: '' }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar user={safeUser} />
      <main className="flex flex-1 flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
