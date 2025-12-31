# Supabase Directory - Database Configuration

## Overview
Database schema, migrations, and Supabase-specific configuration for the Xtreme Reaction game.

## Project Details
- **Project URL**: https://xhcfjhzfyozzuicubqmh.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/xhcfjhzfyozzuicubqmh
- **Region**: us-east-2

## Database Schema

### Core Tables

#### profiles
Extends auth.users with game-specific data:
- `id`: UUID (references auth.users)
- `username`: Unique username
- `x_username`: Twitter/X handle
- `total_games`: Lifetime game count
- `lifetime_hits`: Total successful taps
- `lifetime_misses`: Total errors
- `best_reaction_time`: Personal record (ms)

#### game_sessions
Individual game records:
- `id`: UUID
- `user_id`: References profiles
- `avg_reaction_time`: Average for the game (ms)
- `successful_hits`: Correct taps count
- `incorrect_hits`: Wrong taps count
- `missed_cues`: Timeouts count
- `difficulty_reached`: Max difficulty level
- `score`: Final calculated score
- `played_at`: Timestamp

#### achievements
Achievement definitions:
- `id`: UUID
- `name`: Unique achievement name
- `description`: What it's for
- `icon`: Emoji or image
- `criteria`: JSON rules for earning

#### user_achievements
Tracks earned achievements:
- `user_id`: References profiles
- `achievement_id`: References achievements
- `earned_at`: When earned

#### daily_challenges
Daily challenge configurations:
- `challenge_date`: Unique date
- `title`: Challenge name
- `description`: Challenge details
- `target_metric`: What to measure
- `target_value`: Goal to reach

### Database Views

#### daily_leaderboard
Today's top players with:
- Best score
- Best reaction time
- Games played today

#### all_time_leaderboard
All-time rankings with:
- Best score ever
- Best reaction time
- Total games
- Lifetime stats

## Security

### Row Level Security (RLS)
All tables have RLS enabled with policies:
- **Read**: Everyone can view all data
- **Write**: Users can only modify their own data
- **Insert**: Users can only create their own records

### Policies Example
```sql
-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

## Migrations

### Migration Files
1. **001_initial_schema.sql** - Initial database setup with all core tables
2. **002_add_accuracy_and_stats.sql** - Added accuracy tracking columns
3. **003_add_endless_mode_fields.sql** - Support for endless mode (not in current design)
4. **004_align_with_new_design.sql** - ⭐ LATEST - Aligns with incremental development plan

### Latest Migration (004) Changes
- Adds `trap_targets_hit`, `game_duration`, `targets_shown` columns
- Creates `game_efficiency` view for analytics
- Updates terminology from "fakes" to "traps"
- Adds new achievements aligned with game design
- Creates function to maintain trap statistics

### Running Migrations
```bash
# Login first (get token from https://supabase.com/dashboard/account/tokens)
~/.local/bin/supabase login --token <YOUR_SUPABASE_ACCESS_TOKEN>

# Apply all pending migrations
~/.local/bin/supabase db push --project-ref xhcfjhzfyozzuicubqmh

# Or through dashboard
# Go to SQL Editor and paste migration content
```

### IMPORTANT: Database Philosophy
Following our incremental development approach:
- Database is already designed and ready (migrations 001-004)
- Don't modify schema until Phase 13 of implementation
- All tables support the features we'll build incrementally
- RLS policies ensure security from day one

## Triggers & Functions

### handle_new_user()
Automatically creates profile when user signs up:
```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### update_profile_stats()
Updates lifetime stats after each game:
```sql
CREATE TRIGGER update_profile_after_game
AFTER INSERT ON game_sessions
FOR EACH ROW EXECUTE FUNCTION update_profile_stats();
```

## Default Achievements
Pre-populated achievements:
- **First Game**: Complete your first game
- **Speed Demon**: < 250ms average reaction
- **Perfect Game**: No misses in a game
- **Consistent Player**: Play 10 games
- **Daily Warrior**: Complete daily challenge
- **Sharing is Caring**: Share score on X
- **Top 10**: Reach daily leaderboard top 10

## Authentication Setup

### X (Twitter) OAuth
To enable X login:
1. Go to Supabase Dashboard > Authentication
2. Click on Providers
3. Enable Twitter
4. Add credentials from X Developer Portal:
   - API Key (Client ID)
   - API Secret (Client Secret)
5. Set callback URL: `https://xhcfjhzfyozzuicubqmh.supabase.co/auth/v1/callback`

## Common Queries

### Get User Profile
```sql
SELECT * FROM profiles 
WHERE id = auth.uid();
```

### Save Game Session
```sql
INSERT INTO game_sessions (
  user_id, avg_reaction_time, score, ...
) VALUES (
  auth.uid(), 250, 1500, ...
);
```

### Get Daily Leaderboard
```sql
SELECT * FROM daily_leaderboard 
LIMIT 10;
```

### Check Achievements
```sql
SELECT a.* 
FROM achievements a
LEFT JOIN user_achievements ua 
  ON a.id = ua.achievement_id 
  AND ua.user_id = auth.uid()
WHERE ua.id IS NULL;
```

## Performance Optimizations
- Indexes on foreign keys
- Indexes on frequently queried columns
- Materialized views for complex queries
- Partial indexes for filtered queries

## Backup & Recovery
- Automatic daily backups by Supabase
- Point-in-time recovery available
- Can export data via pg_dump

## Monitoring
- Check Dashboard > Database for:
  - Query performance
  - Table sizes
  - Connection pool status
  - Slow queries

## Future Enhancements
- Add tournament_brackets table
- Create match_history for PvP
- Add user_settings for preferences
- Implement friend_connections
- Add notification_queue for achievements
- Create analytics_events for tracking

## Troubleshooting

### Connection Issues
```bash
# Test connection
~/.local/bin/supabase status --project-ref xhcfjhzfyozzuicubqmh

# Reset password if needed
# Go to Dashboard > Settings > Database
```

### Migration Errors
- Check for syntax errors
- Ensure tables don't already exist
- Verify foreign key references
- Check RLS policies don't conflict

## Local Development
To run Supabase locally:
```bash
~/.local/bin/supabase start
# Creates local PostgreSQL at localhost:54321
```