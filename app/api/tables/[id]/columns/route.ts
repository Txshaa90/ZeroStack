import { NextRequest, NextResponse } from 'next/server'

// POST /api/tables/[id]/columns - Add a new column
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, type } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Column name and type are required' },
        { status: 400 }
      )
    }

    // TODO: Save to database
    const newColumn = {
      id: `c${Date.now()}`,
      name,
      type,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ column: newColumn }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create column' },
      { status: 500 }
    )
  }
}
