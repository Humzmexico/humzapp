'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  status: string
  createdAt: string
}

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients')
        if (response.ok) {
          const data = await response.json()
          setClients(data)
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  if (loading) return <div className="text-sm text-muted-foreground">Cargando...</div>
  if (clients.length === 0) return <div className="text-sm text-muted-foreground">No hay clientes aún</div>

  const statusColors: Record<string, string> = {
    LEAD: 'default',
    PROSPECT: 'secondary',
    CLIENT: 'default',
    INACTIVE: 'outline',
  }

  const statusLabels: Record<string, string> = {
    LEAD: 'Lead',
    PROSPECT: 'Prospecto',
    CLIENT: 'Cliente',
    INACTIVE: 'Inactivo',
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha de Creación</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell className="text-sm">{client.email || '-'}</TableCell>
            <TableCell className="text-sm">{client.phone || '-'}</TableCell>
            <TableCell>
              <Badge variant={statusColors[client.status] as any}>
                {statusLabels[client.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {format(new Date(client.createdAt), 'dd/MM/yyyy')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
