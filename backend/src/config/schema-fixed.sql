-- GameSoul Database Schema (Fixed for 3072 dimensions)
-- PostgreSQL with pgvector extension

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id VARCHAR(50) PRIMARY KEY, -- Steam App ID
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  header_image TEXT,
  capsule_image TEXT,
  release_date DATE,
  price DECIMAL(10,2),
  steam_url TEXT,
  soul_score INTEGER CHECK (soul_score >= 0 AND soul_score <= 100),
  emotion_vector vector(3072), -- OpenAI embedding dimension
  emotion_profile JSONB, -- {joy: 0.8, melancholy: 0.6, ...}
  genres TEXT[],
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User libraries table
CREATE TABLE IF NOT EXISTS user_libraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id VARCHAR(50) REFERENCES games(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('playing', 'completed', 'wishlist')),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- Emotional searches table
CREATE TABLE IF NOT EXISTS emotional_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  emotion_vector vector(3072),
  extracted_emotions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Journeys table
CREATE TABLE IF NOT EXISTS journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  game_sequence JSONB, -- [{gameId, order, emotionState}]
  emotional_arc JSONB, -- [{emotion, intensity, position}]
  created_by UUID REFERENCES users(id),
  is_curated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_soul_score ON games(soul_score DESC);
-- Use HNSW for vectors > 2000 dimensions (3072 for OpenAI text-embedding-3-large)
-- HNSW is more efficient for high-dimensional vectors
CREATE INDEX IF NOT EXISTS idx_games_emotion_vector ON games USING hnsw (emotion_vector vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX IF NOT EXISTS idx_emotional_searches_user ON emotional_searches(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_libraries_user ON user_libraries(user_id, status);
CREATE INDEX IF NOT EXISTS idx_games_genres ON games USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_games_tags ON games USING GIN(tags);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

