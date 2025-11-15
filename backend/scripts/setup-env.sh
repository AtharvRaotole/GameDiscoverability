#!/bin/bash
# Setup script to create .env file from .env.example

echo "🔧 Setting up backend environment..."

if [ -f .env ]; then
  echo "⚠️  .env file already exists. Skipping..."
else
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Created .env from .env.example"
    echo ""
    echo "📝 Please edit .env and add your API keys:"
    echo "   - DATABASE_URL"
    echo "   - OPENAI_API_KEY"
    echo "   - PINECONE_API_KEY"
    echo "   - TASTERAY_API_KEY (already set!)"
    echo ""
  else
    echo "❌ .env.example not found. Creating basic .env..."
    cat > .env << EOF
# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database (PostgreSQL with pgvector)
DATABASE_URL=postgresql://user:password@localhost:5432/gamesoul

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=sk-...

# Pinecone
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=game-emotions

# TasteRay API (Recommendation Engine)
TASTERAY_API_KEY=reco_live_afa7466d0b6f7fdf344563fe366add4e879d7921bb2a2f55

# Steam API (optional, for game data import)
STEAM_API_KEY=...

# JWT
JWT_SECRET=your-secret-key-min-32-chars-long
JWT_EXPIRES_IN=7d

# Monitoring (optional)
SENTRY_DSN=...
EOF
    echo "✅ Created basic .env file"
    echo ""
    echo "📝 Please edit .env and add your API keys!"
  fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env and add your API keys"
echo "  2. Run: npm run test-tasteray (to test TasteRay API)"
echo "  3. Run: npm run import-games <steam-app-id> (to import games)"
echo "  4. Run: npm run dev (to start the server)"

