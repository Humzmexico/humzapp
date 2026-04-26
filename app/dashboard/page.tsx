'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricsCard } from '@/components/dashboard/metrics-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { ClientsGrowthChart } from '@/components/dashboard/clients-growth-chart'
import { RecentClientsTable } from '@/components/dashboard/recent-clients-table'
import { RecentMessagesTable } from '@/components/dashboard/recent-messages-table'
import { DollarSign, Users, TrendingUp, MessageSquare } from 'lucide-react'

interface Metrics {
  monthlyRevenue: number
  monthlyExpenses: number
  monthlyProfit: number
  totalClients: number
  newClientsThisMonth: number
  averageResponseTime: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics')
        if (!response.ok) throw new Error('Failed to fetch metrics')
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error('Error fetching metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Cargando métricas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Bienvenido a Humz - Centro operativo de tu negocio</p>
      </div>

      {metrics && (
        <>
          {/* KPIs */}
          <div className="grid gap-4 md:grid-cols-4">
            <MetricsCard
              title="Ingresos del Mes"
              value={`$${metrics.monthlyRevenue.toFixed(2)}`}
              icon={<DollarSign className="h-4 w-4" />}
              trend="+12.5%"
            />
            <MetricsCard
              title="Gastos"
              value={`$${metrics.monthlyExpenses.toFixed(2)}`}
              icon={<TrendingUp className="h-4 w-4" />}
              trend="-2.3%"
            />
            <MetricsCard
              title="Utilidad"
              value={`$${metrics.monthlyProfit.toFixed(2)}`}
              icon={<DollarSign className="h-4 w-4" />}
              trend={`${((metrics.monthlyProfit / metrics.monthlyRevenue) * 100).toFixed(1)}%`}
            />
            <MetricsCard
              title="Clientes Totales"
              value={metrics.totalClients.toString()}
              icon={<Users className="h-4 w-4" />}
              trend={`+${metrics.newClientsThisMonth} este mes`}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos vs Gastos</CardTitle>
                <CardDescription>Últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crecimiento de Clientes</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ClientsGrowthChart />
              </CardContent>
            </Card>
          </div>

          {/* Tables */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clientes Recientes</CardTitle>
                <CardDescription>Últimos clientes agregados</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentClientsTable />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mensajes Recientes</CardTitle>
                <CardDescription>Actividad de comunicación</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentMessagesTable />
              </CardContent>
            </Card>
          </div>

          {/* Response Time Metric */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Tiempo Promedio de Respuesta
              </CardTitle>
              <CardDescription>
                Tiempo promedio entre mensaje entrante y respuesta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {metrics.averageResponseTime.toFixed(1)} min
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Objetivo: &lt; 30 minutos
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
