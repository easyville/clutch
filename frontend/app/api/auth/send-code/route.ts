import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email format
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase().trim()

    // Validate Essex email
    if (!emailLower.endsWith('@essex.ac.uk')) {
      return NextResponse.json(
        { success: false, error: 'Please use your @essex.ac.uk email address' },
        { status: 400 }
      )
    }

    // Generate verification code
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store or update verification code
    await prisma.verificationCode.upsert({
      where: { email: emailLower },
      update: { code, expiresAt },
      create: { email: emailLower, code, expiresAt },
    })

    // Send email
    const emailResult = await sendVerificationEmail(emailLower, code)

    if (!emailResult.success && !emailResult.devMode) {
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    // In dev mode, return the code for testing
    if (emailResult.devMode) {
      return NextResponse.json({
        success: true,
        message: 'Verification code sent',
        devMode: true,
        code: emailResult.code, // Only in dev mode
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
    })
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

