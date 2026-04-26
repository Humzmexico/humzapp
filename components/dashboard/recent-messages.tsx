'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

type Message = {
  id: string
  channel: string
  direction: string
  content: string
  createdAt: string
  client: { name: string }
}

const channelLabel: Record<string, string> = {
  WHATSAPP: 'WhatsApp',
  EMAIL: 'Email',
  SMS: 'SMS',
  OTHER: 'Otro',
}

export function RecentMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/messages')
      .then((r) => r.json())
      .then((data: Message[]) => setMessages(data.slice(0, 5)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    )
  }

  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">Sin mensajes aún</p>
  }

  return (
    <div className="space-y-2">
      {messages.map((m) => (
        <div key={m.id} className="flex items-start justify-between py-2 border-b last:border-0 gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{m.client.name}</p>
            <p className="text-xs text-muted-foreground truncate">{m.content}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge variant="outline" className="text-xs">{channelLabel[m.channel] ?? m.channel}</Badge>
            <span className="text-xs text-muted-foreground">
              {m.direction === 'INBOUND' ? '↓' : '↑'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
