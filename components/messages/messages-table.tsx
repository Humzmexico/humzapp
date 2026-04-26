'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

type Message = {
  id: string
  channel: string
  direction: string
  content: string
  createdAt: string
  client: { name: string }
}

const channelLabel: Record<string, string> = {
  WHATSAPP: 'WhatsApp', EMAIL: 'Email', SMS: 'SMS', OTHER: 'Otro',
}

export function MessagesTable() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/messages')
      .then((r) => r.json())
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="space-y-2">{[0,1,2,3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
  }

  if (messages.length === 0) {
    return <div className="py-12 text-center text-sm text-muted-foreground">No hay mensajes registrados</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Canal</TableHead>
          <TableHead>Dirección</TableHead>
          <TableHead>Contenido</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="font-medium">{m.client.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{channelLabel[m.channel] ?? m.channel}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={m.direction === 'INBOUND' ? 'secondary' : 'default'}>
                {m.direction === 'INBOUND' ? '↓ Entrada' : '↑ Salida'}
              </Badge>
            </TableCell>
            <TableCell className="max-w-xs truncate text-muted-foreground">{m.content}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {format(new Date(m.createdAt), 'dd MMM yyyy HH:mm', { locale: es })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
