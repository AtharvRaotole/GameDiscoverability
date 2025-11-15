# GameSoul - Emotion-Based Game Discovery Platform

A Next.js application for discovering games through emotional fingerprinting, not just genres or tags.

## 🚀 Phase 1: Core Infrastructure - COMPLETE

### What's Been Set Up

✅ **Next.js 16** with App Router and TypeScript (strict mode)
✅ **Tailwind CSS v4** with Claude-inspired minimalist design system
✅ **shadcn/ui** components initialized
✅ **Zustand** for state management
✅ **TanStack Query** for API calls
✅ **Framer Motion** for animations
✅ **React Hook Form + Zod** ready for forms
✅ **ESLint & Prettier** configured
✅ Complete folder structure as specified
✅ Base layout components (Header, Footer)
✅ EmotionInput component with real-time emotion extraction
✅ Home/Discover page
✅ All route placeholders created

### Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (main)/
│   │   │   ├── discover/
│   │   │   ├── explore/
│   │   │   ├── journeys/
│   │   │   └── library/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── discovery/
│   │   │   └── EmotionInput.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── shared/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   ├── providers.tsx
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── stores/
│   │   └── discovery-store.ts
│   ├── hooks/
│   └── styles/
└── public/
```

### Design System

- **Primary Color**: #2D2D2D (Deep Charcoal)
- **Secondary**: #F5F5F5 (Soft White)
- **Accent**: #6366F1 (Indigo)
- **Font**: Inter (400, 500, 600, 700 weights)
- **Mono Font**: JetBrains Mono
- **Spacing**: 4px base unit
- **Border Radius**: 6px (sm), 12px (md), 16px (lg), 24px (xl)

### Getting Started

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

### Next Steps (Phase 2+)

The following phases are outlined in the spec:

- **Phase 2**: Emotion Engine (OpenAI embeddings, emotion analysis)
- **Phase 3**: Discovery Interface (GameCard, results page, filters)
- **Phase 4**: Journeys Feature
- **Phase 5**: Library & User Features
- **Phase 6**: Polish & Optimization
- **Phase 7**: Testing & Deployment

### Key Features Implemented

1. **EmotionInput Component**
   - Real-time emotion tag extraction (debounced)
   - Character counter with color indicators
   - Auto-save drafts to localStorage
   - Placeholder text cycling
   - Smooth animations with Framer Motion

2. **Discovery Store (Zustand)**
   - Search query management
   - Results state
   - Filter state
   - Persistence for drafts

3. **Layout Components**
   - Sticky header with backdrop blur on scroll
   - Responsive navigation
   - Footer with links

### API Integration

The API client is set up in `src/lib/api.ts` with methods for:
- `discover()` - Main discovery endpoint
- `getGame()` - Game details
- `getSimilarGames()` - Similar games
- `extractEmotions()` - Real-time emotion extraction

**Note**: Backend API endpoints need to be implemented separately.

### Development Notes

- TypeScript strict mode enabled
- All components are client components where needed
- Proper error boundaries should be added
- Loading states need skeleton components
- Backend integration pending

### Dependencies

- next: 16.0.3
- react: 19.2.0
- typescript: 5.x
- tailwindcss: 4.x
- zustand: Latest
- @tanstack/react-query: Latest
- framer-motion: Latest
- react-hook-form: Latest
- zod: Latest

---

**Status**: Phase 1 Complete ✅
**Ready for**: Phase 2 - Emotion Engine Implementation
