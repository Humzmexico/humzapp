'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Message {
  id: string
  clientId: string
  channel: string
  direction: string
  content: string
  createdAt: string
  client: { name: string }
}

export function MessagesTable() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages')
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  if (loading) return <div className="text-sm text-muted-foreground">Cargando...</div>
  if (messages.length === 0) return <div className="text-sm text-muted-foreground">No hay mensajes</div>

  const channelLabels: Record<string, string> = {
    WHATSAPP: 'WhatsApp',
    EMAIL: 'Email',
    SMS: 'SMS',
    OTHER: 'Otro',
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Canal</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Mensaje</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((msg) => (
          <TableRow key={msg.id}>
            <TableCell className="font-medium">{msg.client.name}</TableCell>
            <TableCell>{channelLabels[msg.channel]}</TableCell>
            <TableCell>
              <Badge variant={msg.direction === 'INBOUND' ? 'secondary' : 'default'}>
                {msg.direction === 'INBOUND' ? 'Entrante' : 'Saliente'}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
              {msg.content}
            </TableCell>
            <TableCell className="text-xs">
              {format(new Date(msg.createdAt), 'dd/MM/yyyy HH:mm')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
