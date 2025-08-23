# Xtreme Reaction - Game Design Document
**Version**: 1.0  
**Date**: August 23, 2025  
**Author**: @DataVisGuy  
**Status**: Foundation Document

---

## 1. INTRODUCTION

### Game Summary
Xtreme Reaction is a quick reaction time game where players compete to achieve high scores and climb the leaderboards, exclusively integrated with X (formerly Twitter) for authentication and social sharing.

### Unique Selling Points
- **X-Exclusive**: Requires X authentication, displays X usernames on leaderboards
- **Social Competition**: Share performance directly to X with visual scorecards
- **Progressive Difficulty**: Game adapts and intensifies based on performance
- **Fair Cross-Platform**: Balanced gameplay between mobile and desktop users

### Inspiration
This project serves three primary goals:
1. Learn efficient leaderboard implementation
2. Master data visualization with charts and user progression tracking
3. Grow X account presence through viral, competitive gameplay

### Player Experience
**Emotions**: Building tension, excitement from improving scores, satisfaction from beating personal bests
**Memorable Elements**: Quick, addictive gameplay that's easy to share and compare with X followers

### Platform
- **Primary**: Web application (browser-based)
- **Mobile-First Design**: Fully responsive for phones and tablets
- **Desktop Optimization**: Constrained target area for fairness vs mobile

### Development Software
- **Frontend**: Next.js 15+ with TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **Charts**: Recharts library
- **UI Components**: Shadcn/ui or Magic UI

### Genre
Reaction/Reflex, Casual Competitive

### Target Audience
- **Age**: All ages
- **Audience**: X.com users seeking quick, competitive gameplay
- **Session Type**: Casual, high-replay value, sub-60 second sessions

---

## 2. CONCEPT

### Gameplay Overview

#### Core Loop (4 Steps)
1. **Start**: Player initiates game, countdown begins
2. **React**: Targets appear one at a time, player taps/clicks as quickly as possible
3. **Survive**: Avoid trap targets, maintain accuracy, beat the timer
4. **Compare**: View score, see rank on leaderboards, share to X

#### Session Duration
- **Maximum**: 60 seconds
- **Average**: 30-45 seconds (progressive difficulty eliminates most players)

#### Win/Lose Conditions
- **Lose**: Miss a regular target before it disappears OR tap a trap target
- **Win**: There is no "win" - only achieving the highest score possible

### Theme Interpretation
**Setting**: Matrix-style cyberpunk aesthetic  
**Visual Style**: Green on black with digital rain effects  
**Theme Support**: The digital/cyber theme reinforces quick reflexes and competitive online nature

### Primary Mechanics

#### Core Mechanic #1: Reaction Speed
- Measure time between target appearance and successful tap
- Faster reactions = higher score contribution

#### Core Mechanic #2: Target Discrimination
- **Regular Targets** (Green): Tap quickly for points
- **Trap Targets** (Red): Must avoid - tapping ends game immediately

#### Core Mechanic #3: Progressive Difficulty
- Targets persist for less time as game progresses
- Targets become smaller over time
- Time between targets decreases (with randomization)

### Secondary Mechanics

#### Accuracy Tracking
- Every tap is recorded (hits and misses)
- Missing doesn't end game but hurts final score
- Accuracy percentage affects score multiplier

#### Progression System
- Track improvement over multiple sessions
- Personal best comparisons
- Historical performance charts

#### Social Integration
- Mandatory X authentication for ranked play
- Practice mode for non-authenticated users
- Shareable performance cards with game stats

---

## 3. ART

