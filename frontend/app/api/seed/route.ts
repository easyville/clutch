import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Seed the database with sample data
export async function POST() {
  try {
    // Create sample users
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'sc21234@essex.ac.uk' },
        update: {},
        create: { email: 'sc21234@essex.ac.uk', name: 'Sarah C.', verified: true },
      }),
      prisma.user.upsert({
        where: { email: 'ak19876@essex.ac.uk' },
        update: {},
        create: { email: 'ak19876@essex.ac.uk', name: 'Alex K.', verified: true },
      }),
      prisma.user.upsert({
        where: { email: 'ew20987@essex.ac.uk' },
        update: {},
        create: { email: 'ew20987@essex.ac.uk', name: 'Emma W.', verified: true },
      }),
      prisma.user.upsert({
        where: { email: 'mb22345@essex.ac.uk' },
        update: {},
        create: { email: 'mb22345@essex.ac.uk', name: 'Marcus B.', verified: true },
      }),
      prisma.user.upsert({
        where: { email: 'lz21456@essex.ac.uk' },
        update: {},
        create: { email: 'lz21456@essex.ac.uk', name: 'Lily Z.', verified: true },
      }),
      prisma.user.upsert({
        where: { email: 'dp23567@essex.ac.uk' },
        update: {},
        create: { email: 'dp23567@essex.ac.uk', name: 'David P.', verified: true },
      }),
      prisma.user.upsert({
        where: { email: 'st20678@essex.ac.uk' },
        update: {},
        create: { email: 'st20678@essex.ac.uk', name: 'Sophie T.', verified: true },
      }),
    ])

    // Sample listings data
    const listingsData = [
      {
        userId: users[0].id,
        title: 'Guitar Lessons',
        description: 'Been playing for 5 years. Can teach basics to intermediate. Looking for Spanish conversation practice or baked goods!',
        category: 'skill',
        type: 'offer',
        tags: ['Music', 'Guitar', 'Teaching'],
      },
      {
        userId: users[1].id,
        title: 'Homemade Indian Snacks',
        description: 'My mom sent me too many samosas and pakoras! Happy to share. Would love help with physics homework.',
        category: 'item',
        type: 'offer',
        tags: ['Food', 'Snacks', 'Indian'],
      },
      {
        userId: users[2].id,
        title: 'Need French Tutor',
        description: 'Struggling with French 101. Can offer graphic design help or bake you something sweet!',
        category: 'need',
        type: 'request',
        tags: ['French', 'Language', 'Tutoring'],
      },
      {
        userId: users[3].id,
        title: 'Car Rides to Campus',
        description: 'I drive to campus every morning around 8am from downtown. Happy to give rides for coffee or study notes!',
        category: 'skill',
        type: 'offer',
        tags: ['Transportation', 'Rides', 'Morning'],
      },
      {
        userId: users[4].id,
        title: 'Extra Textbooks',
        description: 'Have extra ECON 101 and PSYCH 100 textbooks from last semester. Looking for computer science textbooks or snacks!',
        category: 'item',
        type: 'offer',
        tags: ['Textbooks', 'Books', 'Economics'],
      },
      {
        userId: users[5].id,
        title: 'Photography for Events',
        description: 'Can take photos for your events or portraits. Would love help with chemistry or some homemade food!',
        category: 'skill',
        type: 'offer',
        tags: ['Photography', 'Events', 'Portraits'],
      },
      {
        userId: users[6].id,
        title: 'Need Laptop Charger (HP)',
        description: 'Lost my HP laptop charger. Can borrow for a day? Will return with cookies or help with your homework!',
        category: 'need',
        type: 'request',
        tags: ['Electronics', 'Urgent', 'Laptop'],
      },
    ]

    // Check if listings already exist
    const existingCount = await prisma.listing.count()
    
    if (existingCount === 0) {
      // Create sample listings
      for (const listing of listingsData) {
        await prisma.listing.create({
          data: {
            ...listing,
            tags: JSON.stringify(listing.tags),
          },
        })
      }
    }

    const totalListings = await prisma.listing.count()
    const totalUsers = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      stats: {
        users: totalUsers,
        listings: totalListings,
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}

