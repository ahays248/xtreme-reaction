# Components Directory

## Overview
Reusable React components for the Xtreme Reaction game. All components use TypeScript and are styled with Tailwind CSS.

## Structure
```
components/
├── game/           # Game-specific components
├── ui/             # TODO: Generic UI components
├── auth/           # TODO: Authentication components
└── social/         # TODO: Sharing and social features
```

## Game Components

### GameCanvas.tsx
- **Purpose**: Main game container and state orchestrator
- **State**: Manages game flow (idle → ready → waiting → cue → finished)
- **Key Features**:
  - Touch and click event handling
  - Progress tracking UI
  - Score display
  - Routes to different game states

### CueDisplay.tsx
- **Purpose**: Shows visual cues (circles) to the player
- **Props**: `isVisible`, `isFake`
- **Behavior**:
  - Green circle = tap quickly (real cue)
  - Red circle = don't tap (fake cue)
  - Includes distraction elements
  - Animated with Framer Motion

### Punishment.tsx
- **Purpose**: Visual feedback for errors
- **Props**: `consecutiveErrors`
- **Effects**:
  - Screen shake (intensity scales)
  - Red overlay
  - Blur effect
  - "WRONG!" message
  - Screen flicker for high errors

### ScoreBoard.tsx
- **Purpose**: Post-game results display
- **Props**: `results`, `onRestart`, `onShare`
- **Features**:
  - Grade calculation (S/A/B/C/D)
  - Detailed statistics
  - Share button (TODO: implement)
  - Restart game
  - View leaderboard (TODO: implement)

## TODO Components

### ui/Button.tsx
```typescript
// Reusable button with variants
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  onClick: () => void
  children: React.ReactNode
}
```

### ui/Card.tsx
```typescript
// Container component for content
interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
}
```

### auth/LoginButton.tsx
```typescript
// X OAuth login button
interface LoginButtonProps {
  onSuccess: (user: User) => void
  onError: (error: Error) => void
}
```

### social/ShareButton.tsx
```typescript
// Share to X with screenshot
interface ShareButtonProps {
  score: number
  grade: string
  screenshotRef: React.RefObject<HTMLElement>
}
```

## Component Guidelines

### State Management
- Use local state for UI-only concerns
- Lift state up when needed by siblings
- Consider Zustand for complex shared state

### Performance
- Memo expensive computations
- Use React.memo for pure components
- Lazy load heavy components

### Accessibility
- All interactive elements need keyboard support
- ARIA labels for icon buttons
- Focus management in modals
- Color contrast ratios > 4.5:1

### Mobile First
- Touch targets minimum 44x44px
- No hover-only interactions
- Test on real devices
- Consider thumb reach zones

### Animation Guidelines
- Use Framer Motion for complex animations
- CSS transitions for simple state changes
- 60 FPS target
- Respect prefers-reduced-motion

## Testing Strategy
- Unit tests for game logic
- Component tests with React Testing Library
- Visual regression tests for UI
- E2E tests for game flow

## Common Patterns

### Error Boundaries
Wrap game components to catch errors gracefully

### Loading States
Show skeletons or spinners during data fetching

### Responsive Design
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

## Future Components
- Leaderboard table with infinite scroll
- Achievement badges grid
- User avatar with X profile pic
- Daily challenge card
- Tournament bracket
- Statistics charts
- Settings panel
- Tutorial overlay