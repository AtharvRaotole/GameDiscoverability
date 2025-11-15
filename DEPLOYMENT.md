# GameSoul Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying GameSoul to production using Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

- GitHub repository set up
- Vercel account
- Railway account
- Supabase account (for PostgreSQL)
- Pinecone account
- OpenAI API key
- All environment variables ready

## 🎯 Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as the root directory

### Step 2: Configure Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

### Step 3: Environment Variables

Add these in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Step 4: Deploy

Click "Deploy" and wait for build to complete.

## 🔧 Backend Deployment (Railway)

### Step 1: Create New Project

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### Step 2: Configure Service

1. Select the `backend` folder
2. Railway will auto-detect Node.js
3. Set root directory to `backend`

### Step 3: Add PostgreSQL Database

1. Click "New" → "Database" → "PostgreSQL"
2. Railway will provision a PostgreSQL instance
3. Copy the connection string

### Step 4: Add Redis (Optional)

1. Click "New" → "Database" → "Redis"
2. Copy the connection string

### Step 5: Environment Variables

Add these in Railway dashboard:

```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app

DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}

OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=game-emotions

TASTERAY_API_KEY=...
TASTERAY_API_URL=https://api.tasteray.com

JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

SENTRY_DSN=your-sentry-dsn
```

### Step 6: Deploy

Railway will automatically deploy on push to main branch.

## 🗄️ Database Setup

### 1. Run Schema

Connect to your Railway PostgreSQL database:

```bash
psql $DATABASE_URL -f backend/src/config/schema.sql
```

### 2. Seed Journeys (Optional)

```bash
psql $DATABASE_URL -f backend/src/config/seed-journeys.sql
```

## 🔍 Monitoring Setup

### Sentry

1. Create account at [sentry.io](https://sentry.io)
2. Create new project (Node.js for backend, Next.js for frontend)
3. Copy DSN to environment variables
4. Errors will automatically be tracked

### PostHog (Optional)

1. Create account at [posthog.com](https://posthog.com)
2. Get API key
3. Add to frontend environment variables

## ✅ Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend API responding
- [ ] Database connected
- [ ] Pinecone index created
- [ ] Environment variables set
- [ ] Health check endpoint working
- [ ] Error tracking configured
- [ ] Analytics working
- [ ] SSL certificates active
- [ ] CORS configured correctly

## 🔄 CI/CD

GitHub Actions workflow is configured in `.github/workflows/ci.yml`:

- Runs on push to main/develop
- Tests frontend and backend
- Type checks
- Linting
- Build verification

## 📊 Health Checks

### Frontend
- URL: `https://your-app.vercel.app`
- Should show homepage

### Backend
- URL: `https://your-backend.railway.app/health`
- Should return: `{"status":"ok","database":"connected"}`

## 🐛 Troubleshooting

### Frontend Issues

**Build fails:**
- Check Node.js version (should be 20+)
- Verify all dependencies installed
- Check for TypeScript errors

**API calls fail:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend

### Backend Issues

**Database connection fails:**
- Verify `DATABASE_URL` is correct
- Check if database is accessible
- Ensure pgvector extension is installed

**Pinecone errors:**
- Verify API key is correct
- Check index name matches
- Ensure index exists in Pinecone dashboard

## 🔐 Security Checklist

- [ ] All API keys in environment variables (not in code)
- [ ] CORS configured to only allow frontend domain
- [ ] JWT secret is strong (32+ characters)
- [ ] Database credentials secured
- [ ] Rate limiting configured (if needed)
- [ ] HTTPS enabled
- [ ] Security headers set

## 📈 Performance Optimization

### Frontend
- Images optimized with Next.js Image
- Code splitting enabled
- Bundle size optimized
- CDN caching configured

### Backend
- Database connection pooling
- Redis caching enabled
- API response caching
- Query optimization

## 🔄 Updates & Maintenance

### Deploy Updates

1. Push changes to GitHub
2. Vercel auto-deploys frontend
3. Railway auto-deploys backend
4. Monitor deployment logs

### Database Migrations

For schema changes:
1. Update `schema.sql`
2. Run migration script
3. Test in staging first

## 📞 Support

For issues:
1. Check deployment logs
2. Review error tracking (Sentry)
3. Check health endpoints
4. Review GitHub Actions logs

---

**Status**: Ready for deployment ✅

