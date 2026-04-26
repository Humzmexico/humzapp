'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Client {
  id: string
  name: string
  email: string
  status: string
  createdAt: string
}

export function RecentClientsTable() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients')
        if (response.ok) {
          const data = await response.json()
          setClients(data.slice(0, 5))
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.email || '-'}</TableCell>
            <TableCell>
              <Badge variant={statusColors[client.status] as any}>
                {client.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
