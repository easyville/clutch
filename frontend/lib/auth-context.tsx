'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  email: string
  name: string
  verified: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string) => Promise<{ success: boolean; error?: string; devCode?: string }>
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  pendingEmail: string | null
  setPendingEmail: (email: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  // Check auth status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      
      if (data.success && data.user) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string): Promise<{ success: boolean; error?: string; devCode?: string }> => {
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (data.success) {
        setPendingEmail(email.toLowerCase().trim())
        
        // If in dev mode, return the code for display
        if (data.devMode && data.code) {
          return { success: true, devCode: data.code }
        }
        
        return { success: true }
      }

      return { success: false, error: data.error || 'Failed to send code' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const verifyCode = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()

      if (data.success && data.user) {
        setUser(data.user)
        setPendingEmail(null)
        return { success: true }
      }

      return { success: false, error: data.error || 'Verification failed' }
    } catch (error) {
      console.error('Verify error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/me', { method: 'DELETE' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    setUser(null)
    setPendingEmail(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, verifyCode, logout, pendingEmail, setPendingEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
