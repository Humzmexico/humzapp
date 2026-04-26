import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentOrganization } from '@/lib/auth'
import { z } from 'zod'
import { Decimal } from '@prisma/client/runtime/library'

const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'COST']),
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().optional(),
  transactionDate: z.string().datetime(),
  clientId: z.string().optional().nullable(),
})

export async function GET(request: NextRequest) {
  try {
    const orgId = await getCurrentOrganization()
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const transactions = await prisma.financialTransaction.findMany({
      where: { organizationId: orgId },
      include: { client: true },
      orderBy: { transactionDate: 'desc' },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Transactions GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = await getCurrentOrganization()
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const data = transactionSchema.parse(body)

    const transaction = await prisma.financialTransaction.create({
      data: {
        ...data,
        amount: new Decimal(data.amount),
        organizationId: orgId,
      },
      include: { client: true },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Transactions POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
