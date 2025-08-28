# Xtreme Reaction - AI Assistant Guide

**Last Updated**: December 28, 2024 (Session 4) - Phase 17 Complete! 
**GitHub**: https://github.com/ahays248/xtreme-reaction
**Live Site**: https://XtremeReaction.lol

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
- ✅ **Phases 1-16 COMPLETE** - Full game with leaderboards!
- ✅ **Phase 17 COMPLETE** - Share to X with visual scorecards!
- ✅ **Phase 18 COMPLETE** - Practice mode (implemented early)
- ✅ **60-Second Gameplay** - Time-based instead of round-limited
- ✅ **Score Saving** - All scores persist to database correctly
- ✅ **Leaderboards** - Daily (UTC) and All-Time rankings
- ✅ **Performance Card** - Shows time played, targets hit, detailed stats
- ✅ **Audio System** - Full music/SFX with mobile compatibility
- ✅ **Email Authentication** - Username + optional X handle
- ✅ **Share to X** - Beautiful scorecards with percentile rankings
- 🎮 Live at XtremeReaction.lol with automatic deployments
- **→ Next: Phase 19 - Charts & Analytics**

### What We're Building
**Xtreme Reaction** is a competitive reaction time game for the X community:
- **Email Authentication**: Sign up with username and optional X handle
- **60-Second Games Maximum**: Quick, addictive sessions
- **Matrix Cyberpunk Theme**: Green on black aesthetics
- **Viral Sharing**: Shareable scorecards to X
- **Progressive Difficulty**: Adapts to player performance

## 📚 ESSENTIAL DOCUMENTS - READ IN ORDER

1. **GAME_DESIGN_DOCUMENT.md** - What we're building and why
2. **IMPLEMENTATION_PLAN.md** - How we're building it (20 phases)
3. **DATABASE_SCHEMA.md** - Database structure and relationships
4. **PROJECT_STATUS.md** - Current development status
5. **MOBILE_GUIDELINES.md** - 📱 CRITICAL: Mobile-first development rules
6. **PHASE_10_CHANGES.md** - Major gameplay improvements made

## 🚀 HOW TO START DEVELOPMENT

### For New Sessions
1. **DO NOT** jump into coding immediately
2. Read the essential documents above
3. Check current phase in IMPLEMENTATION_PLAN.md
4. Implement ONLY that phase (100-200 lines max)
5. Test thoroughly before moving to next phase

### Latest Session Updates (December 28, 2024 - Session 4)
```bash
# ✅ PHASE 17 COMPLETE: SHARE TO X!

## What We Accomplished:
# - Beautiful 1200x630 scorecard with game stats
# - Desktop: Copy to clipboard works perfectly
# - Mobile: Simplified to "Share Stats to X" button only
# - Percentile ranking ("TOP X% TODAY") replaces letter grades
# - Domain updated to XtremeReaction.lol throughout
# - Modal preview with live scorecard display
# - Fixed text spacing issues (letter-spacing improved)
# - Removed hashtags from share text (not popular anymore)

## 🔒 Security Improvements:
# - Fixed keyboard exploit (Tab+Space for 0ms reaction)
# - Added 100ms minimum reaction time validation
# - Database constraint prevents impossible scores
# - Fixed profile data with invalid reaction times
# - Cleaned up leaderboard display issues

## 🔊 Audio Fixes:
# - Enable Sound button now shows properly after refresh
# - Fixed audio context state detection
# - Menu music plays correctly on both desktop and mobile
# - Button appears when audio context is suspended

## 📊 Leaderboard Clarifications:
# - Daily leaderboard resets at midnight UTC
# - All-time leaderboard uses best scores ever
# - Fixed 0ms display bug in profiles table
```

### Previous Session Updates (December 28, 2024 - Session 3)
```bash
# 📱 MOBILE EXPERIENCE PERFECTED!
# - Fixed audio on iOS when phone is on silent/vibrate
# - Auth modal now uses React Portal (no more z-index issues)
# - Leaderboard fully visible on mobile devices
# - X handles are clickable profile links

# 🎵 iOS AUDIO FIX!
# - Dual audio system: Web Audio API + HTML5 fallback
# - iOS devices use HTML5 Audio (plays as "media" content)
# - Works even when iPhone silent switch is on
# - Other devices use Web Audio for better performance

# 🔗 SOCIAL FEATURES!
# - X handles display as primary name if provided
# - Handles are clickable links to x.com/username
# - Username shown as secondary text below handle
```

### Previous Session Updates (December 28, 2024 - Session 2)
```bash
# 🐛 CRITICAL BUG FIXES!
# - Fixed scores not saving (streak bonus calculation)
# - Fixed game not ending at 60 seconds
# - Fixed difficulty stuck at 3% instead of 100%
# - Fixed post-game miss penalties ruining scores
# - Fixed rapid spawning bug after misses
# - Fixed negative consistency percentages

# 🎮 GAMEPLAY IMPROVEMENTS!
# - Red targets now end game but keep score (fair!)
# - Green targets disappear immediately on miss
# - Reduced red circle spawn rate (15-25% from 20-30%)
# - All numeric database fields properly rounded
```

### Previous Session Updates (December 28, 2024 - Session 1)
```bash
# 🎯 60-SECOND TIME LIMIT IMPLEMENTED!
# - No more 10-round limit restricting scores
# - Full 60 seconds to maximize your score
# - Difficulty scales progressively over time
# - Timer shows countdown

# 💾 SCORE SAVING FIXED!
# - Streak bonuses now calculate correctly
# - High scores (10,000+) save properly
# - All bonuses included in final score

# 🏆 LEADERBOARDS COMPLETE!
# - Daily and All-Time rankings
# - Auto-refresh every 30 seconds
# - Shows user rank even if not in top 20
# - Mobile-optimized responsive design

# 🎵 AUDIO NAVIGATION FIXED!
# - Music resumes when returning from leaderboard
# - Proper state management across pages
```

