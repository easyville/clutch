'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AddListing() {
  const [type, setType] = useState<'offer' | 'request'>('offer')
  const [category, setCategory] = useState<'skill' | 'item'>('skill')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In prototype, just show alert
    alert('Listing created! (This is a prototype - no backend yet)')
    // Reset form
    setTitle('')
    setDescription('')
    setTags([])
    setType('offer')
    setCategory('skill')
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Add Listing</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection: Offer or Request */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              What would you like to do?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('offer')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  type === 'offer'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">💼</div>
                <div className={`text-base font-semibold ${type === 'offer' ? 'text-blue-900' : 'text-gray-700'}`}>
                  Offer
                </div>
                <div className="text-xs text-gray-500 mt-1">I can help or share</div>
              </button>
              <button
                type="button"
                onClick={() => setType('request')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  type === 'request'
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">🙋</div>
                <div className={`text-base font-semibold ${type === 'request' ? 'text-orange-900' : 'text-gray-700'}`}>
                  Request
                </div>
                <div className="text-xs text-gray-500 mt-1">I need help</div>
              </button>
            </div>
          </div>

          {/* Category Selection: Show for both Offer and Request */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              {type === 'offer' ? 'What are you offering?' : 'What do you need?'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCategory('skill')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  category === 'skill'
                    ? type === 'offer'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">🎓</div>
                <div className={`text-base font-semibold ${
                  category === 'skill'
                    ? type === 'offer'
                      ? 'text-blue-900'
                      : 'text-orange-900'
                    : 'text-gray-700'
                }`}>
                  Help
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {type === 'offer' ? 'Skills & services' : 'Need assistance'}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setCategory('item')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  category === 'item'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">📦</div>
                <div className={`text-base font-semibold ${category === 'item' ? 'text-green-900' : 'text-gray-700'}`}>
                  Item
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {type === 'offer' ? 'Things to share' : 'Need to borrow'}
                </div>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'request'
                  ? category === 'skill'
                    ? 'e.g., Need Math Tutoring Help'
                    : 'e.g., Looking for Laptop Charger'
                  : category === 'skill'
                  ? 'e.g., Math Tutoring Available'
                  : 'e.g., Extra Textbooks to Share'
              }
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                type === 'request'
                  ? "Describe what help you need. What can you offer in exchange?"
                  : "Describe what you're offering. What would you like in exchange?"
              }
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none shadow-sm"
            />
            <div className="mt-2 text-xs text-gray-600 flex items-start gap-1">
              <span>⚠️</span>
              <span>Academic integrity reminder: No assignment writing or cheating services allowed</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tags (optional, max 5)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add a tag..."
                disabled={tags.length >= 5}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 shadow-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim() || !description.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Post Listing
          </button>
        </form>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for great listings</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about what you offer and what you need</li>
            <li>• Use clear, descriptive titles</li>
            <li>• Mention your availability</li>
            <li>• Be respectful and follow university policies</li>
          </ul>
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
            <Link href="/add" className="flex flex-col items-center py-2 text-blue-600">
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
