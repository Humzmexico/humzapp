import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentOrganization } from '@/lib/auth'
import { z } from 'zod'

const messageSchema = z.object({
  clientId: z.string().min(1),
  channel: z.enum(['WHATSAPP', 'EMAIL', 'SMS', 'OTHER']),
  direction: z.enum(['INBOUND', 'OUTBOUND']),
  content: z.string().min(1),
  createdAt: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const orgId = await getCurrentOrganization()
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const messages = await prisma.message.findMany({
      where: { organizationId: orgId },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Messages GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = await getCurrentOrganization()
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const data = messageSchema.parse(body)

    const message = await prisma.message.create({
      data: {
        ...data,
        organizationId: orgId,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      },
      include: { client: true },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Messages POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
