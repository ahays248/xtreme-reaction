# 🎮 Xtreme Reaction

**Test your reflexes. Compete globally. Share your scores.**

[![Live Game](https://img.shields.io/badge/Play%20Now-XtremeReaction.lol-00ff00?style=for-the-badge)](https://XtremeReaction.lol)
[![Version](https://img.shields.io/badge/Version-1.0.0-cyan?style=for-the-badge)](https://github.com/ahays248/xtreme-reaction)
[![Created By](https://img.shields.io/badge/Created%20By-@DataVisGuy-blue?style=for-the-badge)](https://x.com/DataVisGuy)

## 🚀 Play Now!

**The game has been archived**

- ✅ **Version 1.0** - Fully launched and production-ready
- 🎮 **60-Second Sessions** - Quick, competitive gameplay
- 📱 **Mobile-Optimized** - Play on any device
- 🏆 **Global Leaderboards** - Compete worldwide
- 📊 **Personal Stats** - Track your improvement
- 🔗 **Share to X** - Show off your scores with visual scorecards

## 🎯 Game Features

### Core Gameplay
- **60-Second Sessions** - Time-based competitive gameplay
- **Green Targets** - Tap as fast as possible for points
- **Red Traps** - Avoid tapping or game ends!
- **Fair Challenge** - Maximum 5 red circles per game
- **Streak System** - Build combos for multiplied scores
- **Progressive Difficulty** - Gets harder as time passes
- **Performance Grades** - S/A/B/C/D/F rankings

### Visual & Audio
- **Matrix Theme** - Cyberpunk green-on-black aesthetic
- **Matrix Rain** - Animated background effect
- **Neon Glow** - Pulsing targets with glow effects
- **Background Music** - Menu, gameplay, and results tracks
- **Sound Effects** - Hit, miss, and trap sounds
- **Volume Controls** - Separate music and SFX sliders
- **Smooth Animations** - 60 FPS with Framer Motion

### Scoring System
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
- **Deployment**: Vercel with automatic deployments

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

## 🗄️ Database Schema

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

## 🎯 Key Features

### Authentication & Profiles
- Email/password authentication
- User profiles with lifetime stats
- Optional X (Twitter) handle integration
- Guest mode for quick play

### Social Features
- Share visual scorecards to X
- Global and daily leaderboards
- Percentile rankings
- Achievement system (coming soon)

## 🚧 Roadmap

### Coming Soon
- Achievement system
- Daily challenges
- Friend challenges
- PWA support
- Offline play
- Advanced analytics

## 🧪 Development

```bash
# Run tests
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

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built with:
- Next.js by Vercel
- Supabase for backend
- Tailwind CSS for styling
- Framer Motion for animations

---

**Current Version**: 1.0.0 (Production)
**Last Updated**: December 28, 2024
