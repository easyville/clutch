import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

// GET all listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'offer' | 'request' | null (all)
    const category = searchParams.get('category') // 'skill' | 'item' | 'need' | null (all)
    const userId = searchParams.get('userId') // Filter by user

    const where: Record<string, unknown> = {}
    
    if (type) {
      if (type === 'offer') {
        where.type = 'offer'
      } else if (type === 'request') {
        where.category = 'need'
      }
    }
    
    if (category) {
      where.category = category
    }
    
    if (userId) {
      where.userId = userId
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      listings: listings.map(listing => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        category: listing.category,
        type: listing.type,
        tags: JSON.parse(listing.tags),
        createdAt: listing.createdAt.toISOString(),
        userId: listing.userId,
        userName: listing.user.name,
        userEmail: listing.user.email,
      })),
    })
  } catch (error) {
    console.error('Get listings error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new listing
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

    const { title, description, category, type, tags } = await request.json()

    if (!title || !description || !category || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        category,
        type,
        tags: JSON.stringify(tags || []),
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      listing: {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        category: listing.category,
        type: listing.type,
        tags: JSON.parse(listing.tags),
        createdAt: listing.createdAt.toISOString(),
        userId: listing.userId,
        userName: listing.user.name,
        userEmail: listing.user.email,
      },
    })
  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

