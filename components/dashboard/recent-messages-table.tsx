'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  clientId: string
  channel: string
  direction: string
  content: string
  createdAt: string
  client: { name: string }
}

export function RecentMessagesTable() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages')
        if (response.ok) {
          const data = await response.json()
          setMessages(data.slice(0, 5))
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Canal</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Mensaje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((msg) => (
          <TableRow key={msg.id}>
            <TableCell className="font-medium">{msg.client.name}</TableCell>
            <TableCell>{msg.channel}</TableCell>
            <TableCell>
              <Badge variant={msg.direction === 'INBOUND' ? 'secondary' : 'default'}>
                {msg.direction}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground truncate max-w-xs">
              {msg.content}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
