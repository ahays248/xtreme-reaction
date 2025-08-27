# Xtreme Reaction - Implementation Plan
**Version**: 1.0  
**Date**: August 23, 2025  
**Approach**: Incremental, test-driven development with small iterations

---

## CORE PRINCIPLES
1. **Small Iterations**: Each phase is 100-200 lines of code maximum
2. **Test Before Progress**: Every phase must work perfectly before moving on
3. **No Premature Optimization**: Make it work, then make it better
4. **Clear Separation**: One feature per phase, no mixing concerns
5. **Documentation**: Comment intentions, not implementation

---

## PHASE 1: Static Target Display ✅ COMPLETE
**Goal**: Show and hide a circle on screen  
**Time Estimate**: 2 hours  
**Actual Time**: 30 minutes  
**Files Created**: 2 files (43 lines total)

### Tasks
- [x] Create basic Next.js page
- [x] Add a green circle div
- [x] Add show/hide button
- [x] Style with basic CSS

### Success Criteria
- Circle appears and disappears on command
- Renders correctly on mobile and desktop
- No console errors

### Code Structure
```
app/
  page.tsx         (main game page)
components/
  Target.tsx       (simple circle component)
```

---

## PHASE 2: Click Detection ✅ COMPLETE
**Goal**: Detect when target is clicked  
**Time Estimate**: 2 hours  
**Actual Time**: 20 minutes  
**Dependencies**: Phase 1 complete
**Files Created**: 1 new hook, 2 files updated (80 lines total)

### Tasks
- [x] Add onClick handler to target
- [x] Log click events to console
- [x] Show click count on screen
- [x] Handle both mouse and touch events (unified with onPointerDown)

### Success Criteria
- Every click is registered exactly once
- Works on mobile (touch) and desktop (click)
- No double-firing events

### New Files
```
hooks/
  useClickHandler.ts  (unified click/touch handling)
```

---

## PHASE 3: Basic Timing ✅ COMPLETE
**Goal**: Measure reaction time  
**Time Estimate**: 3 hours  
**Actual Time**: 15 minutes  
**Dependencies**: Phase 2 complete
**Files Created**: 1 new lib file, page updated (138 lines total)

### Tasks
- [x] Record timestamp when target appears
- [x] Calculate time difference on click
- [x] Display reaction time
- [x] Store last 5 reaction times

### Success Criteria
- Accurate millisecond timing
- Displays reaction time after each click
- Shows average of last 5 attempts

### New Files
```
lib/
  timing.ts  (reaction time calculations)
```

---

## PHASE 4: Auto-Hide Targets ✅ COMPLETE
**Goal**: Targets disappear after timeout  
**Time Estimate**: 3 hours  
**Actual Time**: 10 minutes  
**Dependencies**: Phase 3 complete
**Files Updated**: page.tsx only (159 lines total)

### Tasks
- [x] Add timeout when target appears
- [x] Target disappears after 2 seconds
- [x] Show "missed" message if timeout occurs
- [x] Clear timeout if clicked

### Success Criteria
- Target disappears exactly after timeout
- No lingering timeouts
- Proper cleanup on click

### Updates
```
components/
  Target.tsx  (add timeout logic)
```

---

## PHASE 5: Game Loop ✅ COMPLETE
**Goal**: Continuous target spawning  
**Time Estimate**: 4 hours  
**Actual Time**: 15 minutes  
**Dependencies**: Phase 4 complete
**Files Created**: 2 new files, page.tsx updated (279 lines total)

### Tasks
- [x] Auto-spawn new target after click/timeout
- [x] Add "Start Game" button
- [x] Add "Game Over" after 10 targets
- [x] Show final statistics

### Success Criteria
- Smooth transition between targets
- Game ends after set number
- No memory leaks or stuck states

### New Files
```
hooks/
  useGameLoop.ts  (manages game state)
lib/
  gameState.ts    (state definitions)
```

---

## PHASE 6: Progressive Difficulty ✅ COMPLETE
**Goal**: Game gets harder over time  
**Time Estimate**: 4 hours  
**Actual Time**: 30 minutes  
**Dependencies**: Phase 5 complete

### Tasks
- [x] Decrease timeout duration per round
- [x] Decrease target size per round
- [x] Add round counter display
- [x] Implement difficulty curve

### Success Criteria
- Noticeable difficulty increase
- Still playable at maximum difficulty
- Smooth progression curve

### Updates
```
lib/
  difficulty.ts  (progression calculations)
```

---

## PHASE 7: Trap Targets ✅ COMPLETE
**Goal**: Add red targets that end game  
**Time Estimate**: 4 hours  
**Actual Time**: 25 minutes  
**Dependencies**: Phase 6 complete

