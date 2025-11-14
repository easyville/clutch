# TradePal - Project Overview

**Status:** Prototype Phase (UI Built with Dummy Data)
**Last Updated:** 2025-11-14

## Project Description

TradePal is a student skill-sharing platform where students share skills and items they can offer, and post what they need help with. Students can add their skills (e.g., math tutoring, guitar lessons) and items (e.g., sweets, textbooks), then browse listings from other students to send offers for exchanges.

**Core Principles:**
- **No money involved** - pure skill/item exchange
- **Academic integrity** - NO assignment writing (against university policy)
- **Student-focused** - help each other with legitimate academic support and life needs
- **Examples:** Math tutoring ↔ Guitar lessons, Sweets ↔ Laundry help, Ride ↔ Coffee

**Repository:** git@github.com:vbshuliar/tradepal.git
**Former Name:** CampusTrade

## Technology Stack

### Frontend (Implemented)
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **ESLint 9.39.1** - Code linting

### Backend (Planned)
- **Express.js 5.1.0** - Web framework
- **Node.js** - Runtime environment

### Database (Not Decided)
- **Options:** PostgreSQL, MongoDB, MySQL
- **ORM/ODM Options:** Prisma, TypeORM, Mongoose

### Development Tools
- **Tessl AI** - AI development assistant with Express.js knowledge
- **Claude Code** - AI coding assistant
- **MCP Server** - Tessl integration

## Project Structure

```
tradepal/
├── docs/
│   └── specs/              # Specification files (this directory)
├── frontend/               # Next.js application
│   ├── app/               # Next.js App Router
│   ├── public/            # Static assets
│   └── package.json
├── .tessl/                # Tessl AI configuration
├── .claude/               # Claude Code configuration
├── README                 # Project description
└── tessl.json            # Tessl configuration
```

## Core Features (Planned)

### 1. User Management
- User registration and authentication
- Student profile creation
- University/campus affiliation

### 2. Listing Management
- Create, read, update, delete listings
- Categories: Services, Goods, Requests
- Listing details: title, description, images, category

### 3. Search & Discovery
- Search listings by keyword
- Filter by category, location, campus
- Browse recent/popular listings

### 4. Barter System
- Trade proposal system
- No payment processing
- Direct peer-to-peer exchanges

### 5. Messaging
- Direct messaging between users
- Trade negotiation interface
- Notification system

### 6. User Profiles
- View user's active listings
- User reputation/reviews
- Contact preferences

## Development Status

### Completed ✓
- [x] Frontend scaffolding with Next.js
- [x] TypeScript configuration
- [x] Tailwind CSS setup
- [x] ESLint configuration
- [x] Main browse page with dummy listings
- [x] Profile page with user listings and interests
- [x] Add listing page with form
- [x] Mobile-first responsive design
- [x] Bottom navigation (mobile)
- [x] Dummy data structure

### Not Started ⏳
- [ ] Backend development
- [ ] Database integration
- [ ] Real data persistence
- [ ] Authentication/authorization
- [ ] Messaging functionality
- [ ] Search and filters (working)
- [ ] Testing infrastructure
- [ ] Deployment configuration

## Key Design Decisions

### Made
1. Next.js 16 with App Router for frontend
2. TypeScript for type safety
3. Tailwind CSS for styling
4. React 19 for UI components
5. Express.js for backend (planned)

### Pending
- Database choice (PostgreSQL vs MongoDB vs MySQL)
- ORM/ODM selection
- Authentication strategy (JWT, sessions, OAuth)
- State management approach (Context API, Redux, Zustand)
- API architecture (REST, GraphQL, tRPC)
- File storage solution (local, S3, Cloudinary)
- Real-time features (WebSockets, Server-Sent Events)
- Deployment platform (Vercel, AWS, Railway)

## Development Roadmap

### Phase 1: Foundation (Current)
1. Set up backend with Express.js
2. Design and implement database schema
3. Configure authentication system
4. Create basic API routes

### Phase 2: Core Features
1. Build listing CRUD operations
2. Implement search and filter
3. Create messaging system
4. Develop user profiles

### Phase 3: UI Development
1. Design component library
2. Build all pages (home, listings, profile)
3. Implement responsive design
4. Add mobile optimization

### Phase 4: Polish
1. Add testing (unit, integration, E2E)
2. Implement error handling
3. Add loading states and optimizations
4. Set up CI/CD

### Phase 5: Deployment
1. Configure production environment
2. Set up monitoring and logging
3. Deploy to production
4. User testing and feedback

## Notes for Development

- This is a **student-focused** marketplace - design should be simple and accessible
- **No payment processing** - focus on barter/exchange mechanics
- **Mobile-first** - students primarily use mobile devices
- **Campus-specific** - users should see listings relevant to their university
- **Trust & Safety** - implement reputation system and reporting

## Reference Files

- Main README: `E:\uni\apprentice\tradepal\README`
- Frontend Configuration: `E:\uni\apprentice\tradepal\frontend\package.json`
- TypeScript Config: `E:\uni\apprentice\tradepal\frontend\tsconfig.json`
