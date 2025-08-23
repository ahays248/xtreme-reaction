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

## PHASE 1: Static Target Display
**Goal**: Show and hide a circle on screen  
**Time Estimate**: 2 hours  
**Files**: 1-2 files maximum

### Tasks
- [ ] Create basic Next.js page
- [ ] Add a green circle div
- [ ] Add show/hide button
- [ ] Style with basic CSS

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

## PHASE 2: Click Detection
**Goal**: Detect when target is clicked  
**Time Estimate**: 2 hours  
**Dependencies**: Phase 1 complete

### Tasks
- [ ] Add onClick handler to target
- [ ] Log click events to console
- [ ] Show click count on screen
- [ ] Handle both mouse and touch events

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

## PHASE 3: Basic Timing
**Goal**: Measure reaction time  
**Time Estimate**: 3 hours  
**Dependencies**: Phase 2 complete

### Tasks
- [ ] Record timestamp when target appears
- [ ] Calculate time difference on click
- [ ] Display reaction time
- [ ] Store last 5 reaction times

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

## PHASE 4: Auto-Hide Targets
**Goal**: Targets disappear after timeout  
**Time Estimate**: 3 hours  
**Dependencies**: Phase 3 complete

### Tasks
- [ ] Add timeout when target appears
- [ ] Target disappears after 2 seconds
- [ ] Show "missed" message if timeout occurs
- [ ] Clear timeout if clicked

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

## PHASE 5: Game Loop
**Goal**: Continuous target spawning  
**Time Estimate**: 4 hours  
**Dependencies**: Phase 4 complete

### Tasks
- [ ] Auto-spawn new target after click/timeout
- [ ] Add "Start Game" button
- [ ] Add "Game Over" after 10 targets
- [ ] Show final statistics

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

## PHASE 6: Progressive Difficulty
**Goal**: Game gets harder over time  
**Time Estimate**: 4 hours  
**Dependencies**: Phase 5 complete

### Tasks
- [ ] Decrease timeout duration per round
- [ ] Decrease target size per round
- [ ] Add round counter display
- [ ] Implement difficulty curve

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

## PHASE 7: Trap Targets
**Goal**: Add red targets that end game  
**Time Estimate**: 4 hours  
**Dependencies**: Phase 6 complete

### Tasks
- [ ] Create red target variant
- [ ] Random chance of red target
- [ ] End game if red target clicked
- [ ] Show different message for trap hit

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

## PHASE 8: Scoring System
**Goal**: Calculate and display scores  
**Time Estimate**: 3 hours  
**Dependencies**: Phase 7 complete

### Tasks
- [ ] Implement score formula
- [ ] Add score display during game
- [ ] Show final score calculation
- [ ] Add high score tracking (local storage)

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

## PHASE 9: Accuracy Tracking
**Goal**: Track hit/miss accuracy  
**Time Estimate**: 3 hours  
**Dependencies**: Phase 8 complete

### Tasks
- [ ] Track total clicks
- [ ] Track successful hits
- [ ] Calculate accuracy percentage
- [ ] Display accuracy in UI

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

## PHASE 10: UI Polish
**Goal**: Implement cyberpunk theme  
**Time Estimate**: 4 hours  
**Dependencies**: Phase 9 complete

### Tasks
- [ ] Add Matrix-style background
- [ ] Style targets with glow effects
- [ ] Add cyberpunk fonts
- [ ] Implement color scheme

### Success Criteria
- Consistent theme throughout
- Good contrast and readability
- Smooth animations

### New Files
```
styles/
  cyberpunk.css  (theme styles)
components/
  MatrixRain.tsx (background effect)
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

## PHASE 12: Performance Card
**Goal**: Post-game statistics display  
**Time Estimate**: 4 hours  
**Dependencies**: Phase 11 complete

### Tasks
- [ ] Create performance card component
- [ ] Display all game statistics
- [ ] Add "Play Again" button
- [ ] Show personal best indicator

### Success Criteria
- All stats display correctly
- Clean, readable layout
- Smooth transition from game

### New Files
```
components/
  PerformanceCard.tsx  (results display)
```

---

## PHASE 13: Database Setup
**Goal**: Configure Supabase connection and apply migrations  
**Time Estimate**: 3 hours  
**Dependencies**: Phase 12 complete

### Tasks
- [ ] Verify Supabase project exists (already created)
- [ ] Apply migration 004_align_with_new_design.sql
- [ ] Generate TypeScript types from database
- [ ] Test database connection
- [ ] Configure environment variables

### Success Criteria
- Database accessible from application
- All migrations applied successfully
- TypeScript types match schema
- Basic CRUD operations work

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

## PHASE 14: X Authentication
**Goal**: Implement X OAuth  
**Time Estimate**: 5 hours  
**Dependencies**: Phase 13 complete

### Tasks
- [ ] Configure X OAuth in Supabase dashboard
- [ ] Add login button with X branding
- [ ] Handle auth flow and callbacks
- [ ] Auto-create profile on first login
- [ ] Display username when logged in

### Success Criteria
- Successful X login
- Profile created in `profiles` table
- Username displays correctly
- Session persists across refreshes

### Database Operations
- INSERT into `profiles` on first login (via trigger)
- SELECT from `profiles` to get user data
- UPDATE `profiles.x_username` from OAuth data

### New Files
```
components/
  AuthButton.tsx    (login/logout)
hooks/
  useAuth.ts        (auth state)
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

## PHASE 18: Practice Mode
**Goal**: Allow non-authenticated play  
**Time Estimate**: 2 hours  
**Dependencies**: Phase 17 complete

### Tasks
- [ ] Add practice mode option
- [ ] Disable score saving
- [ ] Show "Practice" indicator
- [ ] Prompt login after game

### Success Criteria
- Full gameplay without login
- Clear indication of practice mode
- Smooth transition to authenticated

### Updates
```
hooks/
  useGameMode.ts  (mode management)
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