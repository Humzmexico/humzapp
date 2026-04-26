'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, Send, ReceiptText, Clock } from 'lucide-react'

interface Stats {
  totalMessages: number
  inboundMessages: number
  outboundMessages: number
  averageResponseTime: number
}

export function MessageStatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/messages')
        if (response.ok) {
          const data = await response.json()
          const inbound = data.filter((m: any) => m.direction === 'INBOUND').length
          const outbound = data.filter((m: any) => m.direction === 'OUTBOUND').length

          setStats({
            totalMessages: data.length,
            inboundMessages: inbound,
            outboundMessages: outbound,
            averageResponseTime: 24.5,
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="text-sm text-muted-foreground">Cargando estadísticas...</div>

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Mensajes</p>
              <h3 className="text-2xl font-bold mt-2">{stats?.totalMessages || 0}</h3>
            </div>
            <div className="p-2 bg-muted rounded-lg text-primary">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Entrantes</p>
              <h3 className="text-2xl font-bold mt-2">{stats?.inboundMessages || 0}</h3>
            </div>
            <div className="p-2 bg-muted rounded-lg text-primary">
              <ReceiptText className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Salientes</p>
              <h3 className="text-2xl font-bold mt-2">{stats?.outboundMessages || 0}</h3>
            </div>
            <div className="p-2 bg-muted rounded-lg text-primary">
              <Send className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tiempo Respuesta Promedio</p>
              <h3 className="text-2xl font-bold mt-2">{stats?.averageResponseTime.toFixed(1)} min</h3>
            </div>
            <div className="p-2 bg-muted rounded-lg text-primary">
              <Clock className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
