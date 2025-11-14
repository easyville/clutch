# Backend API Specification

**Status:** Not Implemented
**Last Updated:** 2025-11-14

## Technology Stack

- **Framework:** Express.js 5.1.0
- **Runtime:** Node.js
- **Language:** TypeScript
- **Validation:** To be decided (Zod, Joi, express-validator)
- **Authentication:** To be decided (JWT, Passport.js, NextAuth)

## Planned Directory Structure

```
backend/
├── src/
│   ├── controllers/       # Route handlers
│   ├── services/          # Business logic
│   ├── models/            # Database models
│   ├── middleware/        # Express middleware
│   ├── routes/            # API route definitions
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   ├── types/             # TypeScript type definitions
│   └── server.ts          # Entry point
├── tests/                 # Test files
├── package.json
└── tsconfig.json
```

## API Architecture

### Base URL
- **Development:** `http://localhost:3001/api`
- **Production:** TBD

### API Versioning
- Version prefix: `/api/v1`
- Current version: v1

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {...}
  }
}
```

## API Endpoints (Planned)

### Authentication

#### POST /api/v1/auth/register
Register a new user
```json
Request:
{
  "email": "student@university.edu",
  "password": "securePassword123",
  "name": "John Doe",
  "university": "University Name"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "token": "jwt_token"
  }
}
```

#### POST /api/v1/auth/login
Authenticate existing user
```json
Request:
{
  "email": "student@university.edu",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "token": "jwt_token"
  }
}
```

#### POST /api/v1/auth/logout
Logout current user (invalidate token)

#### GET /api/v1/auth/me
Get current authenticated user
```json
Response:
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "student@university.edu",
    "name": "John Doe",
    "university": "University Name",
    "createdAt": "2025-11-14T..."
  }
}
```

### Users

#### GET /api/v1/users/:id
Get user profile by ID

#### PUT /api/v1/users/:id
Update user profile (authenticated user only)
```json
Request:
{
  "name": "Updated Name",
  "bio": "Short bio",
  "contactPreferences": {...}
}
```

#### GET /api/v1/users/:id/listings
Get all listings by user

### Listings

#### GET /api/v1/listings
Get all listings with pagination and filters
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- category: string (services|goods|requests)
- search: string
- university: string
- sortBy: string (recent|popular)
```

#### GET /api/v1/listings/:id
Get single listing by ID
```json
Response:
{
  "success": true,
  "data": {
    "id": "listing_id",
    "title": "Math Tutoring",
    "description": "...",
    "category": "services",
    "images": ["url1", "url2"],
    "userId": "user_id",
    "user": {
      "id": "user_id",
      "name": "John Doe"
    },
    "createdAt": "2025-11-14T...",
    "updatedAt": "2025-11-14T..."
  }
}
```

#### POST /api/v1/listings
Create new listing (authenticated)
```json
Request:
{
  "title": "Math Tutoring",
  "description": "Offering math tutoring in exchange for...",
  "category": "services",
  "images": ["base64_or_urls"],
  "location": "Campus Library"
}
```

#### PUT /api/v1/listings/:id
Update listing (owner only)

#### DELETE /api/v1/listings/:id
Delete listing (owner only)

### Messages

#### GET /api/v1/messages/conversations
Get all conversations for authenticated user
```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "conversation_id",
      "participants": [{...}, {...}],
      "lastMessage": {
        "content": "...",
        "createdAt": "2025-11-14T..."
      },
      "unreadCount": 3
    }
  ]
}
```

#### GET /api/v1/messages/conversations/:id
Get messages in a conversation
```
Query Parameters:
- page: number
- limit: number (default: 50)
```

#### POST /api/v1/messages
Send a new message
```json
Request:
{
  "recipientId": "user_id",
  "content": "Hi, interested in your listing!",
  "listingId": "listing_id" // optional
}
```

### Trades

#### POST /api/v1/trades
Propose a trade
```json
Request:
{
  "listingId": "listing_id",
  "offeredListingId": "my_listing_id", // optional
  "message": "I can offer..."
}
```

#### PUT /api/v1/trades/:id/accept
Accept a trade proposal

#### PUT /api/v1/trades/:id/reject
Reject a trade proposal

#### PUT /api/v1/trades/:id/complete
Mark trade as completed

## Middleware (Planned)

### Authentication Middleware
- `authRequired` - Verify JWT token and attach user to request
- `optionalAuth` - Attach user if token present, continue if not

### Validation Middleware
- `validateBody(schema)` - Validate request body against schema
- `validateParams(schema)` - Validate URL parameters
- `validateQuery(schema)` - Validate query parameters

### Error Handling Middleware
- `errorHandler` - Global error handler
- `notFoundHandler` - 404 handler

### Rate Limiting
- `rateLimiter` - Prevent API abuse

## Services Layer (Planned)

### AuthService
- `register(userData)`
- `login(email, password)`
- `verifyToken(token)`
- `hashPassword(password)`

### UserService
- `getUserById(id)`
- `updateUser(id, updates)`
- `deleteUser(id)`

### ListingService
- `getAllListings(filters, pagination)`
- `getListingById(id)`
- `createListing(userId, listingData)`
- `updateListing(id, updates)`
- `deleteListing(id)`

### MessageService
- `getConversations(userId)`
- `getMessages(conversationId, pagination)`
- `sendMessage(senderId, recipientId, content)`
- `markAsRead(messageId)`

### TradeService
- `proposeTrade(data)`
- `acceptTrade(tradeId)`
- `rejectTrade(tradeId)`
- `completeTrade(tradeId)`

## Security Considerations

### Authentication
- Use JWT tokens with expiration
- Implement refresh token mechanism
- Hash passwords with bcrypt (min 10 rounds)
- Require strong passwords

### Authorization
- Users can only modify their own resources
- Implement role-based access control (user, admin)
- Validate user ownership before operations

### Input Validation
- Sanitize all user inputs
- Validate data types and formats
- Prevent SQL injection (use parameterized queries)
- Prevent XSS attacks

### Rate Limiting
- Limit API requests per IP/user
- Stricter limits on auth endpoints
- Implement exponential backoff

### CORS
- Configure allowed origins
- Development: `http://localhost:3000`
- Production: TBD

## Error Codes

```
AUTH_001: Invalid credentials
AUTH_002: Token expired
AUTH_003: Unauthorized access
AUTH_004: Email already exists

USER_001: User not found
USER_002: Invalid user data

LISTING_001: Listing not found
LISTING_002: Invalid listing data
LISTING_003: Not listing owner

MESSAGE_001: Conversation not found
MESSAGE_002: Invalid recipient

TRADE_001: Trade not found
TRADE_002: Cannot trade with yourself
TRADE_003: Invalid trade status

SERVER_001: Internal server error
SERVER_002: Database error
```

## Environment Variables

```
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

## Notes

- Backend is NOT yet implemented
- This specification serves as a blueprint for development
- API design follows REST principles
- Consider GraphQL or tRPC as alternatives
- Real-time features may require WebSocket implementation
