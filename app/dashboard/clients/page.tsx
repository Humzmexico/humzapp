'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientForm } from '@/components/crm/client-form'
import { ClientsTable } from '@/components/crm/clients-table'
import { Plus } from 'lucide-react'

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleClientCreated = () => {
    setShowForm(false)
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-2">Gestiona tu pipeline de clientes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Cliente</CardTitle>
            <CardDescription>Agrega un nuevo prospecto o cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientForm onSuccess={handleClientCreated} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Clientes</CardTitle>
          <CardDescription>Todos tus clientes organizados por estado</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientsTable key={refreshKey} />
        </CardContent>
      </Card>
    </div>
  )
}
