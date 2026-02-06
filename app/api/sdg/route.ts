import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// TODO: Definieer validation schema voor query parameters
// const querySchema = z.object({ ... })

export async function GET(request: NextRequest) {
  try {
    // TODO: Haal query parameters op
    // const searchParams = request.nextUrl.searchParams
    // const goal = searchParams.get('goal')
    // const country = searchParams.get('country')
    // const from = searchParams.get('from')
    // const to = searchParams.get('to')

    // TODO: Valideer parameters met Zod
    // const validated = querySchema.safeParse({ ... })

    // TODO: Bouw Prisma where clause
    // const whereClause: any = {}
    // if (validated.data.goal) whereClause.sdgNumber = validated.data.goal
    // ... etc

    // TODO: Query database
    // const metrics = await prisma.sdgMetric.findMany({
    //   where: whereClause,
    //   orderBy: [{ year: 'asc' }, { country: 'asc' }],
    // })

    // TODO: Return response
    return NextResponse.json({
      success: true,
      message: 'TODO: Implementeer GET /api/sdg endpoint',
      // count: metrics.length,
      // data: metrics,
    })
  } catch (error) {
    console.error('Error fetching SDG data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


