'use client'

import Link from 'next/link'
import { useState } from 'react'
import { allListings, abbreviateName } from '@/lib/dummy-data'

export default function Home() {
  const [filter, setFilter] = useState<'all' | 'skill' | 'item'>('all')

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
          <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <input
          type="text"
          placeholder="Search skills, items, or needs..."
          className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="max-w-2xl mx-auto px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('skill')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'skill'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setFilter('item')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === 'item'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Items
          </button>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <div className="space-y-3">
          {allListings.filter(listing => listing.category !== 'need').map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {listing.userAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{abbreviateName(listing.userName)}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{listing.createdAt}</span>
                  </div>
                  <h2 className="font-medium text-gray-900 mb-1">{listing.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{listing.description}</p>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(listing.category)}`}>
                      {getCategoryLabel(listing.category)}
                    </span>
                    {listing.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        alert('Make an offer feature coming soon!')
                      }}
                      className="py-1.5 px-3 bg-blue-600 text-white rounded-sm text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      Make Offer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="max-w-2xl mx-auto px-2 py-2">
          <div className="grid grid-cols-5 gap-1">
            <Link href="/" className="flex flex-col items-center py-2 text-blue-600">
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
            <Link href="/profile" className="flex flex-col items-center py-2 text-gray-500">
              <span className="text-2xl mb-1">👤</span>
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
