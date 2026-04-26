'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type Metrics = {
  avgResponseMinutes: number
}

type Message = { direction: string }

export function MessageStats() {
  const [messages, setMessages] = useState<Message[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/messages').then((r) => r.json()),
      fetch('/api/metrics').then((r) => r.json()),
    ])
      .then(([msgs, m]) => {
        setMessages(msgs)
        setMetrics(m)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const inbound = messages.filter((m) => m.direction === 'INBOUND').length
  const outbound = messages.filter((m) => m.direction === 'OUTBOUND').length

  const stats = [
    { label: 'Total Mensajes', value: String(messages.length), icon: MessageSquare },
    { label: 'Recibidos', value: String(inbound), icon: ArrowDownLeft },
    { label: 'Enviados', value: String(outbound), icon: ArrowUpRight },
    {
      label: 'Tiempo Respuesta',
      value: metrics && metrics.avgResponseMinutes > 0 ? `${metrics.avgResponseMinutes} min` : '—',
      icon: Clock,
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0,1,2,3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><Skeleton className="h-4 w-28" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-16" /></CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