### Tasks
- [x] Create red target variant
- [x] Random chance of red target
- [x] End game if red target clicked
- [x] Show different message for trap hit

### Success Criteria
- Clear visual distinction (red vs green)
- Appropriate spawn frequency (20-30%)
- Immediate game over on trap click

### Updates
```
components/
  Target.tsx     (add variant prop)
  TrapTarget.tsx (red target component)
```

---

## PHASE 8: Scoring System ✅ COMPLETE
**Goal**: Calculate and display scores  
**Time Estimate**: 3 hours  
**Actual Time**: 30 minutes  
**Dependencies**: Phase 7 complete

### Tasks
- [x] Implement score formula
- [x] Add score display during game
- [x] Show final score calculation
- [x] Add high score tracking (local storage)

### Success Criteria
- Score updates in real-time
- Formula matches design document
- High score persists between sessions

### New Files
```
lib/
  scoring.ts  (score calculations)
hooks/
  useScore.ts (score state management)
```

---

## PHASE 9: Accuracy Tracking ✅ COMPLETE
**Goal**: Track hit/miss accuracy  
**Time Estimate**: 3 hours  
**Actual Time**: 25 minutes  
**Dependencies**: Phase 8 complete

### Tasks
- [x] Track total clicks
- [x] Track successful hits
- [x] Calculate accuracy percentage
- [x] Display accuracy in UI
- [x] Add streak tracking and bonuses
- [x] Add visual feedback for misses

### Success Criteria
- Accurate percentage calculation
- Updates in real-time
- Affects final score appropriately

### Updates
```
lib/
  statistics.ts  (accuracy calculations)
```

---

## PHASE 10: UI Polish ⚠️ PARTIALLY COMPLETE
**Goal**: Implement cyberpunk theme  
**Time Estimate**: 4 hours  
**Actual Time**: 3 hours (so far)
**Dependencies**: Phase 9 complete

### Tasks
- [x] Add Matrix-style background (MatrixRain component)
- [x] Style targets with glow effects (Framer Motion)
- [x] Add cyberpunk fonts (Orbitron, Rajdhani, Share Tech Mono)
- [x] Implement color scheme (neon green/red/cyan)
- [x] **ADDED**: Random target positions within play area
- [x] **ADDED**: Proper miss detection for accuracy
- [x] **ADDED**: Simplified gameplay UI

### Success Criteria
- Consistent theme throughout ✅
- Good contrast and readability ✅
- Smooth animations ✅
- **NEW**: Targets spawn randomly ✅
- **NEW**: Accuracy properly tracked ✅

### Files Created/Modified
```
components/
  MatrixRain.tsx     (background effect) ✅
  Target.tsx         (updated with Framer Motion) ✅
lib/
  targetPosition.ts  (random position generation) ✅
app/
  globals.css        (cyberpunk theme styles) ✅
  layout.tsx         (cyberpunk fonts) ✅
  page.tsx           (simplified UI, miss detection) ✅
```

---

## PHASE 11: Sound Effects
**Goal**: Add audio feedback  
**Time Estimate**: 3 hours  
**Dependencies**: Phase 10 complete

### Tasks
- [ ] Add hit sound effect
- [ ] Add miss sound effect
- [ ] Add game over sound
- [ ] Add volume control

### Success Criteria
- Sounds play instantly
- No audio lag
- Volume control works

### New Files
```
lib/
  audio.ts      (sound management)
hooks/
  useSound.ts   (audio state)
```

---

## PHASE 12: Performance Card ✅ COMPLETE
**Goal**: Post-game statistics display  
**Time Estimate**: 4 hours  
**Actual Time**: 3 hours
**Dependencies**: Phase 11 complete

### Tasks
- [x] Create performance card component
- [x] Display all game statistics
- [x] Add "Play Again" button
- [x] Show personal best indicator
- [x] **ADDED**: Visual progress bars for metrics
- [x] **ADDED**: Color-coded statistics
- [x] **ADDED**: Grade system (S-F)
- [x] **ADDED**: Consistency score

### Success Criteria
- All stats display correctly ✅
- Clean, readable layout ✅
- Smooth transition from game ✅
- Visual engagement ✅

### Files Created
```
components/
  PerformanceCard.tsx  (results display with visual metrics)
```

---

## PHASE 13: Database Setup
**Goal**: Configure Supabase connection and apply migrations  
**Time Estimate**: 3 hours  
**Dependencies**: Phase 12 complete

### Tasks
- [x] Verify Supabase project exists (xhcfjhzfyozzuicubqmh) ✅
- [x] Add environment variables locally (.env.local configured) ✅
- [ ] Add environment variables to Vercel (pending)
- [ ] Apply migration 004_align_with_new_design.sql (ready, waiting for OAuth fix)
- [x] Generate TypeScript types from database (database.types.ts exists) ✅
- [x] Test database connection (client.ts configured) ✅
- [ ] Verify Vercel deployment can connect to database

