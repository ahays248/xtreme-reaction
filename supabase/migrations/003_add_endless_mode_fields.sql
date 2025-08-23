-- Add rounds_survived column to game_sessions table
ALTER TABLE game_sessions 
ADD COLUMN IF NOT EXISTS rounds_survived INTEGER DEFAULT 0;

-- Add max_streak column to game_sessions table
ALTER TABLE game_sessions
ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0;

-- Add best_streak column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0;

-- Add most_rounds_survived column to profiles table  
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS most_rounds_survived INTEGER DEFAULT 0;

-- Add comment to explain new columns
COMMENT ON COLUMN game_sessions.rounds_survived IS 'Number of rounds completed in endless mode';
COMMENT ON COLUMN game_sessions.max_streak IS 'Best streak of correct actions in this game';
COMMENT ON COLUMN profiles.best_streak IS 'Best streak ever achieved across all games';
COMMENT ON COLUMN profiles.most_rounds_survived IS 'Most rounds survived in a single game';