'use client'

import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type Metrics = {
  monthlyRevenue: number
  monthlyExpenses: number
  monthlyProfit: number
  totalClients: number
  newClientsThisMonth: number
  avgResponseMinutes: number
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)

function MetricCard({
  title,
  value,
  sub,
  icon: Icon,
}: {
  title: string
  value: string
  sub: string
  icon: React.ElementType
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  )
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-36 mt-2" />
      </CardContent>
    </Card>
  )
}

export function MetricsCards() {
  const [data, setData] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/metrics')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Ingresos del Mes"
        value={fmt(data.monthlyRevenue)}
        sub={`Gastos: ${fmt(data.monthlyExpenses)}`}
        icon={DollarSign}
      />
      <MetricCard
        title="Ganancia Neta"
        value={fmt(data.monthlyProfit)}
        sub={data.monthlyProfit >= 0 ? 'Balance positivo' : 'Revisar gastos'}
        icon={TrendingUp}
      />
      <MetricCard
        title="Total Clientes"
        value={String(data.totalClients)}
        sub={`+${data.newClientsThisMonth} este mes`}
        icon={Users}
      />
      <MetricCard
        title="Tiempo Respuesta"
        value={data.avgResponseMinutes > 0 ? `${data.avgResponseMinutes} min` : '—'}
        sub="Promedio entrada → salida"
        icon={Clock}
      />
    </div>
  )
}
