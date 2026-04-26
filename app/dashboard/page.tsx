import { Header } from '@/components/layout/header'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { RecentClients } from '@/components/dashboard/recent-clients'
import { RecentMessages } from '@/components/dashboard/recent-messages'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <div className="flex flex-col gap-6 p-6">
        <MetricsCards />
        <RevenueChart />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Clientes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentClients />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Mensajes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentMessages />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
