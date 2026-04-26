'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Transaction {
  id: string
  type: string
  amount: number
  category: string
  description: string | null
  transactionDate: string
}

export function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions')
        if (response.ok) {
          const data = await response.json()
          setTransactions(data)
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (loading) return <div className="text-sm text-muted-foreground">Cargando...</div>
  if (transactions.length === 0) return <div className="text-sm text-muted-foreground">No hay transacciones</div>

  const typeColors: Record<string, string> = {
    INCOME: 'default',
    EXPENSE: 'destructive',
    COST: 'secondary',
  }

  const typeLabels: Record<string, string> = {
    INCOME: 'Ingreso',
    EXPENSE: 'Gasto',
    COST: 'Costo',
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Monto</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>
              <Badge variant={typeColors[tx.type] as any}>
                {typeLabels[tx.type]}
              </Badge>
            </TableCell>
            <TableCell>{tx.category}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {tx.description || '-'}
            </TableCell>
            <TableCell className="text-right font-medium">
              {tx.type === 'INCOME' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
            </TableCell>
            <TableCell>
              {format(new Date(tx.transactionDate), 'dd/MM/yyyy')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
