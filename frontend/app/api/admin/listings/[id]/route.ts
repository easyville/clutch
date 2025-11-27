import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUser } from '@/lib/get-user'

const ADMIN_EMAIL = 'vs22222@essex.ac.uk'

async function isAdmin(): Promise<boolean> {
  const user = await getUser()
  return user?.email === ADMIN_EMAIL
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { id } = await params
    
    await db.deleteListing(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin delete listing error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}

