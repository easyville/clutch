# TradePal Knowledge Base

**Last Updated:** 2025-11-14

This is the central knowledge file for TradePal. Always check this first before exploring code.

## Quick Reference

- **Project:** Student skill-sharing platform (exchange skills & items, no money)
- **Status:** Prototype phase - building UI with dummy data
- **Main Branch:** main
- **Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Local only for prototype (no backend yet)
- **Database:** Not needed for prototype (using dummy data)

## Project Structure

```
tradepal/
├── docs/specs/           # Specification files (source of truth)
├── frontend/             # Next.js app (scaffolding only)
│   ├── app/             # App Router (default template)
│   └── package.json
├── backend/              # NOT CREATED YET
└── README               # Project description
```

## Key Files

### Configuration
- Frontend config: `frontend/package.json`
- TypeScript: `frontend/tsconfig.json`
- Next.js: `frontend/next.config.ts`
- Tailwind: `frontend/app/globals.css`

### Current Code (Minimal)
- Layout: `frontend/app/layout.tsx`
- Home page: `frontend/app/page.tsx` (default Next.js template - needs replacement)
- Styles: `frontend/app/globals.css`

## Specifications (Always Check These First!)

1. **00-project-overview.md** - Overall project info, tech stack, roadmap
2. **01-backend-api.md** - Backend API design (not implemented)
3. **02-frontend-architecture.md** - Frontend structure (not implemented)
4. **03-database-schema.md** - Database schema (not implemented)

## What Exists vs What's Planned

### ✓ Implemented
- Next.js 16 scaffolding with App Router
- TypeScript configuration
- Tailwind CSS setup
- ESLint configuration

### ⏳ Not Implemented (Plan in Specs)
- Backend server
- Database
- Authentication
- All UI components
- All features (listings, messaging, trades, etc.)

## Common Tasks

### To build a feature:
1. Check relevant spec file first
2. Implement the feature
3. Update the spec if design changes

### To add API endpoint:
1. Check `01-backend-api.md` for existing endpoints
2. Add new endpoint to spec
3. Implement in backend (when created)

### To add UI component:
1. Check `02-frontend-architecture.md` for component structure
2. Create component following the pattern
3. Update spec if needed

### To modify database:
1. Check `03-database-schema.md` for current schema
2. Plan migration
3. Update spec with changes

## Important Notes

- **Prototype with dummy data** - no backend/database for now
- **Core concept:** Students share skills and items they can offer, post what they need help with
- **No money involved** - pure skill/item exchange
- **Academic integrity:** NO assignment writing allowed (against uni policy)
- **Mobile-first design** - inspired by Facebook Marketplace/WhatsApp/Vinted
- **Example exchanges:** Math tutoring ↔ Guitar lessons, Sweets ↔ Laundry help
- **Key pages:** Profile (my listings + interests), Browse (all listings), Add Listing

## Decision Log

### Made
- Next.js 16 with App Router ✓
- TypeScript for type safety ✓
- Tailwind CSS for styling ✓
- Express.js for backend (planned)
- PostgreSQL for database (planned)
- Prisma for ORM (planned)

### Pending
- State management library (Context API vs Zustand vs Redux)
- Data fetching (SWR vs React Query)
- Authentication strategy (JWT vs sessions)
- File storage (local vs S3 vs Cloudinary)
- Deployment platform (Vercel vs AWS vs Railway)

## Token-Saving Rules

1. **Always read this file first** before exploring code
2. **Check relevant spec** before reading source files
3. **Update specs** when making changes to keep them current
4. **Don't re-explore** what's already documented in specs

## Next Steps (Priority Order)

1. Create backend directory structure
2. Set up Express.js server
3. Initialize Prisma and create database schema
4. Implement authentication
5. Replace frontend default template with TradePal UI
6. Build listing CRUD operations
7. Implement messaging system
