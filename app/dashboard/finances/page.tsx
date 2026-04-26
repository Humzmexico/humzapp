'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TransactionForm } from '@/components/finances/transaction-form'
import { TransactionTable } from '@/components/finances/transaction-table'

export default function FinancesPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Header title="Finanzas" />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Transacciones</h2>
            <p className="text-sm text-muted-foreground">Ingresos, gastos y costos</p>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Nueva Transacción
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Registrar Transacción</CardTitle>
              <CardDescription>Agrega un nuevo ingreso, gasto o costo</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionForm onClose={() => setShowForm(false)} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <TransactionTable />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
