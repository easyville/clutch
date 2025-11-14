# Database Schema Specification

**Status:** Not Implemented
**Last Updated:** 2025-11-14

## Database Choice (To Be Decided)

### Options
1. **PostgreSQL** - Relational, ACID compliant, robust
2. **MongoDB** - NoSQL, flexible schema, fast
3. **MySQL** - Relational, widely supported

**Recommendation:** PostgreSQL for data integrity and relational structure

## ORM/ODM Choice (To Be Decided)

### Options
1. **Prisma** - Type-safe, modern, great DX
2. **TypeORM** - Feature-rich, decorators
3. **Sequelize** - Mature, widely used
4. **Mongoose** - MongoDB only

**Recommendation:** Prisma for PostgreSQL (type safety + migrations)

## Schema Design

### Core Entities

The TradePal database consists of the following main entities:
1. Users
2. Listings
3. Messages
4. Conversations
5. Trades
6. Categories
7. Universities

## Entity Relationship Diagram

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│    User     │──────────│   Listing   │──────────│  Category   │
│             │ 1      n │             │ n      1 │             │
│  - id       │          │  - id       │          │  - id       │
│  - email    │          │  - title    │          │  - name     │
│  - name     │          │  - desc     │          │  - slug     │
│  - univ_id  │          │  - user_id  │          └─────────────┘
└──────┬──────┘          │  - cat_id   │
       │                 └─────────────┘
       │ 1                      │
       │                        │ n
       │                  ┌─────┴──────┐
       │                  │   Trade    │
       │                  │            │
       │                  │  - id      │
       │                  │  - list_id │
       │                  │  - prop_id │
       │                  │  - status  │
       │                  └────────────┘
       │
       │ n
┌──────┴──────────┐       ┌─────────────┐
│  Conversation   │───────│   Message   │
│                 │ 1   n │             │
│  - id           │       │  - id       │
│  - user1_id     │       │  - conv_id  │
│  - user2_id     │       │  - send_id  │
└─────────────────┘       │  - content  │
                          │  - read     │
                          └─────────────┘

┌─────────────┐
│ University  │
│             │
│  - id       │
│  - name     │
│  - domain   │
└─────────────┘
```

## Detailed Schema

### Users Table

Stores user account information and profile data.

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(100) NOT NULL,
  bio             TEXT,
  avatar_url      VARCHAR(500),
  university_id   UUID REFERENCES universities(id),
  phone           VARCHAR(20),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at   TIMESTAMP,
  is_active       BOOLEAN DEFAULT true,
  is_verified     BOOLEAN DEFAULT false,

  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_university ON users(university_id);
```

**Prisma Schema:**
```prisma
model User {
  id            String        @id @default(uuid())
  email         String        @unique
  passwordHash  String        @map("password_hash")
  name          String
  bio           String?
  avatarUrl     String?       @map("avatar_url")
  universityId  String?       @map("university_id")
  phone         String?
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")
  lastLoginAt   DateTime?     @map("last_login_at")
  isActive      Boolean       @default(true) @map("is_active")
  isVerified    Boolean       @default(false) @map("is_verified")

  university    University?   @relation(fields: [universityId], references: [id])
  listings      Listing[]
  messagesSent  Message[]     @relation("SentMessages")
  conversations Conversation[] @relation("UserConversations")
  tradesProposed Trade[]       @relation("TradeProposer")
  tradesReceived Trade[]       @relation("TradeReceiver")

  @@index([email])
  @@index([universityId])
  @@map("users")
}
```

### Universities Table

Stores university/campus information for user affiliation.

```sql
CREATE TABLE universities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  domain      VARCHAR(100) UNIQUE NOT NULL,
  location    VARCHAR(200),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT domain_format CHECK (domain ~* '^[a-z0-9.-]+\.[a-z]{2,}$')
);

CREATE INDEX idx_universities_domain ON universities(domain);
```

**Prisma Schema:**
```prisma
model University {
  id        String   @id @default(uuid())
  name      String
  domain    String   @unique
  location  String?
  createdAt DateTime @default(now()) @map("created_at")

  users     User[]

  @@index([domain])
  @@map("universities")
}
```

### Categories Table

