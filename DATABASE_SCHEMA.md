# Xtreme Reaction - Database Schema Documentation
**Last Updated**: August 23, 2025  
**Database**: Supabase (PostgreSQL)  
**Project ID**: xhcfjhzfyozzuicubqmh

---

## Overview
This document describes the current database schema for Xtreme Reaction, including all tables, views, functions, and triggers. The schema has been aligned with the new game design focusing on X-exclusive authentication and 60-second gameplay.

---

## Core Tables

### profiles
Extends Supabase auth.users with game-specific data.

| Column | Type | Description | Default |
|--------|------|-------------|---------|
| id | UUID | Primary key, references auth.users | - |
| username | TEXT | Unique username | Required |
| x_username | TEXT | X (Twitter) handle | NULL |
| total_games | INTEGER | Lifetime game count | 0 |
| lifetime_hits | INTEGER | Total successful taps | 0 |
| lifetime_misses | INTEGER | Total errors (incorrect + missed) | 0 |
| lifetime_traps_hit | INTEGER | Total trap targets hit | 0 |
| best_reaction_time | INTEGER | Personal record in ms | NULL |
| high_score | INTEGER | Best score ever achieved | 0 |
| overall_accuracy | INTEGER | Lifetime accuracy (0-100) | 0 |
| total_errors | INTEGER | Total lifetime errors | 0 |
| fakes_avoided_total | INTEGER | Total traps avoided (legacy name) | 0 |
| total_clicks | INTEGER | Total clicks for accuracy calc | 0 |
| best_accuracy | INTEGER | Best accuracy in single game | 0 |
| created_at | TIMESTAMPTZ | Account creation | NOW() |
| updated_at | TIMESTAMPTZ | Last profile update | NOW() |

**Indexes:**
- Primary key on `id`
- Unique index on `username`
- Index on `high_score DESC`

---

### game_sessions
Records individual game performances.

| Column | Type | Description | Default |
|--------|------|-------------|---------|
| id | UUID | Primary key | gen_random_uuid() |
| user_id | UUID | References profiles.id | Required |
| avg_reaction_time | INTEGER | Average reaction in ms | Required |
| successful_hits | INTEGER | Green targets hit | Required |
| incorrect_hits | INTEGER | Red targets hit (errors) | Required |
| trap_targets_hit | INTEGER | Same as incorrect_hits | 0 |
| missed_cues | INTEGER | Timeouts | Required |
| difficulty_reached | INTEGER | Max difficulty level | 1 |
| score | INTEGER | Final calculated score | Required |
| accuracy | INTEGER | Hit accuracy (0-100) | 0 |
| fakes_avoided | INTEGER | Red targets avoided | 0 |
| total_clicks | INTEGER | All clicks for accuracy | 0 |
| game_duration | INTEGER | Game length in ms | 60000 |
| targets_shown | INTEGER | Total targets displayed | 0 |
| played_at | TIMESTAMPTZ | When game was played | NOW() |

**Indexes:**
- Primary key on `id`
- Foreign key index on `user_id`
- Index on `played_at DESC`
- Index on `score DESC`
- Index on `user_id, score DESC`
- Index on `game_duration`
- Index on `targets_shown`

---

### achievements
Achievement definitions for the game.

| Column | Type | Description | Default |
|--------|------|-------------|---------|
| id | UUID | Primary key | gen_random_uuid() |
| name | TEXT | Unique achievement name | Required |
| description | TEXT | What it's for | Required |
| icon | TEXT | Emoji or image URL | NULL |
| criteria | JSONB | Rules for earning | Required |
| created_at | TIMESTAMPTZ | When created | NOW() |

**Current Achievements:**
1. **First Game** - Complete your first game
2. **Speed Demon** - Average reaction < 250ms
3. **Perfect Game** - No misses (avoid all traps)
4. **Consistent Player** - Play 10 games
5. **Daily Warrior** - Complete daily challenge
6. **Sharing is Caring** - Share score on X
7. **Top 10** - Reach daily leaderboard top 10
8. **Speed Runner** - Complete game in < 45 seconds
9. **Trap Master** - Avoid 50 traps in one game
10. **Efficiency Expert** - Achieve 90% hit rate
11. **Marathon Runner** - Play 5 games in a row
12. **X Verified** - Connect X account

