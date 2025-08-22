# Lib Directory - Core Logic

## Overview
Core business logic, utilities, and service integrations. This is where the non-UI code lives.

## Structure
```
lib/
├── supabase/         # Database client and types
├── game/             # Game engine and mechanics
└── utils/            # TODO: Utility functions
```

## Supabase Integration

### client.ts
- Browser-side Supabase client
- Used in React components
- Handles authentication state

### server.ts
- Server-side Supabase client
- Used in API routes and server components
- Manages cookies for auth

### database.types.ts
- TypeScript types for database schema
- Auto-generated from Supabase schema
- Provides type safety for queries

## Game Engine

### types.ts
Core type definitions:
- `GameState`: Current game status and stats
- `GameResults`: Final game summary
- `GameConfig`: Customizable game parameters
- `CueType`: 'real' | 'fake' | 'distraction'

### engine.ts
Game logic functions:
- `calculateScore()`: Score based on speed, accuracy, difficulty
- `getRandomDelay()`: Adaptive delay between cues
- `shouldShowFakeCue()`: Probability of fake cues
- `getPunishmentDuration()`: Escalating punishment time
- `calculateResults()`: Generate final game stats

### Game Mechanics
```typescript
// Score formula
score = (speedScore + accuracyBonus) * difficultyMultiplier

// Speed score: 1000ms - avgReactionTime
// Accuracy bonus: accuracy% * 500
// Difficulty: 1 + (level * 0.1)
```

## TODO: Utility Functions

### utils/sharing.ts
```typescript
// Generate shareable text
export function getShareText(results: GameResults): string

// Create screenshot of element
export function captureScreenshot(element: HTMLElement): Promise<Blob>

// Post to X API
export function shareToX(text: string, image?: Blob): Promise<string>
```

### utils/achievements.ts
```typescript
// Check if user earned achievements
export function checkAchievements(
  session: GameSession,
  profile: Profile
): Achievement[]

// Award achievement to user
export function awardAchievement(
  userId: string,
  achievementId: string
): Promise<void>
```

### utils/leaderboard.ts
```typescript
// Get user's rank
export function getUserRank(
  userId: string,
  period: 'daily' | 'weekly' | 'all-time'
): Promise<number>

// Format leaderboard display
export function formatLeaderboard(
  entries: LeaderboardEntry[]
): FormattedEntry[]
```

## Configuration

### Game Defaults
```typescript
DEFAULT_CONFIG = {
  totalRounds: 10,
  minDelay: 1000ms,
  maxDelay: 5000ms,
  cueTimeout: 2000ms,
  basePunishmentDuration: 1000ms,
  punishmentMultiplier: 1.5,
  fakeChance: 0.2,
  distractionChance: 0.1
}
```

### Difficulty Scaling
- Delay decreases by 200ms per level
- Fake cue chance increases by 5% per level
- Max difficulty level: 10

### Score Grades
- S: < 250ms reaction, > 90% accuracy
- A: < 300ms reaction, > 80% accuracy
- B: < 350ms reaction, > 70% accuracy
- C: < 400ms reaction, > 60% accuracy
- D: Everything else

## Database Queries

### Common Patterns
```typescript
// Get user profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()

// Save game session
const { data: session } = await supabase
  .from('game_sessions')
  .insert({
    user_id: userId,
    avg_reaction_time: results.avgReactionTime,
    score: results.score,
    // ... other fields
  })
  .select()
  .single()

// Get leaderboard
const { data: leaderboard } = await supabase
  .from('daily_leaderboard')
  .select('*')
  .limit(10)
```

## Performance Optimizations
- Memoize expensive calculations
- Batch database operations
- Use database views for complex queries
- Cache leaderboard data (1 minute TTL)

## Error Handling
- Always handle Supabase errors
- Provide fallback values
- Log errors for debugging
- Show user-friendly messages

## Testing
- Pure functions are easy to test
- Mock Supabase client for tests
- Test edge cases (0ms reaction, 100% accuracy)
- Validate score calculations

## Future Enhancements
- Websocket for real-time leaderboards
- Machine learning for cheat detection
- Advanced statistics tracking
- Custom game modes
- Replay system