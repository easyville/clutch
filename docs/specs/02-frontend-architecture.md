# Frontend Architecture Specification

**Status:** Prototype UI Built with Dummy Data
**Last Updated:** 2025-11-14

## Technology Stack

### Core
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - UI library
- **React DOM 19.2.0** - React rendering
- **TypeScript 5.9.3** - Type-safe JavaScript

### Styling
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **@tailwindcss/postcss 4.1.17** - PostCSS integration
- **Custom CSS Variables** - Theme and dark mode support
- **Geist Sans & Mono** - Google Fonts

### Development Tools
- **ESLint 9.39.1** - Code linting
- **eslint-config-next 16.0.3** - Next.js ESLint rules
- **TypeScript ESLint** - TypeScript linting

### Type Definitions
- @types/node@20.19.25
- @types/react@19.2.4
- @types/react-dom@19.2.3

## Current Directory Structure

```
frontend/
├── app/
│   ├── globals.css          # Global styles + Tailwind
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (needs replacement)
│   └── favicon.ico          # Favicon
├── public/                  # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── node_modules/
├── .next/                   # Build output
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## Planned Directory Structure

```
frontend/
├── app/
│   ├── (auth)/              # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/              # Main app route group
│   │   ├── layout.tsx       # Main app layout with nav
│   │   ├── page.tsx         # Home/browse listings
│   │   ├── listings/
│   │   │   ├── page.tsx     # All listings
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx # Single listing
│   │   │   └── new/
│   │   │       └── page.tsx # Create listing
│   │   ├── profile/
│   │   │   ├── page.tsx     # Own profile
│   │   │   └── [id]/
│   │   │       └── page.tsx # Other user profile
│   │   ├── messages/
│   │   │   ├── page.tsx     # Conversations list
│   │   │   └── [id]/
│   │   │       └── page.tsx # Conversation
│   │   └── settings/
│   │       └── page.tsx     # User settings
│   ├── api/                 # API routes (if needed)
│   ├── globals.css
│   ├── layout.tsx           # Root layout
│   └── favicon.ico
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   ├── listings/            # Listing-specific components
│   │   ├── ListingCard.tsx
│   │   ├── ListingGrid.tsx
│   │   ├── ListingForm.tsx
│   │   ├── ListingDetail.tsx
│   │   └── SearchBar.tsx
│   ├── messages/            # Message components
│   │   ├── ConversationList.tsx
│   │   ├── MessageBubble.tsx
│   │   └── MessageInput.tsx
│   └── profile/             # Profile components
│       ├── ProfileCard.tsx
│       ├── ProfileListings.tsx
│       └── ProfileEdit.tsx
├── lib/
│   ├── api/                 # API client functions
│   │   ├── auth.ts
│   │   ├── listings.ts
│   │   ├── users.ts
│   │   └── messages.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useListings.ts
│   │   └── useMessages.ts
│   ├── utils/               # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   └── types/               # TypeScript types
│       ├── user.ts
│       ├── listing.ts
│       └── message.ts
├── public/
│   ├── images/
│   └── icons/
├── .env.local               # Environment variables
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Configuration

### TypeScript Configuration (tsconfig.json)

