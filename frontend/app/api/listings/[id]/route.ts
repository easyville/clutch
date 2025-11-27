import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Reference to the same in-memory storage
// In a real app, this would be a database
declare global {
  // eslint-disable-next-line no-var
  var listingsStore: Map<string, unknown> | undefined
}

function getListings() {
  if (!global.listingsStore) {
    global.listingsStore = new Map()
  }
  return global.listingsStore
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const listings = getListings()
    const listing = listings.get(id)

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      listing,
    })
  } catch (error) {
    console.error('Get listing error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('userSession')

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    let user
    try {
      user = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }

    const { id } = await params
    const listings = getListings()
    const listing = listings.get(id) as { userId: string } | undefined

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      )
    }

    listings.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete listing error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}
