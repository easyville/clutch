'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useAuth } from './auth-context'

interface SavedContextType {
  savedIds: string[]
  toggleSave: (id: string) => Promise<void>
  isSaved: (id: string) => boolean
  isLoading: boolean
  refresh: () => Promise<void>
}

const SavedContext = createContext<SavedContextType | undefined>(undefined)

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  const refresh = useCallback(async () => {
    if (!user) {
      setSavedIds([])
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/saved')
      const data = await res.json()
      
      if (data.success) {
        setSavedIds(data.savedIds || [])
      }
    } catch (error) {
      console.error('Failed to fetch saved listings:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const toggleSave = async (id: string) => {
    // Optimistic update
    const wasSaved = savedIds.includes(id)
    setSavedIds(prev => 
      wasSaved ? prev.filter(savedId => savedId !== id) : [...prev, id]
    )

    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: id }),
      })

      const data = await res.json()
      
      if (!data.success) {
        // Revert on failure
        setSavedIds(prev => 
          wasSaved ? [...prev, id] : prev.filter(savedId => savedId !== id)
        )
      }
    } catch (error) {
      console.error('Toggle save error:', error)
      // Revert on error
      setSavedIds(prev => 
        wasSaved ? [...prev, id] : prev.filter(savedId => savedId !== id)
      )
    }
  }

  const isSaved = (id: string) => savedIds.includes(id)

  return (
    <SavedContext.Provider value={{ savedIds, toggleSave, isSaved, isLoading, refresh }}>
      {children}
    </SavedContext.Provider>
  )
}

export function useSaved() {
  const context = useContext(SavedContext)
  if (context === undefined) {
    throw new Error('useSaved must be used within a SavedProvider')
  }
  return context
}