**Current Location:** `E:\uni\apprentice\tradepal\frontend\tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Next.js Configuration (next.config.ts)

**Current Location:** `E:\uni\apprentice\tradepal\frontend\next.config.ts`

Currently minimal - needs expansion for:
- Image optimization domains
- Environment variable configuration
- API proxy configuration (if needed)
- Security headers

### Tailwind Configuration

**CSS Variables (globals.css):**
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

## Implemented Pages

### 1. Browse/Home Page (app/page.tsx)

**Location:** `E:\uni\apprentice\tradepal\frontend\app\page.tsx`

**Features:**
- Sticky header with TradePal branding
- Search bar (UI only, not functional)
- Category filter tabs (All, Skills, Items, Needs)
- Listing cards with user avatar, name, title, description, category badge, tags
- Bottom navigation (mobile only)
- Responsive grid layout

**Design:**
- Mobile-first with bottom nav on mobile
- Card-based layout inspired by Facebook Marketplace
- Color-coded category badges (blue=skill, green=item, orange=need)

### 2. Profile Page (app/profile/page.tsx)

**Location:** `E:\uni\apprentice\tradepal\frontend\app\profile\page.tsx`

**Features:**
- User profile header with avatar and bio
- Stats section (listings, exchanges, interests)
- "Looking For" interests section with tags
- User's listings grid
- Edit profile button (UI only)
- Bottom navigation

**Design:**
- Clean, card-based layout
- Editable interests with add/remove
- Shows user's active listings

### 3. Add Listing Page (app/add/page.tsx)

**Location:** `E:\uni\apprentice\tradepal\frontend\app\add\page.tsx`

**Features:**
- Category selection (Skill, Item, Need) with visual cards
- Title input field
- Description textarea with academic integrity reminder
- Tag system (add up to 5 tags)
- Form validation
- Submit button
- Tips section
- Bottom navigation

**Design:**
- Step-by-step form flow
- Visual category selection
- Clear call-to-action
- Helpful tips and reminders

### Dummy Data (lib/dummy-data.ts)

**Location:** `E:\uni\apprentice\tradepal\frontend\lib\dummy-data.ts`

**Contents:**
- Listing interface definition
- Current user data
- My listings (2 items)
- All listings (8 items from other users)
- My interests array

**Categories:**
- `skill`: Offering a skill
- `item`: Offering an item
- `need`: Need help with something

### Global Styles (app/globals.css)

**Location:** `E:\uni\apprentice\tradepal\frontend\app\globals.css`

**Current State:**
- Tailwind imports
- CSS variables for theming
- Dark mode support
- Font family definitions

## Planned Features

### Authentication Flow
1. **Login Page** - Email/password login form
2. **Register Page** - User registration with university email
3. **Password Reset** - Forgot password flow
4. **Protected Routes** - Redirect to login if not authenticated

### Main App Features

#### Home/Browse Page
- Hero section with search bar
- Category chips (Services, Goods, Requests)
- Grid of recent listings
- Infinite scroll or pagination
- Quick filters (campus, category)

#### Listings
- **List View:** Grid/list of all listings with filters
- **Detail View:** Single listing with images, description, user info
- **Create/Edit:** Form to create or edit listings
- **Search:** Full-text search with filters
- **Categories:** Services, Goods, Requests

#### User Profile
- **Own Profile:** View/edit own information
- **Other Profiles:** View other users' listings and info
- **Listings:** Grid of user's active listings
- **Reviews/Ratings:** Display reputation (if implemented)

#### Messages
- **Conversations List:** All conversations with unread indicators
- **Chat Interface:** Real-time messaging between users
- **Trade Proposals:** Send/accept/reject trade proposals
- **Notifications:** New message alerts

#### Settings
- Profile information editing
- Notification preferences
- Account management
- Privacy settings

## State Management

### Approach (To Be Decided)

**Options:**
1. **React Context API** - Built-in, simple, good for small apps
2. **Zustand** - Lightweight, minimal boilerplate
3. **Redux Toolkit** - Robust, more complex
4. **Jotai/Recoil** - Atomic state management

**Recommendation:** Start with React Context API for auth state, evaluate need for Zustand if complexity grows

### Global State Needs
- **Auth State:** Current user, token, login status
- **Listings State:** Cached listings, filters
- **Messages State:** Unread count, active conversations
- **UI State:** Modals, toasts, loading states

## Data Fetching

### Approach (To Be Decided)

**Options:**
1. **Native fetch with useEffect** - Simple, built-in
2. **SWR** - Lightweight, built by Vercel
3. **React Query** - Feature-rich, caching
4. **Next.js Server Actions** - New approach in Next.js

**Recommendation:** SWR for client-side data fetching, Server Actions for mutations

### API Client Structure

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export async function apiRequest(endpoint: string, options?: RequestInit) {
  const token = getAuthToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(response)
  }

  return response.json()
}
```

## Component Design Principles

### UI Component Library
- Create reusable, composable components
- Use TypeScript for prop types
- Follow atomic design principles (atoms, molecules, organisms)
- Implement consistent styling with Tailwind
- Add proper accessibility (ARIA labels, keyboard navigation)

### Example Component Structure

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'rounded font-medium transition-colors'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100'
  }
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} disabled:opacity-50`}
    >
      {children}
    </button>
  )
}
```

## Routing Strategy

### Next.js App Router
- Use route groups `(auth)` and `(main)` for layout organization
- Server Components by default
- Client Components (`'use client'`) only when needed
- Dynamic routes for detail pages: `[id]/page.tsx`
- Parallel routes for modals (if needed)

### Navigation
- Server-side navigation with `<Link>` component
- useRouter for programmatic navigation
- Loading states with `loading.tsx`
- Error boundaries with `error.tsx`

## Mobile-First Design

### Responsive Breakpoints (Tailwind)
- **sm:** 640px (mobile landscape)
- **md:** 768px (tablets)
- **lg:** 1024px (desktop)
- **xl:** 1280px (large desktop)

### Mobile Considerations
- Touch-friendly tap targets (min 44px)
- Thumb-zone navigation
- Swipe gestures for messages
- Pull-to-refresh
- Bottom navigation bar
- Optimized images

## Performance Optimization

### Next.js Features
- **Image Optimization:** Use `<Image>` component
- **Font Optimization:** Already using next/font
- **Code Splitting:** Automatic with App Router
- **Lazy Loading:** Dynamic imports for heavy components
- **Static Generation:** Use for public pages when possible

### Best Practices
- Minimize client-side JavaScript
- Use Server Components where possible
- Implement skeleton loaders
- Debounce search inputs
- Optimize images (WebP, proper sizing)
- Cache API responses with SWR/React Query

## Accessibility

### Requirements
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast compliance (WCAG AA)
- Skip to main content link

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_NAME=TradePal
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Scripts (package.json)

**Current Location:** `E:\uni\apprentice\tradepal\frontend\package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

**Needs:**
- Add type checking script: `"type-check": "tsc --noEmit"`
- Add format script if using Prettier
- Add test scripts when tests are added

## Next Steps

1. **Immediate:**
   - Replace default home page with TradePal UI
   - Create UI component library (Button, Input, Card, etc.)
   - Set up API client with fetch wrapper
   - Implement authentication context

2. **Short-term:**
   - Build all main pages (listings, profile, messages)
   - Implement routing and navigation
   - Add form validation
   - Set up state management

3. **Long-term:**
   - Add real-time messaging
   - Implement PWA features
   - Add offline support
   - Optimize for production

## Reference Files

- Layout: `E:\uni\apprentice\tradepal\frontend\app\layout.tsx`
- Home: `E:\uni\apprentice\tradepal\frontend\app\page.tsx`
- Styles: `E:\uni\apprentice\tradepal\frontend\app\globals.css`
- Config: `E:\uni\apprentice\tradepal\frontend\next.config.ts`
- TypeScript: `E:\uni\apprentice\tradepal\frontend\tsconfig.json`
