import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// In-memory storage for MVP (resets on server restart)
// In production, you'd use a real database
const listings: Map<string, {
  id: string
  title: string
  description: string
  category: string
  type: string
  tags: string[]
  createdAt: string
  userId: string
  userName: string
  userEmail: string
}> = new Map()

// Seed with initial data
const seedData = [
  {
    id: 'seed-1',
    title: 'Guitar Lessons',
    description: 'Been playing for 5 years. Can teach basics to intermediate. Looking for Spanish conversation practice or baked goods!',
    category: 'skill',
    type: 'offer',
    tags: ['Music', 'Guitar', 'Teaching'],
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    userId: 'user-1',
    userName: 'Sarah C.',
    userEmail: 'sc21234@essex.ac.uk',
  },
  {
    id: 'seed-2',
    title: 'Homemade Indian Snacks',
    description: 'My mom sent me too many samosas and pakoras! Happy to share. Would love help with physics homework.',
    category: 'item',
    type: 'offer',
    tags: ['Food', 'Snacks', 'Indian'],
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    userId: 'user-2',
    userName: 'Alex K.',
    userEmail: 'ak19876@essex.ac.uk',
  },
  {
    id: 'seed-3',
    title: 'Need French Tutor',
    description: 'Struggling with French 101. Can offer graphic design help or bake you something sweet!',
    category: 'need',
    type: 'request',
    tags: ['French', 'Language', 'Tutoring'],
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    userId: 'user-3',
    userName: 'Emma W.',
    userEmail: 'ew20987@essex.ac.uk',
  },
  {
    id: 'seed-4',
    title: 'Car Rides to Campus',
    description: 'I drive to campus every morning around 8am from downtown. Happy to give rides for coffee or study notes!',
    category: 'skill',
    type: 'offer',
    tags: ['Transportation', 'Rides', 'Morning'],
    createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    userId: 'user-4',
    userName: 'Marcus B.',
    userEmail: 'mb22345@essex.ac.uk',
  },
  {
    id: 'seed-5',
    title: 'Extra Textbooks',
    description: 'Have extra ECON 101 and PSYCH 100 textbooks from last semester. Looking for computer science textbooks or snacks!',
    category: 'item',
    type: 'offer',
    tags: ['Textbooks', 'Books', 'Economics'],
    createdAt: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
    userId: 'user-5',
    userName: 'Lily Z.',
    userEmail: 'lz21456@essex.ac.uk',
  },
  {
    id: 'seed-6',
    title: 'Photography for Events',
    description: 'Can take photos for your events or portraits. Would love help with chemistry or some homemade food!',
    category: 'skill',
    type: 'offer',
    tags: ['Photography', 'Events', 'Portraits'],
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    userId: 'user-6',
    userName: 'David P.',
    userEmail: 'dp23567@essex.ac.uk',
  },
  {
    id: 'seed-7',
    title: 'Need Laptop Charger (HP)',
    description: 'Lost my HP laptop charger. Can borrow for a day? Will return with cookies or help with your homework!',
    category: 'need',
    type: 'request',
    tags: ['Electronics', 'Urgent', 'Laptop'],
    createdAt: new Date(Date.now() - 6 * 60 * 60000).toISOString(),
    userId: 'user-7',
    userName: 'Sophie T.',
    userEmail: 'st20678@essex.ac.uk',
  },
]

// Initialize with seed data
if (listings.size === 0) {
  seedData.forEach(item => listings.set(item.id, item))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')

    let results = Array.from(listings.values())

    if (type === 'offer') {
      results = results.filter(l => l.type === 'offer')
    } else if (type === 'request') {
      results = results.filter(l => l.category === 'need')
    }

    if (userId) {
      results = results.filter(l => l.userId === userId)
    }

    // Sort by date descending
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      listings: results,
    })
  } catch (error) {
    console.error('Get listings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
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

    let user
    try {
      user = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
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

    const listing = {
      id: `listing-${Date.now()}`,
      title,
      description,
      category: type === 'request' ? 'need' : category,
      type,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    }

    listings.set(listing.id, listing)

    return NextResponse.json({
      success: true,
      listing,
    })
  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}
