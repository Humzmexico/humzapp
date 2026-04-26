import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MessageStats } from '@/components/messages/message-stats'
import { MessagesTable } from '@/components/messages/messages-table'

export default function MessagesPage() {
  return (
    <>
      <Header title="Mensajes" />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h2 className="text-lg font-semibold">Comunicación</h2>
          <p className="text-sm text-muted-foreground">Historial de mensajes por cliente y canal</p>
        </div>

        <MessageStats />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de Mensajes</CardTitle>
            <CardDescription>Todos los mensajes entrantes y salientes</CardDescription>
          </CardHeader>
          <CardContent>
            <MessagesTable />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
