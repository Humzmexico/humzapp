'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ClientForm } from '@/components/clients/client-form'
import { ClientsTable } from '@/components/clients/clients-table'

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Header title="Clientes" />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Pipeline de Clientes</h2>
            <p className="text-sm text-muted-foreground">Gestiona leads, prospectos y clientes</p>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Nuevo Cliente
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Crear Cliente</CardTitle>
              <CardDescription>Completa los datos del nuevo cliente o prospecto</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientForm onClose={() => setShowForm(false)} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <ClientsTable />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
