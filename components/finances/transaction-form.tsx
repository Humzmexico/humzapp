'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const schema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'COST']),
  amount: z.number({ invalid_type_error: 'Ingresa un monto válido' }).positive('El monto debe ser mayor a 0'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  description: z.string().optional(),
  transactionDate: z.string().min(1, 'La fecha es obligatoria'),
})

export function TransactionForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: 'INCOME',
    amount: '',
    category: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
  })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = schema.safeParse({ ...form, amount: parseFloat(form.amount) })
    if (!result.success) { toast.error(result.error.errors[0].message); return }

    setLoading(true)
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result.data,
          transactionDate: new Date(result.data.transactionDate).toISOString(),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Error del servidor')
      }
      toast.success('Transacción registrada')
      setForm({ type: 'INCOME', amount: '', category: '', description: '', transactionDate: new Date().toISOString().split('T')[0] })
      onClose()
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="type">Tipo</Label>
        <Select value={form.type} onValueChange={(v) => set('type', v)}>
          <SelectTrigger id="type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Ingreso</SelectItem>
            <SelectItem value="EXPENSE">Gasto</SelectItem>
            <SelectItem value="COST">Costo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="amount">Monto *</Label>
        <Input id="amount" type="number" step="0.01" min="0" placeholder="0.00" value={form.amount} onChange={(e) => set('amount', e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category">Categoría *</Label>
        <Input id="category" placeholder="Ej: Ventas, Nómina" value={form.category} onChange={(e) => set('category', e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="transactionDate">Fecha *</Label>
        <Input id="transactionDate" type="date" value={form.transactionDate} onChange={(e) => set('transactionDate', e.target.value)} />
      </div>
      <div className="sm:col-span-2 space-y-1.5">
        <Label htmlFor="description">Descripción</Label>
        <Input id="description" placeholder="Detalles opcionales" value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div className="sm:col-span-2 flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
      </div>
    </form>
  )
}