---

### user_achievements
Tracks which achievements users have earned.

| Column | Type | Description | Default |
|--------|------|-------------|---------|
| id | UUID | Primary key | gen_random_uuid() |
| user_id | UUID | References profiles.id | Required |
| achievement_id | UUID | References achievements.id | Required |
| earned_at | TIMESTAMPTZ | When earned | NOW() |

**Constraints:**
- Unique on (user_id, achievement_id)

---

### daily_challenges
Daily challenge configurations.

| Column | Type | Description | Default |
|--------|------|-------------|---------|
| id | UUID | Primary key | gen_random_uuid() |
| challenge_date | DATE | Unique date | CURRENT_DATE |
| title | TEXT | Challenge name | Required |
| description | TEXT | Challenge details | Required |
| target_metric | TEXT | What to measure | Required |
| target_value | INTEGER | Goal to reach | Required |
| created_at | TIMESTAMPTZ | When created | NOW() |

**Example Metrics:**
- `reaction_time` - Beat X ms average
- `accuracy` - Achieve X% accuracy
- `score` - Score over X points
- `traps_avoided` - Avoid X trap targets

---

### challenge_completions
Tracks who completed daily challenges.

| Column | Type | Description | Default |
|--------|------|-------------|---------|
| id | UUID | Primary key | gen_random_uuid() |
| user_id | UUID | References profiles.id | Required |
| challenge_id | UUID | References daily_challenges.id | Required |
| completed_at | TIMESTAMPTZ | When completed | NOW() |

**Constraints:**
- Unique on (user_id, challenge_id)

---

### shared_scores
Tracks X shares for viral metrics.

| Column | Type | Description | Default |
|--------|------|-------------|---------|
| id | UUID | Primary key | gen_random_uuid() |
| user_id | UUID | References profiles.id | Required |
| game_session_id | UUID | References game_sessions.id | Required |
| x_post_id | TEXT | X post identifier | NULL |
| share_text | TEXT | Text shared to X | NULL |
| shared_at | TIMESTAMPTZ | When shared | NOW() |

---

## Database Views

### daily_leaderboard
Today's top players with real-time rankings.

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | Player's ID |
| username | TEXT | Display name |
| x_username | TEXT | X handle |
| best_score | INTEGER | Best score today |
| best_reaction_time | INTEGER | Fastest reaction today |
| games_today | INTEGER | Games played today |

**Ordering:** By best_score DESC, then best_reaction_time ASC

---

### all_time_leaderboard
Historical best performances.

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | Player's ID |
| username | TEXT | Display name |
| x_username | TEXT | X handle |
| best_reaction_time | INTEGER | Lifetime best reaction |
| best_score | INTEGER | Lifetime best score |
| total_games | INTEGER | Games played |
| lifetime_hits | INTEGER | Total successful hits |
| lifetime_misses | INTEGER | Total errors |

**Ordering:** By best_score DESC, then best_reaction_time ASC

---

### game_efficiency (NEW)
Performance metrics view for analytics.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Game session ID |
| user_id | UUID | Player's ID |
| username | TEXT | Display name |
| score | INTEGER | Game score |
| successful_hits | INTEGER | Green targets hit |
| trap_targets_hit | INTEGER | Red targets hit |
| traps_avoided | INTEGER | Red targets avoided |
| missed_cues | INTEGER | Timeouts |
| targets_shown | INTEGER | Total targets |
| game_duration | INTEGER | Game length (ms) |
| avg_reaction_time | INTEGER | Average reaction (ms) |
| hit_rate | NUMERIC | Success percentage |
| targets_per_second | NUMERIC | Speed metric |
| played_at | TIMESTAMPTZ | When played |

---

## Database Functions

### handle_new_user()
**Trigger:** on_auth_user_created  
**Purpose:** Automatically creates profile when user signs up via X OAuth

```sql
-- Creates profile with X username from OAuth metadata
INSERT INTO profiles (id, username, x_username)
VALUES (
  NEW.id,
  COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
  NEW.raw_user_meta_data->>'username'
);
```

