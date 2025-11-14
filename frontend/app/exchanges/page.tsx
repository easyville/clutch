'use client'

import Link from 'next/link'
import { useState } from 'react'
import { sentExchanges, receivedExchanges, abbreviateName, type Exchange } from '@/lib/dummy-data'

export default function Exchanges() {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')

  const handleApprove = (exchangeId: string) => {
    alert(`Approved exchange ${exchangeId} (prototype - no backend yet)`)
  }

  const handleReject = (exchangeId: string) => {
    alert(`Rejected exchange ${exchangeId} (prototype - no backend yet)`)
  }

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

  const getStatusBadge = (status: Exchange['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 whitespace-nowrap">
            ✓ Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-800 whitespace-nowrap">
            ✗ Rejected
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 whitespace-nowrap">
            ⏳ Pending
          </span>
        )
    }
  }

  const ExchangeCard = ({ exchange }: { exchange: Exchange }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{exchange.otherUserAvatar}</div>
        <div className="flex-1 min-w-0">
          {/* Header: Name, Status, Timestamp */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              {abbreviateName(exchange.otherUserName)}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {getStatusBadge(exchange.status)}
              <span className="text-xs text-gray-500">{exchange.createdAt}</span>
            </div>
          </div>

          {/* Type + Listing in one line */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(exchange.listingCategory)}`}>
              {getCategoryLabel(exchange.listingCategory)}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <p className="font-medium text-gray-900 text-sm">{exchange.listingTitle}</p>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-600 mb-2">
            <span className="text-gray-500">
              {exchange.type === 'sent' ? 'Your offer: ' : 'Their offer: '}
            </span>
            <span className="text-gray-700">"{exchange.message}"</span>
          </p>

          {/* Contact Information - only for approved exchanges */}
          {exchange.status === 'approved' && exchange.contactInfo && (
            <div className="mb-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-xs font-semibold text-green-900 mb-1.5">📞 Contact Details</h4>
              <div className="space-y-1 text-xs text-green-800">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Name:</span>
                  <span className="text-green-900 font-semibold">{exchange.contactInfo.fullName}</span>
                </div>
                {exchange.contactInfo.email && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${exchange.contactInfo.email}`} className="text-blue-600 hover:underline">
                      {exchange.contactInfo.email}
                    </a>
                  </div>
                )}
                {exchange.contactInfo.phone && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">Phone:</span>
                    <a href={`tel:${exchange.contactInfo.phone}`} className="text-blue-600 hover:underline">
                      {exchange.contactInfo.phone}
                    </a>
                  </div>
                )}
                {exchange.contactInfo.instagram && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">Instagram:</span>
                    <span className="text-green-700">{exchange.contactInfo.instagram}</span>
                  </div>
                )}
                {exchange.contactInfo.snapchat && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">Snapchat:</span>
                    <span className="text-green-700">{exchange.contactInfo.snapchat}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approve/Reject Buttons */}
          {exchange.type === 'received' && exchange.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(exchange.id)}
                className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(exchange.id)}
                className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const exchanges = activeTab === 'received' ? receivedExchanges : sentExchanges

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Exchanges</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'received'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Received
            {receivedExchanges.filter(e => e.status === 'pending').length > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'received'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {receivedExchanges.filter(e => e.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'sent'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Sent
          </button>
        </div>

        {/* Exchanges List */}
        {exchanges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab} exchanges yet
            </h3>
            <p className="text-gray-600">
              {activeTab === 'received'
                ? 'When others respond to your listings, they\'ll appear here'
                : 'Start exchanging by responding to listings you\'re interested in'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {exchanges.map((exchange) => (
              <ExchangeCard key={exchange.id} exchange={exchange} />
            ))}
          </div>
        )}
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
            <Link href="/exchanges" className="flex flex-col items-center py-2 text-blue-600 relative">
              <span className="text-2xl mb-1">💬</span>
              <span className="text-xs font-medium">Exchanges</span>
              {receivedExchanges.filter(e => e.status === 'pending').length > 0 && (
                <span className="absolute top-1 right-1/4 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {receivedExchanges.filter(e => e.status === 'pending').length}
                </span>
              )}
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
