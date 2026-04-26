import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentOrganization } from '@/lib/auth'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const orgId = await getCurrentOrganization()
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Monthly revenue (income transactions)
    const monthlyRevenue = await prisma.financialTransaction.aggregate({
      where: {
        organizationId: orgId,
        type: 'INCOME',
        transactionDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: { amount: true },
    })

    // Monthly expenses
    const monthlyExpenses = await prisma.financialTransaction.aggregate({
      where: {
        organizationId: orgId,
        type: 'EXPENSE',
        transactionDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: { amount: true },
    })

    // Total clients
    const totalClients = await prisma.client.count({
      where: { organizationId: orgId },
    })

    // New clients this month
    const newClientsThisMonth = await prisma.client.count({
      where: {
        organizationId: orgId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })

    // Average response time (simple calculation: inbound to outbound time)
    const messages = await prisma.message.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'asc' },
    })

    let totalResponseTime = 0
    let responseCount = 0

    for (let i = 0; i < messages.length - 1; i++) {
      if (
        messages[i].direction === 'INBOUND' &&
        messages[i + 1].direction === 'OUTBOUND' &&
        messages[i].clientId === messages[i + 1].clientId
      ) {
        const responseTime = (messages[i + 1].createdAt.getTime() - messages[i].createdAt.getTime()) / (1000 * 60)
        totalResponseTime += responseTime
        responseCount++
      }
    }

    const averageResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0

    const revenue = monthlyRevenue._sum.amount?.toNumber() || 0
    const expenses = monthlyExpenses._sum.amount?.toNumber() || 0
    const profit = revenue - expenses

    return NextResponse.json({
      monthlyRevenue: revenue,
      monthlyExpenses: expenses,
      monthlyProfit: profit,
      totalClients,
      newClientsThisMonth,
      averageResponseTime,
    })
  } catch (error) {
    console.error('Metrics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
