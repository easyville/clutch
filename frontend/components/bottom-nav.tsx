'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: '💼', label: 'Offers' },
    { href: '/requests', icon: '🙋', label: 'Requests' },
    { href: '/saved', icon: '🔖', label: 'Saved' },
    { href: '/add', icon: '➕', label: 'Add' },
    { href: '/profile', icon: '👤', label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-inset-bottom z-50">
      <div className="max-w-2xl mx-auto px-2 py-2">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 transition-colors ${
                  isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
