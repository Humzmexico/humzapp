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
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  status: z.enum(['LEAD', 'PROSPECT', 'CLIENT', 'INACTIVE']),
})

export function ClientForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'LEAD' })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = schema.safeParse(form)
    if (!result.success) { toast.error(result.error.errors[0].message); return }

    setLoading(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Error del servidor')
      }
      toast.success('Cliente creado')
      setForm({ name: '', email: '', phone: '', status: 'LEAD' })
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
      <div className="sm:col-span-2 space-y-1.5">
        <Label htmlFor="name">Nombre *</Label>
        <Input id="name" placeholder="Nombre o empresa" value={form.name} onChange={(e) => set('name', e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="email@ejemplo.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" placeholder="+52 55 1234 5678" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="status">Estado</Label>
        <Select value={form.status} onValueChange={(v) => set('status', v)}>
          <SelectTrigger id="status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="LEAD">Lead</SelectItem>
            <SelectItem value="PROSPECT">Prospecto</SelectItem>
            <SelectItem value="CLIENT">Cliente</SelectItem>
            <SelectItem value="INACTIVE">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="sm:col-span-2 flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
      </div>
    </form>
  )
}
