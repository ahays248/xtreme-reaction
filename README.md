# 🎮 Xtreme Reaction

A mobile-friendly reaction time challenge game built with Next.js, TypeScript, and Supabase. Test your reflexes by tapping green circles while avoiding red traps!

## 🚀 Current Status

**The game is FULLY PLAYABLE!** Core mechanics are complete and working perfectly.

- ✅ **Phase 3 of 20 Complete** - Following incremental development plan
- 🎮 **Playable at** `http://localhost:3000`
- 📱 **Mobile-optimized** with touch controls
- ⚡ **60 FPS** smooth performance
- 🌐 **Live Demo**: Coming soon on Vercel

## 🎯 Game Features

### Core Gameplay (✅ Complete)
- **10-round sessions** with progressive difficulty
- **Green circles**: Tap as fast as possible for points
- **Red circles**: Avoid tapping (auto-disappear after 3 seconds)
- **Reaction timing**: Precise millisecond tracking
- **Score system**: Speed + accuracy + difficulty multiplier
- **Visual feedback**: Punishment effects for errors
- **Grade system**: S/A/B/C/D/F performance grades

### Visual & Audio Effects (✅ Complete)
- Screen shake on errors (intensity scales with consecutive mistakes)
- Red overlay and blur effects for punishment
- Smooth animations with Framer Motion
- Random circle positioning across the screen
- Progressive difficulty visualization
- **Sound effects**: Success chimes, error buzzes, perfect reaction fanfare
- Sound toggle button (mute/unmute)

### Scoring System (✅ Complete)
- **Speed points**: 1000 - avg reaction time
- **Accuracy bonus**: accuracy % × 500
- **Fake avoidance**: +200 points per red circle avoided
- **Difficulty multiplier**: Increases as you progress
- **Fair grading**: Adjusted for choice reaction times (600-800ms is normal)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5 with TypeScript
- **Styling**: Tailwind CSS (responsive design)
- **Database**: Supabase (PostgreSQL with RLS)
- **Animations**: Framer Motion
- **State**: React hooks
- **Deployment**: Vercel (planned)

## 📦 Installation

```bash
# Clone the repository
git clone [repository-url]
cd XtremeReaction

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Run development server
npm run dev

# Open in browser
http://localhost:3001
```

## 🗄️ Database Schema (Ready)

The Supabase database is fully configured with:

- `profiles` - User profiles and lifetime stats
- `game_sessions` - Individual game results
- `achievements` - Achievement definitions
- `user_achievements` - Earned achievements
- `daily_challenges` - Daily challenge configs
- `challenge_completions` - User challenge progress
- `shared_scores` - X (Twitter) share tracking
- `daily_leaderboard` - Today's top scores (view)
- `all_time_leaderboard` - Best performances (view)

## 🎮 How to Play

1. **Start**: Click "Start Game" on the home screen
2. **Wait**: Watch for circles to appear
3. **React**: 
   - 🟢 **Green circles**: Tap quickly for points
   - 🔴 **Red circles**: Don't tap! (they disappear automatically)
4. **Score**: Based on speed, accuracy, and difficulty
5. **Grade**: Get ranked S through F based on performance

### Tips for Better Scores
- Focus on accuracy over pure speed
- Red circles give bonus points when avoided
- Consecutive errors increase punishment duration
- Average choice reaction time is 600-800ms (this is normal!)
- Aim for under 600ms with 85%+ accuracy for an A grade

## 📊 Recent Bug Fixes

All major bugs have been fixed:
- ✅ Red circles now auto-disappear after 3 seconds
- ✅ Circles spawn randomly across the screen
- ✅ Game properly ends after round 10
- ✅ Must click directly on circles (not anywhere)
- ✅ Fair grading system for choice reaction times
- ✅ Proper reaction time tracking (only green circles)
- ✅ Bonus points for avoiding red circles

## 🚧 Coming Soon (25% Remaining)

### Authentication & Profiles
- [ ] X (Twitter) OAuth login
- [ ] User profiles and stats
- [ ] Guest mode with upgrade prompt

### Social Features
- [ ] Share scores on X with image
- [ ] Global leaderboards
- [ ] Friend challenges
- [ ] Daily challenges

### PWA Features
- [ ] Install as mobile app
- [ ] Offline play support
- [ ] Push notifications

### Deployment
- [ ] Deploy to Vercel
- [ ] Custom domain setup
- [ ] Analytics integration

## 🧪 Development

```bash
# Run tests (coming soon)
npm test

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## 📝 Project Structure

```
XtremeReaction/
├── app/                 # Next.js app router
├── components/         
│   └── game/           # Game components (Canvas, CueDisplay, etc.)
├── hooks/              
│   └── useGame.ts      # Main game logic hook
├── lib/
│   ├── game/           # Game engine and types
│   └── supabase/       # Database client
├── supabase/
│   └── migrations/     # Database schema
└── public/             # Static assets
```

## 🤝 Contributing

This project is currently in active development. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

Built with:
- Next.js by Vercel
- Supabase for backend
- Tailwind CSS for styling
- Framer Motion for animations

---

**Current Version**: 0.7.5 (Core Game Complete)
**Last Updated**: August 22, 2025