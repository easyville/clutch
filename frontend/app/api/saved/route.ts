import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

// GET all saved listings for current user
export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const savedListings = await prisma.savedListing.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      savedListings: savedListings.map(saved => ({
        id: saved.listing.id,
        title: saved.listing.title,
        description: saved.listing.description,
        category: saved.listing.category,
        type: saved.listing.type,
        tags: JSON.parse(saved.listing.tags),
        createdAt: saved.listing.createdAt.toISOString(),
        userId: saved.listing.userId,
        userName: saved.listing.user.name,
        userEmail: saved.listing.user.email,
        savedAt: saved.createdAt.toISOString(),
      })),
      savedIds: savedListings.map(saved => saved.listingId),
    })
  } catch (error) {
    console.error('Get saved listings error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST toggle save listing
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
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

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    })

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check if already saved
    const existing = await prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    })

    if (existing) {
      // Unsave
      await prisma.savedListing.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({
        success: true,
        saved: false,
        message: 'Listing removed from saved',
      })
    } else {
      // Save
      await prisma.savedListing.create({
        data: {
          userId,
          listingId,
        },
      })
      return NextResponse.json({
        success: true,
        saved: true,
        message: 'Listing saved',
      })
    }
  } catch (error) {
    console.error('Toggle save error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

