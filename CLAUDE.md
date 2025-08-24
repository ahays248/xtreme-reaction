# Xtreme Reaction - AI Assistant Guide

**Last Updated**: August 24, 2025 - Phases 1-8 Complete!
**GitHub**: https://github.com/ahays248/xtreme-reaction

## 🎯 CRITICAL: DEVELOPMENT PHILOSOPHY - READ THIS FIRST!

### We Are Building Incrementally
After experiencing complexity spiral with the previous implementation, we've adopted a **STRICT** incremental approach:

1. **Small Phases Only**: Each phase is 100-200 lines of code MAXIMUM
2. **Test Before Progress**: Every phase must work PERFECTLY before moving on
3. **No Premature Features**: Follow IMPLEMENTATION_PLAN.md EXACTLY
4. **One Source of Truth**: Simple, linear logic only
5. **Document First**: Read the Game Design Document before coding

### Why This Approach?
- Previous attempt had complex timeout chains, duplicate processing, competing systems
- User said: "I'm about ready to say delete everything and restart"
- We deleted ALL old code and started fresh with proper planning
- This approach ensures we never get stuck in complexity again

## 📍 CURRENT STATUS

### Where We Are Now
- ✅ **GAME_DESIGN_DOCUMENT.md** - Complete game specification 
- ✅ **IMPLEMENTATION_PLAN.md** - 20 phases of incremental development
- ✅ **DATABASE_SCHEMA.md** - Full database documentation
- ✅ **Phases 1-8 COMPLETE** - Fully playable game with scoring
- ✅ Database migration 004 ready (for Phase 13)
- 🎮 Live on Vercel with automatic deployments
- **→ Ready for Phase 9: Accuracy Tracking (mostly implemented)**

### What We're Building
**Xtreme Reaction** is an X-exclusive competitive reaction time game:
- **X Authentication Required**: No anonymous play for leaderboards
- **60-Second Games Maximum**: Quick, addictive sessions
- **Matrix Cyberpunk Theme**: Green on black aesthetics
- **Viral Sharing**: Shareable scorecards to X
- **Progressive Difficulty**: Adapts to player performance

## 📚 ESSENTIAL DOCUMENTS - READ IN ORDER

1. **GAME_DESIGN_DOCUMENT.md** - What we're building and why
2. **IMPLEMENTATION_PLAN.md** - How we're building it (20 phases)
3. **DATABASE_SCHEMA.md** - Database structure and relationships
4. **PROJECT_STATUS.md** - Current development status

## 🚀 HOW TO START DEVELOPMENT

### For New Sessions
1. **DO NOT** jump into coding immediately
2. Read the essential documents above
3. Check current phase in IMPLEMENTATION_PLAN.md
4. Implement ONLY that phase (100-200 lines max)
5. Test thoroughly before moving to next phase

### Phase 9 Quick Start
```bash
# Current task: Accuracy Tracking
# Note: Mostly already implemented in Phase 8!
# What to verify/polish:
# - Accuracy calculation already works
# - Displayed during game and on game over
# - May just need to add more detailed tracking
# - Consider adding miss penalty visualization
```

## Tech Stack
- **Framework**: Next.js 15.5 with TypeScript and App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with X (Twitter) OAuth
- **Charts**: Recharts (Phase 19)
- **Deployment**: Vercel (Phase 20)

## Project Structure
```
XtremeReaction/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   └── Target.tsx        # Green/red target with variants
├── lib/                   # Core logic and utilities
│   ├── difficulty.ts     # Progressive difficulty
│   ├── gameState.ts      # Game state types
│   ├── scoring.ts        # Score calculations
│   ├── timing.ts         # Reaction time utils
│   └── supabase/         # Database client and types
├── hooks/                 # Custom React hooks
│   ├── useClickHandler.ts # Touch/click handling
│   └── useGameLoop.ts    # Game state management
├── public/                # Static assets
│   └── music/           # Background music
└── supabase/             # Database migrations
    └── migrations/       # SQL migration files
```

## Development Commands
```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## Database Configuration
- **Project ID**: xhcfjhzfyozzuicubqmh
- **URL**: https://xhcfjhzfyozzuicubqmh.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/xhcfjhzfyozzuicubqmh
- Credentials are in `.env.local`

### Apply Latest Migration
```bash
# Login to Supabase CLI
~/.local/bin/supabase login --token sbp_eab39990962adb1bcbb57ba84def39d2189831e2

# Apply migration 004
~/.local/bin/supabase db push --project-ref xhcfjhzfyozzuicubqmh
```

## ⚠️ CRITICAL REMINDERS

### What NOT to Do
1. **DO NOT** add features not in the current phase
2. **DO NOT** optimize prematurely
3. **DO NOT** create complex state management
4. **DO NOT** skip testing between phases
5. **DO NOT** write more than 200 lines per phase

### What TO Do
1. **DO** follow the IMPLEMENTATION_PLAN.md exactly
2. **DO** test on mobile and desktop after each phase
3. **DO** keep code simple and readable
4. **DO** commit after each successful phase
5. **DO** update PROJECT_STATUS.md after completing phases

## Game Mechanics (From Design Doc)
1. One target appears at a time
2. Green targets: Tap quickly for points
3. Red targets: Don't tap (they're traps!)
4. Progressive difficulty increases speed
5. 60-second maximum game duration
6. Score based on speed and accuracy

## Performance Targets
- < 1 second load time
- 60 FPS animations
- < 250ms average reaction for "A" grade
- Support 1000+ concurrent users

## Security Considerations
- Row Level Security (RLS) on all tables
- Users can only modify their own data
- X OAuth required for leaderboard participation
- No client-side score calculation in production

## Implementation Phases Overview
1. **Static Target** - Show/hide circle
2. **Click Detection** - Register taps
3. **Basic Timing** - Measure reaction
4. **Auto-Hide** - Timeout targets
5. **Game Loop** - Continuous spawning
6. **Difficulty** - Progressive challenge
7. **Trap Targets** - Add red circles
8. **Scoring** - Calculate points
9. **Accuracy** - Track hit rate
10. **UI Polish** - Cyberpunk theme
11. **Sound** - Audio feedback
12. **Performance Card** - Show results
13. **Database Setup** - Connect Supabase
14. **X Auth** - OAuth login
15. **Save Scores** - Persist data
16. **Leaderboards** - Show rankings
17. **Share to X** - Social features
18. **Practice Mode** - Guest play
19. **Charts** - Data viz
20. **Final Polish** - Production ready

## Tips for AI Assistants
- **ALWAYS** check which phase we're on before coding
- **NEVER** implement features from future phases
- **ALWAYS** test mobile touch events
- **KEEP** state management minimal
- **UPDATE** PROJECT_STATUS.md after completing work
- **FOLLOW** the incremental approach strictly

## Lessons Learned from Previous Attempt
1. **Complex timeout chains** → Use simple, linear logic
2. **Multiple competing systems** → One source of truth
3. **Trying to build everything at once** → Small phases only
4. **Poor state management** → Keep state minimal
5. **No clear plan** → Follow Implementation Plan strictly

---

**Remember**: We deleted everything and started fresh for a reason. Stick to the plan. Small iterations. Test everything. Keep it simple.