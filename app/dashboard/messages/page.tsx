'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessagesTable } from '@/components/messaging/messages-table'
import { MessageStatsCards } from '@/components/messaging/message-stats-cards'

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
        <p className="text-muted-foreground mt-2">Seguimiento de comunicación con clientes</p>
      </div>

      <MessageStatsCards />

      <Card>
        <CardHeader>
          <CardTitle>Historial de Mensajes</CardTitle>
          <CardDescription>Todos los mensajes entrantes y salientes</CardDescription>
        </CardHeader>
        <CardContent>
          <MessagesTable />
        </CardContent>
      </Card>
    </div>
  )
}
