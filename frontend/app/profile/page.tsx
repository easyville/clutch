'use client'

import Link from 'next/link'
import { currentUser, myListings, myInterests } from '@/lib/dummy-data'

export default function Profile() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'skill': return 'bg-blue-100 text-blue-700'
      case 'item': return 'bg-green-100 text-green-700'
      case 'need': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'skill': return 'Offering Skill'
      case 'item': return 'Offering Item'
      case 'need': return 'Need Help'
      default: return category
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
      </header>

      {/* Profile Info */}
      <div className="max-w-2xl mx-auto px-4 py-6 bg-white border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl flex-shrink-0 shadow-sm">
            {currentUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentUser.name}</h2>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{currentUser.bio}</p>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-2xl mx-auto px-4 py-5 bg-white mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="px-2">
            <div className="text-2xl font-bold text-gray-900">{myListings.length}</div>
            <div className="text-xs text-gray-600 mt-1">Active Listings</div>
          </div>
          <div className="px-2 border-x border-gray-200">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-600 mt-1">Exchanges</div>
          </div>
          <div className="px-2">
            <div className="text-2xl font-bold text-gray-900">{myInterests.length}</div>
            <div className="text-xs text-gray-600 mt-1">Interests</div>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Looking For</h3>
          <div className="flex flex-wrap gap-2">
            {myInterests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium shadow-sm"
              >
                {interest}
              </span>
            ))}
            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm">
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* My Listings */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">My Listings</h3>
          <Link href="/add" className="text-sm text-blue-600 font-medium">
            + Add New
          </Link>
        </div>
        <div className="space-y-3">
          {myListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h2 className="font-medium text-gray-900 mb-1">{listing.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{listing.description}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 ml-2">⋯</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(listing.category)}`}>
                    {getCategoryLabel(listing.category)}
                  </span>
                  {listing.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{listing.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="max-w-2xl mx-auto px-2 py-2">
          <div className="grid grid-cols-5 gap-1">
            <Link href="/" className="flex flex-col items-center py-2 text-gray-500">
              <span className="text-2xl mb-1">💼</span>
              <span className="text-xs font-medium">Offers</span>
            </Link>
            <Link href="/requests" className="flex flex-col items-center py-2 text-gray-500">
              <span className="text-2xl mb-1">🙋</span>
              <span className="text-xs font-medium">Requests</span>
            </Link>
            <Link href="/exchanges" className="flex flex-col items-center py-2 text-gray-500">
              <span className="text-2xl mb-1">💬</span>
              <span className="text-xs font-medium">Exchanges</span>
            </Link>
            <Link href="/add" className="flex flex-col items-center py-2 text-gray-500">
              <span className="text-2xl mb-1">➕</span>
              <span className="text-xs font-medium">Add</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center py-2 text-blue-600">
              <span className="text-2xl mb-1">👤</span>
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
