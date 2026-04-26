'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Client = {
  id: string
  name: string
  email: string | null
  phone: string | null
  status: string
  createdAt: string
}

const statusLabel: Record<string, string> = {
  LEAD: 'Lead', PROSPECT: 'Prospecto', CLIENT: 'Cliente', INACTIVE: 'Inactivo',
}
const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  LEAD: 'outline', PROSPECT: 'secondary', CLIENT: 'default', INACTIVE: 'destructive',
}

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clients')
      .then((r) => r.json())
      .then(setClients)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        No hay clientes. ¡Agrega el primero!
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Creado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell className="text-muted-foreground">{c.email ?? '—'}</TableCell>
            <TableCell className="text-muted-foreground">{c.phone ?? '—'}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[c.status] ?? 'outline'}>
                {statusLabel[c.status] ?? c.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {format(new Date(c.createdAt), 'dd MMM yyyy', { locale: es })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
