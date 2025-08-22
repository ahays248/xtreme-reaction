# Hooks Directory - Custom React Hooks

## Overview
Custom React hooks for managing game state, authentication, and other reusable logic.

## Current Hooks

### useGame.ts
The main game state management hook.

**What it does:**
- Manages complete game lifecycle
- Handles user input (taps/clicks)
- Tracks reaction times and scores
- Controls visual cue timing
- Manages punishment states

**Key Functions:**
- `startGame()`: Initialize new game
- `handleTap()`: Process user input
- `resetGame()`: Clear state and restart
- `showCue()`: Display real or fake cue
- `handleSuccessfulTap()`: Process correct tap
- `handleIncorrectTap()`: Trigger punishment
- `handleMiss()`: Handle timeout on real cue
- `handleFakeCueSuccess()`: Reward avoiding fake cue

**State Management:**
```typescript
gameState: {
  status: 'idle' | 'ready' | 'waiting' | 'cue' | 'punishment' | 'finished'
  currentRound: number
  reactionTimes: number[]
  successfulHits: number
  incorrectHits: number
  missedCues: number
  // ... more fields
}
```

**Recent Bug Fix:**
- Red circles (fake cues) now automatically disappear after 2 seconds
- Players are rewarded for successfully avoiding fake cues

## TODO Hooks

### useAuth.ts
```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Check session on mount
  // Handle login/logout
  // Return user state and methods
  
  return {
    user,
    loading,
    signInWithX: async () => {},
    signOut: async () => {},
  }
}
```

### useLeaderboard.ts
```typescript
export function useLeaderboard(period: 'daily' | 'weekly' | 'all-time') {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Fetch leaderboard data
  // Subscribe to real-time updates
  // Calculate user's rank
  
  return {
    leaderboard,
    userRank,
    loading,
    refresh: () => {},
  }
}
```

### useAchievements.ts
```typescript
export function useAchievements(userId: string) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [earned, setEarned] = useState<string[]>([])
  
  // Fetch all achievements
  // Check which ones user has earned
  // Listen for new achievements
  
  return {
    achievements,
    earned,
    checkForNew: (gameSession: GameSession) => {},
  }
}
```

### useGameSession.ts
```typescript
export function useGameSession() {
  const [session, setSession] = useState<GameSession | null>(null)
  const [saving, setSaving] = useState(false)
  
  // Save game results to database
  // Check for daily challenges
  // Award achievements
  
  return {
    session,
    saving,
    saveResults: async (results: GameResults) => {},
  }
}
```

### useShare.ts
```typescript
export function useShare() {
  const [sharing, setSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  
  // Capture screenshot
  // Generate share text
  // Post to X
  
  return {
    sharing,
    shareUrl,
    shareScore: async (element: HTMLElement, results: GameResults) => {},
  }
}
```

## Hook Patterns

### Error Handling
```typescript
const [error, setError] = useState<Error | null>(null)

try {
  // operation
} catch (err) {
  setError(err as Error)
  console.error('Hook error:', err)
}
```

### Loading States
```typescript
const [loading, setLoading] = useState(false)

const doAsync = async () => {
  setLoading(true)
  try {
    // async operation
  } finally {
    setLoading(false)
  }
}
```

### Cleanup
```typescript
useEffect(() => {
  const subscription = supabase
    .from('table')
    .on('*', callback)
    .subscribe()
    
  return () => {
    subscription.unsubscribe()
  }
}, [])
```

### Memoization
```typescript
const expensiveValue = useMemo(() => {
  return computeExpensive(dependency)
}, [dependency])

const stableCallback = useCallback(() => {
  // callback logic
}, [dependency])
```

## Testing Hooks

### Setup
```typescript
import { renderHook, act } from '@testing-library/react-hooks'
import { useGame } from './useGame'

test('starts game correctly', () => {
  const { result } = renderHook(() => useGame())
  
  act(() => {
    result.current.startGame()
  })
  
  expect(result.current.gameState.status).toBe('ready')
})
```

## Performance Tips
- Avoid unnecessary re-renders with memo
- Use useCallback for event handlers
- Split large hooks into smaller ones
- Consider using Zustand for complex state

## Common Issues
- **Stale closures**: Use refs for values that change frequently
- **Memory leaks**: Always cleanup subscriptions
- **Race conditions**: Cancel in-flight requests
- **Infinite loops**: Check dependency arrays

## Future Hooks
- `useSound()`: Audio feedback for game events
- `useVibration()`: Haptic feedback on mobile
- `useTimer()`: Precise timing utilities
- `useWebSocket()`: Real-time multiplayer
- `useAnalytics()`: Track user behavior