### Phase 11 Complete + Major Bug Fixes (August 24, 2025)!
```bash
# DONE: Sound Effects Implementation
# - Web Audio API for instant playback
# - Hit/miss/trap sounds + background music (menu/gameplay/results)
# - Separate volume controls for music and SFX
# - Mobile-safe audio with "Enable Sound" button
# - Mobile header bar with compact volume controls
# - Desktop volume controls in top-right corner

# CRITICAL BUG FIXES TODAY:
# 1. Title no longer shows during gameplay (was overlapping)
# 2. Sound requires explicit opt-in (no auto-enable)
# 3. Targets spawn within visual container bounds
# 4. Fixed double miss registration (race condition)
# 5. Desktop play area properly calculated for max-w-2xl

# Key Lessons Learned:
# 1. Mobile browsers require user interaction to play audio
# 2. Use processingMiss flags to prevent concurrent events
# 3. Don't wrap all handlers in useClickHandler
# 4. Desktop containers need special bounds calculations
# 5. Clear state immediately in timeout handlers
```

### Phase 12 Complete - Performance Card!
```bash
# DONE: Enhanced Performance Card
# - Visual progress bars for all metrics
# - Color-coded statistics (green, yellow, orange, purple)
# - Detailed performance breakdown
# - Grade system (S through F)
# - High score tracking with visual indicators
# - Consistency score showing reaction time variance
# - Future-proofed for endless mode (Level X display)

# Key Lessons from Phase 12:
# 1. Always use valid Tailwind classes (bg-green-500 not bg-neon-green)
# 2. Initialize animation widths as strings ("0%" not 0)
# 3. Keep text colors consistent for readability
# 4. Test each visual element thoroughly
# 5. Consider future features in current design
```

### Session 2 Accomplishments
- Fixed 10+ critical bugs affecting gameplay
- Score calculation now works correctly (50K+ possible)
- Game properly scales difficulty over 60 seconds
- No more game-breaking bugs after misses
- Database saves work reliably
- Consistency score uses proper statistics
- Red target penalty is now fair
- Game is fully playable and competitive!

### Phases 15-16 Complete - Database Integration!
```bash
# ✅ PHASE 15: Score Saving
# - All game sessions save to database
# - Streak bonuses calculated correctly
# - High scores (10,000+) save properly
# - Save status indicators (saving/saved/error)
# - Practice mode blocks saves appropriately

# ✅ PHASE 16: Leaderboards
# - Daily and All-Time rankings
# - Top 20 players displayed
# - User's rank shown even if not in top 20
# - Auto-refresh every 30 seconds
# - Mobile-responsive table design
# - Current user highlighted in green

# 🚀 Next Steps:
# 1. Phase 17: Share scores to X
# 2. Phase 19: Charts & Analytics
# 3. Phase 20: Final polish
```

## Tech Stack
- **Framework**: Next.js 15.5 with TypeScript and App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Email/Password
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

# Build for production (to check for errors)
npm run build

# Run type checking
npm run typecheck

# Push to GitHub for live testing
git add .
git commit -m "Phase X: Description"
git push

# The app will auto-deploy to Vercel
# Test live at: https://xtreme-reaction.vercel.app
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
6. **DO NOT** forget mobile-first design (see MOBILE_GUIDELINES.md)

### What TO Do
1. **DO** follow the IMPLEMENTATION_PLAN.md exactly
2. **DO** build and typecheck before committing
3. **DO** keep code simple and readable
4. **DO** commit and push to GitHub for live testing
5. **DO** update PROJECT_STATUS.md after completing phases
6. **DO** test on mobile viewport (375x667) FIRST

## 📱 MOBILE-FIRST DEVELOPMENT

### Quick Reference (ALWAYS USE)
```jsx
// Text sizing
className="text-base sm:text-lg md:text-xl"

// Spacing
className="p-2 sm:p-4 md:p-6"

// Buttons (min 44x44px touch target)
className="px-4 sm:px-6 py-2.5 sm:py-3 min-h-[44px]"

// Layout
className="min-h-screen" // NOT h-screen
className="pb-safe"       // For iOS safe areas
```

### Before EVERY Commit
- [ ] Test at 375x667 (iPhone SE)
- [ ] Buttons are tappable
- [ ] Text is readable
- [ ] Nothing cut off

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
- Email authentication for leaderboard participation
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
14. **Email Auth** - Email/password login ✅
15. **Save Scores** - Persist data ✅
16. **Leaderboards** - Show rankings ✅
17. **Share to X** - Social features
18. **Practice Mode** - Guest play
19. **Charts** - Data viz
20. **Final Polish** - Production ready

## Tips for AI Assistants
- **ALWAYS** check which phase we're on before coding
- **NEVER** implement features from future phases
- **BUILD** and typecheck before committing
- **PUSH** to GitHub for live testing via Vercel
- **UPDATE** PROJECT_STATUS.md after completing work
- **FOLLOW** the incremental approach strictly
- **SKIP** local dev server testing - use Vercel deployment

## Lessons Learned from Previous Attempt
1. **Complex timeout chains** → Use simple, linear logic
2. **Multiple competing systems** → One source of truth
3. **Trying to build everything at once** → Small phases only
4. **Poor state management** → Keep state minimal
5. **No clear plan** → Follow Implementation Plan strictly

---

**Remember**: We deleted everything and started fresh for a reason. Stick to the plan. Small iterations. Test everything. Keep it simple.