Predefined categories for listings (Services, Goods, Requests).

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(50) NOT NULL,
  slug        VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon        VARCHAR(50),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- Seed data
INSERT INTO categories (name, slug, description) VALUES
  ('Services', 'services', 'Offer or request services like tutoring, rides, etc.'),
  ('Goods', 'goods', 'Trade physical items like textbooks, furniture, etc.'),
  ('Requests', 'requests', 'Request help or items you need');
```

**Prisma Schema:**
```prisma
model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  icon        String?
  createdAt   DateTime  @default(now()) @map("created_at")

  listings    Listing[]

  @@index([slug])
  @@map("categories")
}
```

### Listings Table

Stores marketplace listings created by users.

```sql
CREATE TABLE listings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  title       VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  images      TEXT[],
  location    VARCHAR(200),
  status      VARCHAR(20) DEFAULT 'active',
  views_count INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at  TIMESTAMP,

  CONSTRAINT status_check CHECK (status IN ('active', 'inactive', 'completed', 'deleted'))
);

CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created ON listings(created_at DESC);
```

**Prisma Schema:**
```prisma
enum ListingStatus {
  active
  inactive
  completed
  deleted
}

model Listing {
  id          String        @id @default(uuid())
  userId      String        @map("user_id")
  categoryId  String        @map("category_id")
  title       String
  description String
  images      String[]
  location    String?
  status      ListingStatus @default(active)
  viewsCount  Int           @default(0) @map("views_count")
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")
  expiresAt   DateTime?     @map("expires_at")

  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category      @relation(fields: [categoryId], references: [id])
  trades      Trade[]

  @@index([userId])
  @@index([categoryId])
  @@index([status])
  @@index([createdAt(sort: Desc)])
  @@map("listings")
}
```

### Conversations Table

Stores conversation threads between two users.

```sql
CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT different_users CHECK (user1_id != user2_id),
  CONSTRAINT unique_conversation UNIQUE (user1_id, user2_id)
);

CREATE INDEX idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON conversations(user2_id);
```

**Prisma Schema:**
```prisma
model Conversation {
  id        String    @id @default(uuid())
  user1Id   String    @map("user1_id")
  user2Id   String    @map("user2_id")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  user1     User      @relation("UserConversations", fields: [user1Id], references: [id], onDelete: Cascade)
  user2     User      @relation("UserConversations", fields: [user2Id], references: [id], onDelete: Cascade)
  messages  Message[]

  @@unique([user1Id, user2Id])
  @@index([user1Id])
  @@index([user2Id])
  @@map("conversations")
}
```

### Messages Table

Stores individual messages within conversations.

```sql
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

**Prisma Schema:**
```prisma
model Message {
  id             String       @id @default(uuid())
  conversationId String       @map("conversation_id")
  senderId       String       @map("sender_id")
  content        String
  isRead         Boolean      @default(false) @map("is_read")
  createdAt      DateTime     @default(now()) @map("created_at")

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User         @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)

  @@index([conversationId])
  @@index([senderId])
  @@index([createdAt(sort: Desc)])
  @@map("messages")
}
```

### Trades Table

Stores trade proposals between users for listings.

```sql
CREATE TABLE trades (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id          UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  proposer_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offered_listing_id  UUID REFERENCES listings(id) ON DELETE SET NULL,
  message             TEXT,
  status              VARCHAR(20) DEFAULT 'pending',
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at        TIMESTAMP,

  CONSTRAINT status_check CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  CONSTRAINT different_users CHECK (proposer_id != receiver_id)
);

CREATE INDEX idx_trades_listing ON trades(listing_id);
CREATE INDEX idx_trades_proposer ON trades(proposer_id);
CREATE INDEX idx_trades_receiver ON trades(receiver_id);
CREATE INDEX idx_trades_status ON trades(status);
```

