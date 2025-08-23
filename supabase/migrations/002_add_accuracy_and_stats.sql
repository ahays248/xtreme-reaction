-- Add accuracy column to game_sessions table
ALTER TABLE game_sessions 
ADD COLUMN IF NOT EXISTS accuracy INTEGER DEFAULT 0;

-- Add fakes_avoided column to game_sessions table to track red circles avoided
ALTER TABLE game_sessions
ADD COLUMN IF NOT EXISTS fakes_avoided INTEGER DEFAULT 0;

-- Add total_clicks column to track all clicks for accuracy calculation
ALTER TABLE game_sessions
ADD COLUMN IF NOT EXISTS total_clicks INTEGER DEFAULT 0;

-- Add high_score column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS high_score INTEGER DEFAULT 0;

-- Add overall_accuracy column to profiles table (stored as percentage 0-100)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS overall_accuracy INTEGER DEFAULT 0;

-- Add total_errors column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS total_errors INTEGER DEFAULT 0;

-- Add fakes_avoided_total column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS fakes_avoided_total INTEGER DEFAULT 0;

-- Add total_clicks column to profiles table for overall accuracy calculation
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS total_clicks INTEGER DEFAULT 0;

-- Add best_accuracy column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS best_accuracy INTEGER DEFAULT 0;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_score ON game_sessions(user_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_played_at ON game_sessions(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_high_score ON profiles(high_score DESC);

-- Add comment to explain accuracy calculation
COMMENT ON COLUMN game_sessions.accuracy IS 'Click accuracy percentage (0-100) calculated as (successful_hits / total_clicks) * 100';
COMMENT ON COLUMN profiles.overall_accuracy IS 'Lifetime click accuracy percentage across all games';
COMMENT ON COLUMN profiles.total_errors IS 'Total lifetime errors (incorrect_hits + missed_cues)';