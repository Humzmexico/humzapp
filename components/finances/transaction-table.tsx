'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

type Transaction = {
  id: string
  type: string
  amount: number
  category: string
  description: string | null
  transactionDate: string
}

const typeLabel: Record<string, string> = { INCOME: 'Ingreso', EXPENSE: 'Gasto', COST: 'Costo' }
const typeVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  INCOME: 'default', EXPENSE: 'destructive', COST: 'secondary',
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)

export function TransactionTable() {
  const [txs, setTxs] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transactions')
      .then((r) => r.json())
      .then(setTxs)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="space-y-2">{[0,1,2,3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
  }

  if (txs.length === 0) {
    return <div className="py-12 text-center text-sm text-muted-foreground">No hay transacciones aún</div>
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
        {txs.map((t) => (
          <TableRow key={t.id}>
            <TableCell>
              <Badge variant={typeVariant[t.type] ?? 'secondary'}>{typeLabel[t.type] ?? t.type}</Badge>
            </TableCell>
            <TableCell className="font-medium">{t.category}</TableCell>
            <TableCell className="text-muted-foreground">{t.description ?? '—'}</TableCell>
            <TableCell className={`text-right font-mono ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
              {fmt(Number(t.amount))}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {format(new Date(t.transactionDate), 'dd MMM yyyy', { locale: es })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
