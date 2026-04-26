'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type Transaction = {
  type: 'INCOME' | 'EXPENSE' | 'COST'
  amount: number
  transactionDate: string
}

type Point = { month: string; ingresos: number; gastos: number }

function groupByMonth(txs: Transaction[]): Point[] {
  const map = new Map<string, Point>()
  for (const t of txs) {
    const d = new Date(t.transactionDate)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' })
    if (!map.has(key)) map.set(key, { month: label, ingresos: 0, gastos: 0 })
    const p = map.get(key)!
    if (t.type === 'INCOME') p.ingresos += Number(t.amount)
    else p.gastos += Number(t.amount)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v)
    .slice(-6)
}

export function RevenueChart() {
  const [data, setData] = useState<Point[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transactions')
      .then((r) => r.json())
      .then((txs: Transaction[]) => setData(groupByMonth(txs)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos vs Gastos</CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-52 w-full" />
        ) : data.length === 0 ? (
          <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
            Sin transacciones registradas
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={208}>
            <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v, name) => [
                  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(v)),
                  name,
                ]}
              />
              <Area type="monotone" dataKey="ingresos" stroke="#22c55e" fill="url(#ing)" strokeWidth={2} />
              <Area type="monotone" dataKey="gastos" stroke="#ef4444" fill="url(#gas)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
