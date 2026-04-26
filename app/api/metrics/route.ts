import { NextResponse } from 'next/server'
import { startOfMonth, endOfMonth } from 'date-fns'
import { db } from '@/lib/db'
import { getCurrentOrgId } from '@/lib/auth'

export async function GET() {
  const orgId = await getCurrentOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const [income, expenses, totalClients, newClients, messages] = await Promise.all([
    db.financialTransaction.aggregate({
      where: { organizationId: orgId, type: 'INCOME', transactionDate: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    db.financialTransaction.aggregate({
      where: { organizationId: orgId, type: { in: ['EXPENSE', 'COST'] }, transactionDate: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    db.client.count({ where: { organizationId: orgId } }),
    db.client.count({ where: { organizationId: orgId, createdAt: { gte: monthStart, lte: monthEnd } } }),
    db.message.findMany({
      where: { organizationId: orgId },
      select: { clientId: true, direction: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  // Average response time: INBOUND → next OUTBOUND for same client
  let totalMs = 0
  let count = 0
  for (let i = 0; i < messages.length - 1; i++) {
    if (
      messages[i].direction === 'INBOUND' &&
      messages[i + 1].direction === 'OUTBOUND' &&
      messages[i].clientId === messages[i + 1].clientId
    ) {
      totalMs += messages[i + 1].createdAt.getTime() - messages[i].createdAt.getTime()
      count++
    }
  }

  const monthlyRevenue = income._sum.amount?.toNumber() ?? 0
  const monthlyExpenses = expenses._sum.amount?.toNumber() ?? 0

  return NextResponse.json({
    monthlyRevenue,
    monthlyExpenses,
    monthlyProfit: monthlyRevenue - monthlyExpenses,
    totalClients,
    newClientsThisMonth: newClients,
    avgResponseMinutes: count > 0 ? Math.round(totalMs / count / 60000) : 0,
  })
}
