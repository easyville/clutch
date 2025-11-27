'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const ADMIN_EMAIL = 'vs22222@essex.ac.uk'

interface Listing {
  id: string
  title: string
  description: string
  category: string
  type: string
  tags: string[]
  createdAt: string
  userId: string
  userName: string
  userEmail: string
}

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoadingListings, setIsLoadingListings] = useState(true)
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view')
  
  // Add listing form
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    category: 'skill',
    type: 'offer',
    tags: '',
    userEmail: '',
    userName: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const fetchAllListings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/listings')
      const data = await res.json()
      if (data.success) {
        setListings(data.listings)
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setIsLoadingListings(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/')
        return
      }
      fetchAllListings()
    }
  }, [user, isLoading, router, fetchAllListings])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    
    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setListings(prev => prev.filter(l => l.id !== id))
        setMessage('Listing deleted!')
      }
    } catch (error) {
      console.error('Delete error:', error)
      setMessage('Failed to delete')
    }
  }

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newListing,
          tags: newListing.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      
      if (data.success) {
        setMessage('Listing created successfully!')
        setNewListing({
          title: '',
          description: '',
          category: 'skill',
          type: 'offer',
          tags: '',
          userEmail: '',
          userName: '',
        })
        fetchAllListings()
      } else {
        setMessage(data.error || 'Failed to create listing')
      }
    } catch (error) {
      console.error('Create error:', error)
      setMessage('Failed to create listing')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-orange-500">🔧 Admin Panel</h1>
            <p className="text-gray-400 text-sm">Clutch Database Manager</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            ← Back to App
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'view'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📋 View Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'add'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ➕ Add Listing
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('success') || message.includes('deleted')
              ? 'bg-green-900/50 text-green-300 border border-green-700'
              : 'bg-red-900/50 text-red-300 border border-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* View Tab */}
        {activeTab === 'view' && (
          <div className="space-y-4">
            {isLoadingListings ? (
              <div className="text-center py-12 text-gray-400">Loading listings...</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No listings in database</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Title</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">User</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Created</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {listings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-800/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{listing.title}</div>
                          <div className="text-gray-500 text-xs truncate max-w-xs">{listing.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            listing.type === 'offer' 
                              ? 'bg-orange-900/50 text-orange-300' 
                              : 'bg-rose-900/50 text-rose-300'
                          }`}>
                            {listing.type} / {listing.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{listing.userName}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{listing.userEmail}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(listing.createdAt)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 rounded text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Tab */}
        {activeTab === 'add' && (
          <div className="max-w-xl">
            <form onSubmit={handleAddListing} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">User Email *</label>
                  <input
                    type="email"
                    value={newListing.userEmail}
                    onChange={(e) => setNewListing({ ...newListing, userEmail: e.target.value })}
                    placeholder="user@essex.ac.uk"
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">User Name *</label>
                  <input
                    type="text"
                    value={newListing.userName}
                    onChange={(e) => setNewListing({ ...newListing, userName: e.target.value })}
                    placeholder="John D."
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title *</label>
                <input
                  type="text"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  placeholder="Listing title"
                  required
                  maxLength={50}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description *</label>
                <textarea
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  placeholder="Listing description"
                  required
                  maxLength={200}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select
                    value={newListing.type}
                    onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="offer">Offer</option>
                    <option value="request">Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="skill">Skill</option>
                    <option value="item">Item</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newListing.tags}
                  onChange={(e) => setNewListing({ ...newListing, tags: e.target.value })}
                  placeholder="Math, Tutoring, Help"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Listing'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

