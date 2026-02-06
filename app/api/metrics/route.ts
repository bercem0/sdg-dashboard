import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// TODO: Definieer validation schemas
// const querySchema = z.object({ ... })
// const createMetricSchema = z.object({ ... })

export async function GET(request: NextRequest) {
  try {
    // TODO: Implementeer GET endpoint
    // Haal query parameters op (goal, metricKey)
    // Valideer
    // Query database
    // Return data

    return NextResponse.json({
      success: true,
      message: 'TODO: Implementeer GET /api/metrics endpoint',
    })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Implementeer POST endpoint
    // Lees request body
    // Valideer met Zod
    // Maak metric aan in database
    // Return created metric

    // Optioneel: Check authenticatie
    // const session = await auth()
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    return NextResponse.json({
      success: true,
      message: 'TODO: Implementeer POST /api/metrics endpoint',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating metric:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


