import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sendVerificationEmail } from '@/lib/email'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase().trim()

    if (!emailLower.endsWith('@essex.ac.uk')) {
      return NextResponse.json(
        { success: false, error: 'Please use your @essex.ac.uk email address' },
        { status: 400 }
      )
    }

    const code = generateCode()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store code in a secure HTTP-only cookie (temporary storage)
    const cookieStore = await cookies()
    cookieStore.set('pendingVerification', JSON.stringify({
      email: emailLower,
      code,
      expiresAt
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    })

    // Send email
    const emailResult = await sendVerificationEmail(emailLower, code)

    if (emailResult.devMode) {
      return NextResponse.json({
        success: true,
        message: 'Verification code sent',
        devMode: true,
        code: emailResult.code,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
    })
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code' },
      { status: 500 }
    )
  }
}