**Prisma Schema:**
```prisma
enum TradeStatus {
  pending
  accepted
  rejected
  completed
  cancelled
}

model Trade {
  id               String      @id @default(uuid())
  listingId        String      @map("listing_id")
  proposerId       String      @map("proposer_id")
  receiverId       String      @map("receiver_id")
  offeredListingId String?     @map("offered_listing_id")
  message          String?
  status           TradeStatus @default(pending)
  createdAt        DateTime    @default(now()) @map("created_at")
  updatedAt        DateTime    @updatedAt @map("updated_at")
  respondedAt      DateTime?   @map("responded_at")

  listing          Listing     @relation(fields: [listingId], references: [id], onDelete: Cascade)
  proposer         User        @relation("TradeProposer", fields: [proposerId], references: [id], onDelete: Cascade)
  receiver         User        @relation("TradeReceiver", fields: [receiverId], references: [id], onDelete: Cascade)

  @@index([listingId])
  @@index([proposerId])
  @@index([receiverId])
  @@index([status])
  @@map("trades")
}
```

## Complete Prisma Schema

**File Location:** `backend/prisma/schema.prisma` (when created)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums
enum ListingStatus {
  active
  inactive
  completed
  deleted
}

enum TradeStatus {
  pending
  accepted
  rejected
  completed
  cancelled
}

// Models (all models from above combined)
// ... (Full schema would be too long, but includes all models above)
```

## Indexes Strategy

### Performance Indexes
- Foreign keys (automatic in most cases)
- Frequently queried fields (email, status, created_at)
- Composite indexes for common query patterns

### Full-Text Search (Optional)
```sql
-- PostgreSQL full-text search for listings
CREATE INDEX idx_listings_search ON listings
  USING gin(to_tsvector('english', title || ' ' || description));
```

## Database Migrations

### Using Prisma Migrations

```bash
# Create migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy

# Generate client
npx prisma generate

# Reset database (dev only)
npx prisma migrate reset
```

## Seed Data

### Initial Data Requirements

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed categories
  await prisma.category.createMany({
    data: [
      { name: 'Services', slug: 'services', description: 'Offer or request services' },
      { name: 'Goods', slug: 'goods', description: 'Trade physical items' },
      { name: 'Requests', slug: 'requests', description: 'Request help or items' },
    ],
  })

  // Seed universities (examples)
  await prisma.university.createMany({
    data: [
      { name: 'University of Example', domain: 'example.edu', location: 'City, State' },
      // Add more universities
    ],
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

## Database Constraints

### Data Integrity
- **Foreign Keys:** Maintain referential integrity
- **Unique Constraints:** Prevent duplicates (email, conversation pairs)
- **Check Constraints:** Validate data format and values
- **Not Null:** Required fields

### Cascade Rules
- **ON DELETE CASCADE:** When user is deleted, delete their listings, messages, etc.
- **ON DELETE SET NULL:** When listing is deleted, set offered_listing_id to null in trades

## Query Patterns

### Common Queries

**Get listings with filters:**
```typescript
const listings = await prisma.listing.findMany({
  where: {
    status: 'active',
    categoryId: categoryId,
    user: {
      universityId: universityId
    }
  },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        avatarUrl: true
      }
    },
    category: true
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 20,
  skip: page * 20
})
```

**Get conversations with last message:**
```typescript
const conversations = await prisma.conversation.findMany({
  where: {
    OR: [
      { user1Id: userId },
      { user2Id: userId }
    ]
  },
  include: {
    user1: true,
    user2: true,
    messages: {
      orderBy: { createdAt: 'desc' },
      take: 1
    }
  }
})
```

## Backup & Maintenance

### Backup Strategy
- Daily automated backups
- Point-in-time recovery
- Test restoration regularly

### Maintenance Tasks
- Vacuum and analyze (PostgreSQL)
- Update statistics
- Monitor query performance
- Archive old data

## Security Considerations

### Database Security
- Use environment variables for connection strings
- Limit database user permissions
- Enable SSL connections
- Sanitize inputs (Prisma handles this)
- Implement row-level security (if needed)

## Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/tradepal?schema=public"
```

## Next Steps

1. **Choose Database:** Finalize PostgreSQL decision
2. **Set up Prisma:** Initialize Prisma in backend
3. **Create Schema:** Implement schema.prisma
4. **Run Migrations:** Create initial database structure
5. **Seed Data:** Add categories and test universities
6. **Test Queries:** Verify relationships and indexes

## Notes

- Database is NOT yet implemented
- This specification serves as a blueprint
- Prisma recommended for type safety and migrations
- PostgreSQL recommended for data integrity
- Consider adding audit logs table for tracking changes
- Consider adding notifications table for user alerts
