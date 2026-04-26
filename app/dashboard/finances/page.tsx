'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TransactionForm } from '@/components/finances/transaction-form'
import { TransactionTable } from '@/components/finances/transaction-table'
import { Plus } from 'lucide-react'

export default function FinancesPage() {
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTransactionCreated = () => {
    setShowForm(false)
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
          <p className="text-muted-foreground mt-2">Gestiona ingresos, gastos y costos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Transacción
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Transacción</CardTitle>
            <CardDescription>Agrega un nuevo ingreso, gasto o costo</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionForm onSuccess={handleTransactionCreated} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Transacciones</CardTitle>
          <CardDescription>Historial de todas las transacciones</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionTable key={refreshKey} />
        </CardContent>
      </Card>
    </div>
  )
}
