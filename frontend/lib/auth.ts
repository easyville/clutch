import { Resend } from "resend"
import { kv } from "@vercel/kv"

// Check if KV is available
function isKVAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

// In-memory store for development
const memoryStore = new Map<string, { code: string; email: string; expires: number }>()

// Generate 6-digit code
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code
export async function storeCode(email: string, code: string): Promise<void> {
  const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
  
  if (isKVAvailable()) {
    await kv.set(`verify:${email}`, { code, expires }, { ex: 600 })
  } else {
    memoryStore.set(email, { code, email, expires })
  }
}

// Verify code
export async function verifyCode(email: string, code: string): Promise<boolean> {
  if (isKVAvailable()) {
    const stored = await kv.get<{ code: string; expires: number }>(`verify:${email}`)
    if (!stored) return false
    if (Date.now() > stored.expires) return false
    if (stored.code !== code) return false
    await kv.del(`verify:${email}`)
    return true
  } else {
    const stored = memoryStore.get(email)
    if (!stored) return false
    if (Date.now() > stored.expires) return false
    if (stored.code !== code) return false
    memoryStore.delete(email)
    return true
  }
}

// Send verification email
export async function sendVerificationEmail(email: string, code: string): Promise<{ success: boolean; devMode?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY
  
  console.log('RESEND_API_KEY present:', !!apiKey)
  console.log('RESEND_API_KEY starts with:', apiKey?.substring(0, 5) || 'NOT SET')
  
  if (!apiKey) {
    console.log('========================================')
    console.log(`NO API KEY - Verification code for ${email}: ${code}`)
    console.log('========================================')
    return { success: true, devMode: true }
  }
  
  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from: 'Clutch <noreply@clutch-skillshare.app>',
      to: email,
      subject: `Clutch code: ${code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light">
          <meta name="supported-color-schemes" content="light">
        </head>
        <body style="margin: 0; padding: 0; background-color: #ffffff !important;">
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 320px; margin: 0 auto; padding: 24px; background-color: #ffffff !important; color: #000000 !important;">
            <div style="background-color: #f97316 !important; background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%) !important; color: #ffffff !important; font-size: 36px; font-weight: bold; letter-spacing: 12px; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 16px; border: 2px solid #f97316 !important;">
              ${code}
            </div>
            <p style="font-size: 13px; color: #6b7280 !important; text-align: center; margin: 0;">
              Expires in 10 minutes
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      console.log('========================================')
      console.log(`FALLBACK - Verification code for ${email}: ${code}`)
      console.log('========================================')
      return { success: true, devMode: true }
    }

    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    console.log('========================================')
    console.log(`FALLBACK - Verification code for ${email}: ${code}`)
    console.log('========================================')
    return { success: true, devMode: true }
  }
}
