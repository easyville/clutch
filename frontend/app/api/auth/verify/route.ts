import { NextRequest, NextResponse } from 'next/server'
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
    const cookieStore = await cookies()
    
    // Get pending verification from cookie
    const pendingCookie = cookieStore.get('pendingVerification')
    
    if (!pendingCookie) {
      return NextResponse.json(
        { success: false, error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      )
    }

    let pending
    try {
      pending = JSON.parse(pendingCookie.value)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid verification data. Please request a new code.' },
        { status: 400 }
      )
    }

    // Check if code expired
    if (Date.now() > pending.expiresAt) {
      cookieStore.delete('pendingVerification')
      return NextResponse.json(
        { success: false, error: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check email matches
    if (pending.email !== emailLower) {
      return NextResponse.json(
        { success: false, error: 'Email mismatch. Please request a new code.' },
        { status: 400 }
      )
    }

    // Check if code matches
    if (pending.code !== code) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Create user session
    const user = {
      id: Buffer.from(emailLower).toString('base64'),
      email: emailLower,
      name: extractNameFromEmail(emailLower),
      verified: true,
      createdAt: new Date().toISOString(),
    }

    // Clear pending verification
    cookieStore.delete('pendingVerification')
    
    // Set user session cookie
    cookieStore.set('userSession', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
