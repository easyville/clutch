import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

function extractNameFromEmail(email: string): string {
  const localPart = email.split('@')[0]
  const initials = localPart.slice(0, 2).toUpperCase()
  return `Student ${initials}`
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase().trim()

    // Find verification code
    const verification = await prisma.verificationCode.findUnique({
      where: { email: emailLower },
    })

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if code expired
    if (new Date() > verification.expiresAt) {
      await prisma.verificationCode.delete({ where: { email: emailLower } })
      return NextResponse.json(
        { success: false, error: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if code matches
    if (verification.code !== code) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email: emailLower },
      update: { verified: true },
      create: {
        email: emailLower,
        name: extractNameFromEmail(emailLower),
        verified: true,
      },
    })

    // Delete verification code
    await prisma.verificationCode.delete({ where: { email: emailLower } })

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: user.verified,
        createdAt: user.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

