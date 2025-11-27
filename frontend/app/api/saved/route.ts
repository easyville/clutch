import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Saved listings stored in cookies for simplicity
// In production, use a database

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('userSession')

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const savedCookie = cookieStore.get('savedListings')
    const savedIds: string[] = savedCookie ? JSON.parse(savedCookie.value) : []

    // Fetch the actual listings from the listings API
    const listingsRes = await fetch(new URL('/api/listings', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
    const listingsData = await listingsRes.json()

    const savedListings = listingsData.success 
      ? listingsData.listings.filter((l: { id: string }) => savedIds.includes(l.id))
      : []

    return NextResponse.json({
      success: true,
      savedListings,
      savedIds,
    })
  } catch (error) {
    console.error('Get saved listings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved listings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('userSession')

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { listingId } = await request.json()

    if (!listingId) {
      return NextResponse.json(
        { success: false, error: 'Listing ID is required' },
        { status: 400 }
      )
    }

    const savedCookie = cookieStore.get('savedListings')
    let savedIds: string[] = savedCookie ? JSON.parse(savedCookie.value) : []

    const isSaved = savedIds.includes(listingId)

    if (isSaved) {
      savedIds = savedIds.filter(id => id !== listingId)
    } else {
      savedIds.push(listingId)
    }

    cookieStore.set('savedListings', JSON.stringify(savedIds), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    return NextResponse.json({
      success: true,
      saved: !isSaved,
      message: isSaved ? 'Listing removed from saved' : 'Listing saved',
    })
  } catch (error) {
    console.error('Toggle save error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save listing' },
      { status: 500 }
    )
  }
}
