# GameSoul API Documentation

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://your-backend.railway.app`

## Authentication

Currently, API uses user ID in request body/params. Future versions will use JWT tokens.

## Endpoints

### Health Check

#### GET `/health`

Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "redis": "connected"
}
```

---

### Discovery

#### POST `/api/discover`

Discover games based on emotional query.

**Request Body:**
```json
{
  "query": "I want to feel the way Outer Wilds made me feel...",
  "limit": 20,
  "offset": 0,
  "filters": {
    "minSoulScore": 60,
    "genres": ["adventure", "indie"],
    "priceRange": {
      "min": 0,
      "max": 30
    }
  }
}
```

**Response:**
```json
{
  "emotionVector": {
    "embedding": [0.123, ...],
    "emotions": {
      "joy": 0.3,
      "melancholy": 0.7,
      "tension": 0.2,
      "wonder": 0.5,
      "nostalgia": 0.6,
      "catharsis": 0.4,
      "comfort": 0.3,
      "challenge": 0.2
    }
  },
  "results": [
    {
      "game": {
        "id": "753640",
        "name": "Outer Wilds",
        "soulScore": 95,
        ...
      },
      "matchScore": 87,
      "soulScore": 95,
      "emotionAlignment": 85
    }
  ],
  "total": 24,
  "hasMore": true
}
```

#### POST `/api/emotions/extract`

Extract emotional keywords from text (real-time).

**Request Body:**
```json
{
  "text": "Looking for something melancholic but hopeful..."
}
```

**Response:**
```json
[
  {
    "word": "melancholic",
    "intensity": 0.8,
    "category": "melancholy"
  },
  {
    "word": "hopeful",
    "intensity": 0.6,
    "category": "joy"
  }
]
```

---

### Journeys

#### GET `/api/journeys/curated`

Get all curated journeys.

**Response:**
```json
{
  "journeys": [
    {
      "id": "uuid",
      "title": "From Darkness to Light",
      "description": "A transformative journey...",
      "games": [...],
      "totalHours": 18,
      "isCurated": true
    }
  ]
}
```

#### GET `/api/journeys/:id`

Get journey by ID.

**Response:**
```json
{
  "journey": {
    "id": "uuid",
    "title": "...",
    "games": [...],
    "emotionalArc": {...}
  }
}
```

#### POST `/api/journeys`

Create a new journey.

**Request Body:**
```json
{
  "title": "My Journey",
  "description": "A personal journey",
  "gameIds": ["753640", "480"],
  "userId": "user-123"
}
```

#### POST `/api/journeys/:id/fork`

Fork a journey.

**Request Body:**
```json
{
  "userId": "user-123",
  "modifications": {
    "title": "My Forked Journey",
    "gameIds": ["753640", "480", "304430"]
  }
}
```

---

### Library

#### GET `/api/library/:userId`

Get user library.

**Query Parameters:**
- `status` (optional): `playing` | `completed` | `wishlist`

**Response:**
```json
{
  "library": [
    {
      "id": "uuid",
      "gameId": "753640",
      "status": "completed",
      "game": {...}
    }
  ]
}
```

#### POST `/api/library`

Add game to library.

**Request Body:**
```json
{
  "userId": "user-123",
  "gameId": "753640",
  "status": "wishlist"
}
```

#### PATCH `/api/library/:userId/:gameId`

Update library entry status.

**Request Body:**
```json
{
  "status": "completed"
}
```

#### DELETE `/api/library/:userId/:gameId`

Remove game from library.

#### GET `/api/library/:userId/stats`

Get library statistics.

**Response:**
```json
{
  "stats": {
    "total": 25,
    "playing": 3,
    "completed": 15,
    "wishlist": 7
  }
}
```

#### GET `/api/library/:userId/timeline`

Get emotional timeline from completed games.

**Response:**
```json
{
  "timeline": [
    {
      "gameId": "753640",
      "gameName": "Outer Wilds",
      "completedAt": "2024-01-01T00:00:00.000Z",
      "emotionProfile": {...}
    }
  ]
}
```

---

### Search History

#### GET `/api/search-history/:userId`

Get user search history.

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)

#### POST `/api/search-history`

Save search to history.

**Request Body:**
```json
{
  "userId": "user-123",
  "queryText": "I want to feel...",
  "emotionVector": [0.123, ...],
  "extractedEmotions": {...}
}
```

#### DELETE `/api/search-history/:userId/:searchId`

Delete search from history.

#### DELETE `/api/search-history/:userId`

Clear all search history.

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "message": "Detailed message (development only)",
  "details": [] // Validation errors if applicable
}
```

**Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting. Future versions will implement rate limiting per user/IP.

## CORS

CORS is configured to allow requests from the frontend domain only.

---

For more details, see the source code in `backend/src/controllers/`.