**Status**: Phase 13 mostly complete - migration pending OAuth fix

### Required Environment Variables for Vercel
Add these in Vercel Dashboard > Settings > Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xhcfjhzfyozzuicubqmh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get_from_.env.local>
SUPABASE_SERVICE_ROLE_KEY=<get_from_.env.local>
```
⚠️ Service role key is SECRET - never expose to client!

### Success Criteria
- Database accessible from application
- All migrations applied successfully
- TypeScript types match schema
- Basic CRUD operations work
- Vercel deployment can connect to Supabase

### Database Tables Used
- `profiles` - User profile data
- `game_sessions` - Individual game records
- Tables created but not used yet: achievements, daily_challenges

### New Files
```
lib/
  supabase/
    client.ts  (database client - already exists)
    types.ts   (TypeScript types - regenerate)
```

---

## PHASE 14: Email Authentication ✅ COMPLETE (PIVOTED)
**Goal**: ~~Implement X OAuth~~ Email/Password Authentication  
**Time Estimate**: 5 hours  
**Actual Time**: 4 hours (including OAuth troubleshooting)
**Dependencies**: Phase 13 complete
**Status**: PIVOTED from X OAuth due to Supabase configuration bugs

### Tasks (Updated for Email Auth)
- [x] ~~Configure X OAuth in Supabase dashboard~~ Attempted, blocked by Supabase bug
- [x] Implement email/password authentication instead
- [x] Create AuthModal component for sign up/sign in
- [x] Add username field (required)
- [x] Add optional X handle field (unverified)
- [x] Handle auth flow with email verification disabled
- [x] Auto-create profile on sign up
- [x] Display username when logged in

### Implementation Notes
**Why We Pivoted**: X OAuth configuration in Supabase was not persisting to database despite multiple attempts. After extensive troubleshooting (see docs/OAUTH_TROUBLESHOOTING.md), we pivoted to email authentication to unblock development.

**What We Built Instead**:
- Email/password authentication with Supabase Auth
- AuthModal component with sign up/sign in forms
- Username field for display name (required)
- Optional X handle field for future social features
- Hardcoded Supabase credentials to avoid env var issues
- Profile creation on sign up with username

### Success Criteria
- ✅ Successful email sign up and sign in
- ✅ Profile created in `profiles` table
- ✅ Username displays correctly
- ✅ Session persists across refreshes

### Database Operations
- INSERT into `profiles` on sign up
- SELECT from `profiles` to get user data
- Store username and optional x_username

### Files Created
```
components/
  AuthButton.tsx    (login/logout) ✅
  AuthModal.tsx     (sign up/sign in forms) ✅
hooks/
  useAuth.ts        (auth state) ✅
lib/
  supabase/
    authHelpers.ts  (auth functions) ✅
```

---

## PHASE 15: Save Scores
**Goal**: Persist scores to database  
**Time Estimate**: 3 hours  
**Dependencies**: Phase 14 complete

### Tasks
- [ ] Save session after game ends
- [ ] Calculate all required stats for database
- [ ] Link to authenticated user
- [ ] Update profile lifetime stats
- [ ] Handle offline/error cases
- [ ] Show save confirmation

### Success Criteria
- Scores save reliably to `game_sessions`
- Profile stats update automatically (via trigger)
- Handles errors gracefully
- Works for authenticated users only

### Database Operations
- INSERT into `game_sessions` with full game data:
  - avg_reaction_time, successful_hits, trap_targets_hit
  - missed_cues, accuracy, game_duration, targets_shown
  - difficulty_reached, score
- Trigger updates `profiles` automatically:
  - total_games, lifetime_hits, lifetime_misses
  - best_reaction_time, high_score, overall_accuracy

### Updates
```
lib/
  supabase/
    gameService.ts  (save operations)
```

---

## PHASE 16: Leaderboards
**Goal**: Display top scores  
**Time Estimate**: 5 hours  
**Dependencies**: Phase 15 complete

### Tasks
- [ ] Create leaderboard component
- [ ] Fetch top 20 scores
- [ ] Show daily and all-time views
- [ ] Display user's rank
- [ ] Add refresh functionality

### Success Criteria
- Fast loading (< 1 second)
- Accurate rankings
- Shows user position if not in top 20
- Updates after each game

### Database Operations
- SELECT from `daily_leaderboard` view (today's top scores)
- SELECT from `all_time_leaderboard` view (best ever)
- SELECT user's rank with window functions
- Uses existing database views for efficiency

### New Files
```
components/
  Leaderboard.tsx     (rankings display)