### Visual Theme
**Style**: Matrix-inspired Cyberpunk  
**Primary Colors**: 
- Bright Green (#00FF00) for regular targets and positive UI
- Deep Black (#000000) for backgrounds
- Red (#FF0000) for trap targets and warnings
- Dark Green (#003300) for subtle UI elements

### Target Design
Two designs to test:
1. **Circuit Nodes**: Geometric, tech-inspired circles with circuit patterns
2. **Holographic Markers**: Translucent, glowing targets with digital artifacts

### Visual Effects
- Subtle digital rain in background (Matrix-style)
- Glow effects on targets
- Smooth fade in/out animations
- Minimal particle effects to maintain performance

### UI Design
- Clean, minimalist interface
- Cyberpunk-styled fonts (monospace for data)
- Neon green accents on dark backgrounds
- High contrast for visibility

---

## 4. AUDIO

### Music
**Mood**: Tension-building, progressive intensity  
**Style**: Cyberpunk/electronic with increasing tempo  
**Implementation**: 
- Phase 1: Single static track
- Phase 2: Dynamic music that intensifies with difficulty

### Sound Effects
**Key Moments**:
- Target hit success (positive chime/beep)
- Target miss (subtle error sound)
- Trap target hit (dramatic failure sound)
- New personal best (achievement sound)

**Style**: Synthetic/digital sounds matching cyberpunk theme
**Creation**: Unity AI-generated effects based on specifications

---

## 5. GAME EXPERIENCE

### User Interface

#### Always Visible (During Gameplay)
- Current score (top center)
- Accuracy percentage (top right)
- Targets hit counter (top left)
- X username (bottom corner)

#### Contextual UI
- **Main Menu**: Play, Leaderboards, Stats, Settings
- **Performance Card**: Post-game statistics
- **Leaderboards**: Daily and All-time views
- **Charts**: Personal progression graphs

### Controls
- **Mobile**: Touch/tap with finger
- **Desktop**: Mouse click
- **Universal**: Single input method (tap/click only)

### Performance Card Contents
- Final score (large, prominent)
- Average reaction time
- Accuracy percentage
- Global rank
- Personal best comparison
- "New Record!" indicator when applicable

### Shareable Scorecard
Visual card containing:
- Player's X username
- Score and accuracy
- Average reaction time
- Global rank
- "Made with ❤️ by @DataVisGuy" (bottom right, small)

---

## 6. DEVELOPMENT TIMELINE

### MVP Features (Version 1.0)
1. Core gameplay (targets, timing, scoring)
2. X authentication
3. Basic leaderboards
4. Share to X functionality
5. Practice mode for non-authenticated users

### Post-Launch Features (Version 2.0)
- Dynamic music system
- Additional target types
- Power-ups and special modes
- Tournaments/competitions
- Advanced statistics and analytics
- Customization options

### Development Priorities
1. **Fun Gameplay** - Core mechanics must be satisfying
2. **Social Features** - X integration and sharing
3. **Polish/Visuals** - Clean, professional appearance
4. **Competitive Elements** - Leaderboards and rankings

### Critical Feature
**Must Have**: Ability to share scores on X - without this, the game loses its viral potential and primary purpose

---

## 7. TECHNICAL SPECIFICATIONS

### Database Schema

#### Users Table
- id (UUID)
- x_username (string)
- x_user_id (string)
- created_at (timestamp)
- total_games (integer)
- best_score (integer)

#### Sessions Table
- id (UUID)
- user_id (foreign key)
- score (integer)
- accuracy (float)
- avg_reaction_time (integer, ms)
- targets_hit (integer)
- game_duration (integer, seconds)
- created_at (timestamp)

#### Leaderboards Views
- Daily: Top 20 + user's rank
- All-time: Top 20 + user's rank

### Performance Metrics to Track
- Average reaction time per session
- Accuracy improvement over time
- High score progression
- Play frequency patterns
- Session duration trends

### Fair Play Considerations
- Server-side validation for scores
- Rate limiting for submissions
- Anomaly detection for impossible scores
- Desktop target area constraints for fairness

---

## 8. MONETIZATION (Future Consideration)
- No monetization in Version 1.0
- Potential future: Premium features, ad-free experience, custom themes

---

## APPENDIX

### Difficulty Progression Formula
```
Target Lifespan = BASE_TIME * (0.95 ^ round_number)
Target Size = BASE_SIZE * (0.98 ^ round_number)
Spawn Delay = Random(MIN_DELAY * (0.97 ^ round_number), MAX_DELAY * (0.97 ^ round_number))
```

### Score Calculation
```
Base Score = (1000 - reaction_time_ms) * accuracy_percentage
Final Score = Base Score * difficulty_multiplier
```

### Platform Fairness
- Desktop: Target area constrained to center 60% of screen
- Mobile: Full screen available for targets
- All platforms: Same target sizes relative to play area

---

## 9. DATABASE INTEGRATION

### Data Model
The game uses Supabase (PostgreSQL) with the following core tables:

#### User Data
- **profiles**: Extends auth.users with game stats
  - Tracks: username, x_username, lifetime stats, best scores
  - Auto-created on X OAuth signup via trigger

#### Game Data
- **game_sessions**: Individual game records
  - Stores: reaction times, hits/misses, accuracy, score
  - Links to user profile for authentication
  - Auto-updates profile stats via trigger

#### Social Features
- **achievements**: 12 predefined achievements
  - Examples: Speed Demon (<250ms), Perfect Game, X Verified
- **user_achievements**: Tracks earned achievements
- **shared_scores**: Records X shares for viral tracking
- **daily_challenges**: Daily goals for engagement

#### Leaderboards (Views)
- **daily_leaderboard**: Today's top players
- **all_time_leaderboard**: Historical best performances
- **game_efficiency**: Analytics and performance metrics

### Data Flow
1. **Authentication**: X OAuth → Create profile → Start session
2. **Gameplay**: Record metrics → Calculate score → Save to game_sessions
3. **Post-Game**: Update profile stats → Check achievements → Display rank
4. **Sharing**: Generate scorecard → Post to X → Track in shared_scores

### Security
- Row Level Security (RLS) on all tables
- Users can only modify their own data
- Public read access for leaderboards
- Service role for admin operations only

### Performance Targets
- Leaderboard queries < 100ms
- Score saves < 200ms
- Real-time rank updates
- Optimized indexes for common queries

### Schema Documentation
For detailed database schema, see `DATABASE_SCHEMA.md`

---

**Document Status**: This is a living document that will be updated as development progresses and new insights are gained through playtesting.