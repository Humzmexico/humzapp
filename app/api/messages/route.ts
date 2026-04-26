import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getCurrentOrgId } from '@/lib/auth'

const schema = z.object({
  clientId: z.string(),
  channel: z.enum(['WHATSAPP', 'EMAIL', 'SMS', 'OTHER']),
  direction: z.enum(['INBOUND', 'OUTBOUND']),
  content: z.string().min(1),
})

export async function GET() {
  const orgId = await getCurrentOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const messages = await db.message.findMany({
    where: { organizationId: orgId },
    include: { client: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const orgId = await getCurrentOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const message = await db.message.create({
    data: { ...parsed.data, organizationId: orgId },
    include: { client: { select: { name: true } } },
  })

  return NextResponse.json(message, { status: 201 })
}