hooks/
  useLeaderboard.ts   (fetch rankings)
app/
  leaderboard/page.tsx (dedicated page)
```

---

## PHASE 17: Share to X
**Goal**: Social sharing feature  
**Time Estimate**: 4 hours  
**Dependencies**: Phase 16 complete

### Tasks
- [ ] Generate scorecard image with Canvas API
- [ ] Create share text with stats
- [ ] Implement X share intent URL
- [ ] Track shares in database
- [ ] Add attribution footer

### Success Criteria
- Creates attractive scorecard image
- Opens X compose with pre-filled text
- Includes game stats and leaderboard rank
- Records share in `shared_scores` table

### Database Operations
- INSERT into `shared_scores` to track sharing
- SELECT user's rank for share text
- Check for "Sharing is Caring" achievement
- INSERT into `user_achievements` if earned

### New Files
```
lib/
  sharing.ts          (share logic & image generation)
components/
  ShareButton.tsx     (share UI)
  ScoreCard.tsx       (visual scorecard)
```

---

## PHASE 18: Practice Mode ✅ COMPLETE (Implemented Early)
**Goal**: Allow non-authenticated play  
**Time Estimate**: 2 hours  
**Dependencies**: ~~Phase 17 complete~~ Implemented early during Phase 14 OAuth troubleshooting

### Tasks
- [x] Add practice mode option (useAuth hook manages isPracticeMode) ✅
- [x] Disable score saving (no DB writes in practice mode) ✅
- [x] Show "Practice" indicator (AuthButton shows "Practice Mode") ✅
- [x] Prompt login after game (AuthButton always visible) ✅

### Success Criteria
- Full gameplay without login ✅
- Clear indication of practice mode ✅
- Smooth transition to authenticated ✅

**Status**: Implemented early to allow gameplay during OAuth troubleshooting

### Updates
```
hooks/
  useAuth.ts       (includes isPracticeMode state) ✅
components/
  AuthButton.tsx   (shows practice mode indicator) ✅
```

---

## PHASE 19: Charts & Analytics
**Goal**: Show progression over time  
**Time Estimate**: 6 hours  
**Dependencies**: Phase 18 complete

### Tasks
- [ ] Integrate Recharts
- [ ] Create stats page
- [ ] Show reaction time trends
- [ ] Display accuracy improvement

### Success Criteria
- Charts render correctly
- Data is accurate
- Good performance with many data points

### New Files
```
components/
  charts/
    ProgressChart.tsx
    AccuracyChart.tsx
app/
  stats/page.tsx
```

---

## PHASE 20: Final Polish & Testing
**Goal**: Production readiness  
**Time Estimate**: 4 hours  
**Dependencies**: All phases complete

### Tasks
- [ ] Performance optimization
- [ ] Mobile testing
- [ ] Error handling review
- [ ] Loading states
- [ ] Final bug fixes

### Success Criteria
- No console errors
- Smooth performance
- Works on all target devices
- Handles edge cases

---

## TESTING CHECKLIST (Per Phase)

### Before Moving to Next Phase
- [ ] Feature works as specified
- [ ] No console errors or warnings
- [ ] Works on mobile and desktop
- [ ] Code is clean and commented
- [ ] No performance issues
- [ ] Previous features still work

### Integration Testing (Every 5 Phases)
- [ ] Full game flow works
- [ ] No memory leaks
- [ ] Performance acceptable
- [ ] All features integrate properly

---

## DEPLOYMENT PLAN

### Pre-Deployment (After Phase 20)
1. Complete testing on all devices
2. Set up Vercel project
3. Configure environment variables
4. Test authentication flow
5. Verify database connections

### Deployment Steps
1. Push to GitHub
2. Connect Vercel to repository
3. Configure production environment
4. Deploy to staging URL
5. Final testing
6. Deploy to production

### Post-Deployment
1. Monitor error logs
2. Track performance metrics
3. Gather user feedback
4. Plan Version 2.0 features

---

## RISK MITIGATION

### Common Pitfalls to Avoid
1. **Scope Creep**: Stick to the phase plan
2. **Premature Optimization**: Make it work first
3. **Complex State**: Keep it simple
4. **Untested Code**: Test every phase thoroughly
5. **Poor Mobile Experience**: Test on real devices

### Backup Plans
- Keep git commits after each phase
- Document any deviations from plan
- Have rollback strategy ready
- Maintain simple architecture

---

## SUCCESS METRICS

### Per Phase
- Implementation time within estimate
- Feature works without bugs
- Code remains maintainable

### Overall Project
- Game is fun and addictive
- X sharing drives engagement
- Performance meets targets
- Users return for multiple sessions

---

**Remember**: Each phase builds on the previous one. Don't skip ahead. Test thoroughly. Keep it simple.