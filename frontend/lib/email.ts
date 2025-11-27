import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export async function sendVerificationEmail(email: string, code: string) {
  // Development mode - no API key
  if (!resend) {
    console.log('========================================')
    console.log(`DEV MODE - Verification code for ${email}: ${code}`)
    console.log('========================================')
    return { 
      devMode: true, 
      code,
      message: 'Running in dev mode - code logged to console'
    }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Clutch <noreply@clutch-skillshare.app>',
      to: email,
      subject: 'Your Clutch verification code',
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #f97316; font-size: 28px; margin-bottom: 24px;">Clutch</h1>
          <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
            Your verification code is:
          </p>
          <div style="background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
            This code will expire in 10 minutes.
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    // Fallback to dev mode on error
    console.log('========================================')
    console.log(`FALLBACK - Verification code for ${email}: ${code}`)
    console.log('========================================')
    return { 
      devMode: true, 
      code,
      message: 'Email failed, code logged to console'
    }
  }
}
