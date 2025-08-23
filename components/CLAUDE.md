# Components Directory

## ⚠️ IMPORTANT: INCREMENTAL DEVELOPMENT APPROACH

### Current Status
This directory is **EMPTY** as part of our fresh start. We will build components incrementally following the IMPLEMENTATION_PLAN.md.

### Phase 1 Component (First to Build)
```typescript
// Target.tsx - Simple green circle component
interface TargetProps {
  isVisible: boolean
}
```

### Development Philosophy
1. **Start Simple**: Phase 1 = one component, one button
2. **No Premature Abstraction**: Don't create UI libraries yet
3. **Test Each Phase**: Component must work before adding features
4. **Keep It Minimal**: 100-200 lines per phase MAX

## Planned Component Structure (By Phase)

### Phase 1: Static Target Display
```
components/
└── Target.tsx      # Simple green circle
```

### Phase 2: Click Detection
```
components/
└── Target.tsx      # Add onClick handler
```

### Phase 7: Trap Targets
```
components/
├── Target.tsx      # Green target
└── TrapTarget.tsx  # Red target variant
```

### Phase 10: UI Polish
```
components/
├── game/
│   ├── Target.tsx
│   └── TrapTarget.tsx
└── MatrixRain.tsx  # Background effect
```

### Phase 12: Performance Card
```
components/
├── game/
│   ├── Target.tsx
│   └── TrapTarget.tsx
├── MatrixRain.tsx
└── PerformanceCard.tsx  # Results display
```

### Phase 14: X Authentication
```
components/
├── game/
├── MatrixRain.tsx
├── PerformanceCard.tsx
└── AuthButton.tsx   # X OAuth login
```

### Phase 16: Leaderboards
```
components/
├── game/
├── auth/
└── Leaderboard.tsx  # Rankings display
```

### Phase 17: Share to X
```
components/
├── game/
├── auth/
├── Leaderboard.tsx
├── ShareButton.tsx
└── ScoreCard.tsx    # Visual scorecard
```

## Component Guidelines (When We Get There)

### For Phase 1-5: Keep It Simple
- No complex state management
- No performance optimization
- No fancy animations
- Just make it work

### For Phase 6-10: Add Polish Carefully
- Simple CSS transitions only
- Basic responsive design
- Test mobile touch events

### For Phase 11-15: Integration Focus
- Connect to database
- Handle authentication
- Save/load data

### For Phase 16-20: Final Features
- Social sharing
- Charts and analytics
- Production polish

## Anti-Patterns to Avoid

### From Previous Attempt
1. **Complex Timeout Chains**: Led to duplicate processing
2. **Multiple Event Handlers**: Caused phantom clicks
3. **Nested State Updates**: Created race conditions
4. **Over-Engineered Components**: Too many responsibilities

### What We'll Do Instead
1. **Linear Logic**: One thing happens at a time
2. **Single Event Handler**: Use onPointerDown
3. **Simple State**: Minimal, flat structure
4. **Focused Components**: One job per component

## Mobile Considerations

### Touch Events (Phase 2)
```typescript
// Use pointer events for unified handling
onPointerDown={(e) => {
  if (e.isPrimary) {
    handleClick()
  }
}}
```

### Target Sizing (Phase 1)
- Minimum 44x44px for touch
- Use CSS for responsive sizing
- Test on real devices

## Testing Strategy (Per Phase)

### Phase 1-5: Manual Testing
- Click the button
- See the circle
- Works on mobile?
- No console errors?

### Phase 6-10: Basic Validation
- Timing accurate?
- Difficulty scaling?
- Traps working?

### Phase 11-15: Integration Testing
- Data saves correctly?
- Auth flow works?
- Scores persist?

### Phase 16-20: Full Testing
- Leaderboards update?
- Sharing works?
- Performance good?

## Future Components (Post-MVP)
These are NOT for the current 20-phase plan:
- Tournament brackets
- Friend challenges
- Practice modes
- Advanced analytics
- Custom themes
- Power-ups

---

**Remember**: We're on Phase 1. Create Target.tsx. Make it show and hide. That's it. No more, no less.