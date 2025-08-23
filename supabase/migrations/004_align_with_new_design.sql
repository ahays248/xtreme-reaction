-- Migration to align database with new game design (August 2025)
-- This migration adds missing columns and updates terminology from "fakes" to "traps"

-- Add new columns to game_sessions table for better tracking
ALTER TABLE game_sessions 
ADD COLUMN IF NOT EXISTS trap_targets_hit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS game_duration INTEGER DEFAULT 60000, -- milliseconds (60 seconds default)
ADD COLUMN IF NOT EXISTS targets_shown INTEGER DEFAULT 0;

-- Update comments to reflect new terminology (traps instead of fakes)
COMMENT ON COLUMN game_sessions.incorrect_hits IS 'Number of trap targets (red circles) that were incorrectly tapped';
COMMENT ON COLUMN game_sessions.trap_targets_hit IS 'Same as incorrect_hits - number of red trap targets that were tapped';
COMMENT ON COLUMN game_sessions.game_duration IS 'Total game duration in milliseconds';
COMMENT ON COLUMN game_sessions.targets_shown IS 'Total number of targets shown (both green and red)';

-- Add new columns to profiles table for trap tracking
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS lifetime_traps_hit INTEGER DEFAULT 0;

-- Update comment on fakes_avoided columns to reflect new terminology
COMMENT ON COLUMN game_sessions.fakes_avoided IS 'Number of trap targets (red circles) successfully avoided';
COMMENT ON COLUMN profiles.fakes_avoided_total IS 'Total lifetime trap targets successfully avoided';

-- Add index for game duration queries (for finding quick games)
CREATE INDEX IF NOT EXISTS idx_game_sessions_duration ON game_sessions(game_duration);

-- Add index for targets shown (for efficiency metrics)
CREATE INDEX IF NOT EXISTS idx_game_sessions_targets ON game_sessions(targets_shown);

-- Create a view for game efficiency metrics
CREATE OR REPLACE VIEW public.game_efficiency AS
SELECT 
  gs.id,
  gs.user_id,
  p.username,
  gs.score,
  gs.successful_hits,
  gs.trap_targets_hit,
  gs.fakes_avoided as traps_avoided,
  gs.missed_cues,
  gs.targets_shown,
  gs.game_duration,
  gs.avg_reaction_time,
  CASE 
    WHEN gs.targets_shown > 0 
    THEN ROUND((gs.successful_hits::NUMERIC / gs.targets_shown) * 100, 2)
    ELSE 0 
  END as hit_rate,
  CASE
    WHEN gs.game_duration > 0
    THEN ROUND((gs.targets_shown::NUMERIC / (gs.game_duration / 1000.0)), 2)
    ELSE 0
  END as targets_per_second,
  gs.played_at
FROM game_sessions gs
JOIN profiles p ON gs.user_id = p.id
ORDER BY gs.played_at DESC;

-- Grant access to the new view
GRANT SELECT ON public.game_efficiency TO authenticated;
GRANT SELECT ON public.game_efficiency TO anon;

-- Update achievement criteria to use new terminology
UPDATE achievements 
SET criteria = jsonb_set(criteria, '{description}', '"Avoid all trap targets in a game"')
WHERE name = 'Perfect Game' 
AND criteria->>'type' = 'perfect_game';

-- Add new achievements for the redesigned game
INSERT INTO public.achievements (name, description, icon, criteria) VALUES
  ('Speed Runner', 'Complete a game in under 45 seconds', '⏱️', '{"type": "game_duration", "value": 45000, "operator": "less_than"}'),
  ('Trap Master', 'Avoid 50 trap targets in one game', '🚫', '{"type": "traps_avoided_single", "value": 50}'),
  ('Efficiency Expert', 'Achieve 90% hit rate in a game', '📊', '{"type": "hit_rate", "value": 90, "operator": "greater_than"}'),
  ('Marathon Runner', 'Play 5 games in a row', '🏃', '{"type": "consecutive_games", "value": 5}'),
  ('X Verified', 'Connect your X account', '✓', '{"type": "x_connected", "value": true}')
ON CONFLICT (name) DO NOTHING;

-- Add a function to calculate and update trap statistics
CREATE OR REPLACE FUNCTION public.update_trap_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the trap_targets_hit column to match incorrect_hits for consistency
  NEW.trap_targets_hit = NEW.incorrect_hits;
  
  -- Update profile lifetime trap stats
  UPDATE profiles
  SET 
    lifetime_traps_hit = lifetime_traps_hit + NEW.incorrect_hits,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to maintain trap statistics
CREATE TRIGGER maintain_trap_stats
  BEFORE INSERT ON game_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_trap_stats();

-- Add comment explaining the game design alignment
COMMENT ON SCHEMA public IS 'Xtreme Reaction game schema - aligned with Matrix cyberpunk theme, X-exclusive authentication, 60-second gameplay with green (regular) and red (trap) targets';