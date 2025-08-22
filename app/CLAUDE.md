# App Directory - Next.js App Router

## Overview
This directory contains all the pages and API routes for the Xtreme Reaction game using Next.js App Router.

## Current Structure
```
app/
├── page.tsx          # Main game page (renders GameCanvas)
├── layout.tsx        # Root layout with metadata
├── globals.css       # Global styles (Tailwind)
├── leaderboard/      # TODO: Leaderboard page
├── profile/          # TODO: User profile page
└── api/              # TODO: API routes
    ├── auth/         # TODO: Auth endpoints
    └── share/        # TODO: X sharing endpoint
```

## Key Files

### page.tsx
- Entry point for the game
- Renders the `GameCanvas` component
- No authentication required (guest play allowed)

### layout.tsx
- Sets up fonts (Geist Sans and Mono)
- Contains metadata for SEO
- Wraps all pages with consistent styling

## TODO Pages

### /leaderboard
- Display daily and all-time leaderboards
- Show user's ranking
- Filter by time period
- Link to player profiles

### /profile
- User statistics and achievements
- Game history
- Badge showcase
- Settings/preferences

### /api/auth/callback
- Handle X OAuth callback
- Create/update user profile
- Set session cookies

### /api/share
- Generate scoreboard image
- Post to X API
- Track share in database
- Return post URL

## Routing Patterns
- `/` - Main game
- `/leaderboard` - Rankings
- `/leaderboard/daily` - Today's scores
- `/profile/[username]` - User profiles
- `/challenge/[date]` - Daily challenges

## Authentication Flow
1. User clicks "Login with X"
2. Redirect to X OAuth
3. Callback to `/api/auth/callback`
4. Create Supabase session
5. Redirect to game with user data

## State Management
- Game state is local (useGame hook)
- User auth via Supabase client
- Leaderboard data fetched on demand
- No global state needed yet

## Performance Notes
- Game page has no SSR requirements
- Leaderboard can use ISR (revalidate every 60s)
- Profile pages can be statically generated
- API routes should cache where possible

## Mobile Considerations
- All pages must be touch-friendly
- Viewport meta tag set in layout
- No hover-only interactions
- Minimum tap target: 44x44px

## Future Enhancements
- `/tournament` - Special events
- `/practice` - Training mode
- `/stats` - Detailed analytics
- `/settings` - User preferences