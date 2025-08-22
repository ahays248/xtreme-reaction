# Xtreme Reaction - AI Assistant Guide

**Last Updated**: August 22, 2025 - Core Game Complete (75%)
**GitHub**: https://github.com/ahays248/xtreme-reaction

## Project Overview
You're working on **Xtreme Reaction**, a competitive reaction time game designed for viral sharing on X (Twitter). This is a mobile-friendly web app where users tap in response to visual cues while avoiding fake cues and distractions.

**IMPORTANT**: The core game is FULLY FUNCTIONAL and playable at http://localhost:3001 (port 3001, not 3000)

## Important Documents
- **SESSION_HANDOFF.md** - START HERE! Detailed handoff for new sessions
- **PROGRESS.md** - Contains detailed progress tracking, completed features, and TODO list
- **README.md** - User-facing documentation (✅ CREATED)
- **supabase/migrations/001_initial_schema.sql** - Database schema

## Tech Stack
- **Framework**: Next.js 15.5 with TypeScript and App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with X (Twitter) OAuth
- **Animations**: Framer Motion
- **State**: React hooks and Zustand
- **Deployment**: Vercel (planned)

## Project Structure
```
XtremeReaction/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   └── game/              # Game-specific components
├── lib/                   # Core logic and utilities
│   ├── supabase/         # Database client and types
│   └── game/             # Game engine and logic
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── supabase/             # Database migrations
```

## Current Status (75% Complete)
- ✅ Core game mechanics fully functional
- ✅ Database schema created
- ✅ Visual effects and animations working
- ✅ All major bugs fixed (see PROGRESS.md)
- ✅ Mobile controls optimized
- ✅ Git repository initialized and pushed to GitHub
- ⏳ Authentication needs X OAuth setup
- ⏳ Database integration pending (PRIORITY 1)
- ⏳ Leaderboards need implementation
- ⏳ X sharing functionality needs completion

## Development Commands
```bash
# Install dependencies
npm install

# Run development server (runs on port 3001)
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## Key Features
1. **Reaction Testing**: 10-round games with millisecond precision
2. **Fake Cues**: Red circles that players must avoid tapping
3. **Progressive Difficulty**: Game gets harder with each success
4. **Punishment System**: Visual effects that intensify with errors
5. **Scoring**: Based on speed, accuracy, and difficulty
6. **Leaderboards**: Daily and all-time rankings
7. **X Integration**: Share scores with custom images

## Database Configuration
- **URL**: https://oksfkrbxypmoqvjttavc.supabase.co (UPDATED)
- **Project**: Xtreme Reaction
- Credentials are in `.env.local`
- Schema is complete, just needs connection to game

## Game Logic Overview
1. Player sees "Wait for the cue..."
2. After random delay (1-5s), a circle appears
3. **Green circle**: Tap quickly for points
4. **Red circle**: Don't tap (it's a trap!)
5. Errors trigger punishment effects
6. Game tracks reaction times and accuracy
7. Final score based on performance

## Common Tasks

### Adding New Features
1. Check PROGRESS.md for current TODO items
2. Update relevant CLAUDE.md files when adding new components
3. Test on mobile devices (touch events are critical)

### Working with Supabase
```bash
# Login to Supabase CLI
~/.local/bin/supabase login --token sbp_eab39990962adb1bcbb57ba84def39d2189831e2

# Run migrations
~/.local/bin/supabase db push --project-ref xhcfjhzfyozzuicubqmh
```

### Testing the Game
1. Open http://localhost:3001
2. Click "Start Game"
3. Tap green circles quickly
4. Avoid red circles
5. Check console for debug info

## Known Issues
- ✅ FIXED: Red circles now disappear automatically after timeout
- ✅ FIXED: Click detection only works on circles (not anywhere)
- ✅ FIXED: Game properly ends after round 10
- ✅ FIXED: Fair grading system implemented
- Database connection not yet implemented (PRIORITY 1)
- X OAuth needs configuration in Supabase dashboard

## Design Decisions
- **Mobile-first**: Touch events prioritized over click
- **Dark theme**: Better for focus and reduces eye strain
- **Instant feedback**: All actions have immediate visual response
- **Progressive punishment**: Errors compound to increase difficulty
- **Grade system**: S/A/B/C/D grades for motivation

## Performance Targets
- < 1 second load time
- 60 FPS animations
- < 250ms average reaction time for "A" grade
- Support 1000+ concurrent users

## Security Considerations
- Row Level Security (RLS) enabled on all tables
- User can only modify their own data
- Cheat detection planned for post-MVP
- No client-side score calculation for final version

## Next Priority Tasks
1. **URGENT**: Connect game results to database (save scores)
2. **HIGH**: Implement user authentication (X OAuth)
3. **MEDIUM**: Build leaderboard page
4. **MEDIUM**: Add X sharing with screenshots
5. **LOW**: Deploy to Vercel

## Critical Notes for Next Session
- DO NOT refactor the game logic in `/hooks/useGame.ts` - it works perfectly
- The game runs on PORT 3001, not 3000
- Test the game first at http://localhost:3001 to understand current state
- Read SESSION_HANDOFF.md for complete status
- Database schema is complete, just needs connection

## Contact & Resources
- Supabase Dashboard: https://supabase.com/dashboard/project/xhcfjhzfyozzuicubqmh
- X Developer Portal: https://developer.x.com
- Vercel Dashboard: https://vercel.com

## Tips for AI Assistants
- Always check PROGRESS.md before starting work
- The game must work on mobile (test touch events)
- Keep punishment effects smooth (performance matters)
- Fake cues should be obviously different but still confusing
- Update this file when adding major features