---

### update_profile_stats()
**Trigger:** update_profile_after_game  
**Purpose:** Updates lifetime stats after each game

Updates:
- `total_games` += 1
- `lifetime_hits` += successful_hits
- `lifetime_misses` += (incorrect_hits + missed_cues)
- `best_reaction_time` = MIN(current, new)
- `high_score` = MAX(current, new)
- `overall_accuracy` = recalculated
- `updated_at` = NOW()

---

### update_trap_stats() (NEW)
**Trigger:** maintain_trap_stats  
**Purpose:** Maintains trap/fake terminology consistency

Actions:
- Sets `trap_targets_hit` = `incorrect_hits`
- Updates `lifetime_traps_hit` in profiles
- Maintains backward compatibility

---

## Row Level Security (RLS)

All tables have RLS enabled with these policies:

### Read Policies (SELECT)
- **All tables**: Everyone can read all data
- **Purpose**: Public leaderboards and profiles

### Write Policies (INSERT/UPDATE)
- **profiles**: Users can only modify their own profile
- **game_sessions**: Users can only create their own sessions
- **user_achievements**: Users can only earn their own achievements
- **challenge_completions**: Users can only complete their own challenges
- **shared_scores**: Users can only share their own scores

### Security Model
```sql
-- Example: Users can only update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

---

## Migration History

| Migration | Date | Description |
|-----------|------|-------------|
| 001_initial_schema.sql | Aug 2025 | Initial database setup |
| 002_add_accuracy_and_stats.sql | Aug 2025 | Added accuracy tracking |
| 003_add_endless_mode_fields.sql | Aug 2025 | Endless mode support |
| 004_align_with_new_design.sql | Aug 23, 2025 | Align with new game design |

---

## Performance Considerations

### Indexes Strategy
- Foreign keys are auto-indexed
- Composite indexes for common queries
- Partial indexes for filtered queries
- BRIN indexes for time-series data

### Query Optimization
- Views pre-calculate complex joins
- Triggers maintain denormalized stats
- Connection pooling via Supabase
- Prepared statements for common queries

### Scaling Considerations
- Partitioning ready for game_sessions by month
- Archival strategy for old sessions
- Read replicas for leaderboard queries
- CDN for static achievement icons

---

## Database Access

### Connection Details
- **Host**: xhcfjhzfyozzuicubqmh.supabase.co
- **Port**: 5432 (PostgreSQL) / 443 (PostgREST)
- **Database**: postgres
- **Schema**: public

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xhcfjhzfyozzuicubqmh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_key>
```

### TypeScript Types
Generate with:
```bash
npx supabase gen types typescript --project-id xhcfjhzfyozzuicubqmh > lib/supabase/types.ts
```

---

## Backup & Recovery

### Automatic Backups
- Daily snapshots by Supabase
- 7-day retention (free tier)
- Point-in-time recovery available

### Manual Backup
```bash
# Export schema
pg_dump --schema-only

# Export data
pg_dump --data-only

# Full backup
pg_dump --clean --if-exists
```

---

## Future Enhancements

### Planned Tables
- `tournaments` - Special competitive events
- `tournament_entries` - Player registrations
- `match_history` - Head-to-head results
- `user_settings` - Preferences and config
- `friend_connections` - Social features
- `notification_queue` - Achievement alerts

### Planned Features
- Real-time multiplayer via Supabase Realtime
- Advanced analytics with TimescaleDB
- Machine learning for cheat detection
- Geographic leaderboards
- Seasonal rankings reset

---

## Monitoring & Maintenance

### Key Metrics
- Query performance (< 100ms target)
- Connection pool usage (< 80%)
- Table sizes and growth rate
- Index usage statistics

### Regular Tasks
- VACUUM ANALYZE weekly
- REINDEX monthly
- Archive old game_sessions quarterly
- Review slow query log weekly

---

**Note**: This schema is optimized for the new game design with X-exclusive authentication, 60-second gameplay, and viral sharing mechanics. All legacy "fake" terminology is being migrated to "trap" for consistency.