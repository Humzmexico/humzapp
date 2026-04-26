import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Decimal } from '@prisma/client/runtime/library'
import { db } from '@/lib/db'
import { getCurrentOrgId } from '@/lib/auth'

const schema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'COST']),
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().optional(),
  transactionDate: z.string().datetime(),
  clientId: z.string().optional().nullable(),
})

export async function GET() {
  const orgId = await getCurrentOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const transactions = await db.financialTransaction.findMany({
    where: { organizationId: orgId },
    orderBy: { transactionDate: 'desc' },
  })

  return NextResponse.json(transactions)
}

export async function POST(req: NextRequest) {
  const orgId = await getCurrentOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const tx = await db.financialTransaction.create({
    data: {
      ...parsed.data,
      amount: new Decimal(parsed.data.amount),
      organizationId: orgId,
    },
  })

  return NextResponse.json(tx, { status: 201 })
}
