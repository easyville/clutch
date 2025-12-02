'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function Verify() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const { verifyCode, pendingEmail, sendCode, user, isLoading } = useAuth()
  const router = useRouter()
  const codeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Redirect if already logged in
    if (!isLoading && user) {
      router.push('/')
      return
    }
    
    // Redirect to login if no pending email
    if (!isLoading && !pendingEmail && !user) {
      router.push('/login')
    }
  }, [pendingEmail, user, isLoading, router])

  // Handle cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
    setError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData) {
      setCode(pastedData)
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!pendingEmail) return
    
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsSubmitting(true)
    const result = await verifyCode(pendingEmail, code)
    
    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Verification failed')
      setCode('')
      codeInputRef.current?.focus()
    }
    
    setIsSubmitting(false)
  }

  const handleResend = async () => {
    if (pendingEmail && resendCooldown === 0) {
      setResendCooldown(60)
      const result = await sendCode(pendingEmail)
      if (result.success && result.devCode) {
        alert(`🔧 Local Dev Mode\n\nNew verification code: ${result.devCode}`)
      }
    }
  }

  if (isLoading || (!pendingEmail && !user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl animate-pulse">📧</span>
          </div>
          <div className="text-white text-lg font-medium">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 flex flex-col">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📧</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
          <p className="text-white/80">
            We sent a verification code to
          </p>
          <p className="text-white font-semibold mt-1">{pendingEmail}</p>
        </div>

        {/* Verification Card */}
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-orange-900/20">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Enter verification code
            </h2>
            <p className="text-gray-500 text-sm mb-6 text-center">
              The 6-digit code from your email
            </p>

            {/* Code Input */}
            <div className="mb-6" onPaste={handlePaste}>
              <input
                ref={codeInputRef}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="000000"
                className="w-full h-16 text-center text-3xl font-bold tracking-widest bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || code.length !== 6}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 hover:scale-[1.02] active:scale-[0.98] active:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-lg shadow-orange-500/30"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify & Continue'
              )}
            </button>

            {/* Resend */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-orange-500 hover:text-orange-600 hover:scale-105 active:scale-95 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
              </button>
            </div>
          </div>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-white/80 hover:text-white hover:scale-105 active:scale-95 text-sm transition-all"
            >
              ← Use a different email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
