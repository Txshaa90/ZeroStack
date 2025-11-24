import { NextRequest, NextResponse } from 'next/server'

// GET /api/tables - Get all tables
export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch from database
    // For now, return mock data
    const tables = [
      {
        id: '1',
        name: 'Projects',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ tables }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tables' },
      { status: 500 }
    )
  }
}

// POST /api/tables - Create a new table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Table name is required' },
        { status: 400 }
      )
    }

    // TODO: Save to database
    const newTable = {
      id: Date.now().toString(),
      name,
      columns: [{ id: 'c1', name: 'Name', type: 'text' }],
      rows: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ table: newTable }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create table' },
      { status: 500 }
    )
  }
}
