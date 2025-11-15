#!/bin/bash

# GameSoul Backend Startup Script

echo "🚀 Starting GameSoul Backend Server..."
echo ""

cd "$(dirname "$0")/backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "   Please create a .env file in the backend directory."
    exit 1
fi

echo "✅ Starting server on http://localhost:3001"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev

