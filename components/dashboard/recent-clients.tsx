'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

type Client = {
  id: string
  name: string
  email: string | null
  status: string
  createdAt: string
}

const statusLabel: Record<string, string> = {
  LEAD: 'Lead',
  PROSPECT: 'Prospecto',
  CLIENT: 'Cliente',
  INACTIVE: 'Inactivo',
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  LEAD: 'outline',
  PROSPECT: 'secondary',
  CLIENT: 'default',
  INACTIVE: 'destructive',
}

export function RecentClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clients')
      .then((r) => r.json())
      .then((data: Client[]) => setClients(data.slice(0, 5)))
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

  if (clients.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">Sin clientes aún</p>
  }

  return (
    <div className="space-y-2">
      {clients.map((c) => (
        <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-0">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{c.name}</p>
            {c.email && <p className="text-xs text-muted-foreground truncate">{c.email}</p>}
          </div>
          <Badge variant={statusVariant[c.status] ?? 'outline'} className="ml-2 shrink-0">
            {statusLabel[c.status] ?? c.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}
