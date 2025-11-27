import { Resend } from 'resend'

// Only create Resend instance if API key is available
const resendApiKey = process.env.RESEND_API_KEY

export async function sendVerificationEmail(email: string, code: string) {
  // Check if API key is configured - if not, use dev mode
  if (!resendApiKey || resendApiKey === 'your_resend_api_key_here' || resendApiKey.trim() === '') {
    console.log(`📧 [DEV MODE] Verification code for ${email}: ${code}`)
    return { success: true, devMode: true, code }
  }

  try {
    const resend = new Resend(resendApiKey)
    
    const { data, error } = await resend.emails.send({
      from: 'Clutch <onboarding@resend.dev>',
      to: email,
      subject: 'Your Clutch verification code',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; font-size: 32px; margin: 0;">CLUTCH</h1>
            <p style="color: #9ca3af; margin: 5px 0 0 0;">Skill Swap App</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f97316, #f59e0b); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
            <p style="color: white; margin: 0 0 10px 0; font-size: 14px;">Your verification code is:</p>
            <div style="background: white; padding: 15px 30px; border-radius: 12px; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${code}</span>
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
            This code expires in 10 minutes.<br/>
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Email send error:', error)
      // Fall back to dev mode if email fails
      console.log(`📧 [FALLBACK] Verification code for ${email}: ${code}`)
      return { success: true, devMode: true, code }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Email error:', error)
    // Fall back to dev mode on any error
    console.log(`📧 [FALLBACK] Verification code for ${email}: ${code}`)
    return { success: true, devMode: true, code }
  }
}
