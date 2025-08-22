-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  x_username TEXT,
  total_games INTEGER DEFAULT 0,
  lifetime_hits INTEGER DEFAULT 0,
  lifetime_misses INTEGER DEFAULT 0,
  best_reaction_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create game sessions table
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  avg_reaction_time INTEGER NOT NULL,
  successful_hits INTEGER NOT NULL,
  incorrect_hits INTEGER NOT NULL,
  missed_cues INTEGER NOT NULL,
  difficulty_reached INTEGER DEFAULT 1,
  score INTEGER NOT NULL,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  criteria JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create daily challenges table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_metric TEXT NOT NULL, -- e.g., 'reaction_time', 'accuracy', 'score'
  target_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create challenge completions table
CREATE TABLE IF NOT EXISTS public.challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Create shared scores table (for tracking X shares)
CREATE TABLE IF NOT EXISTS public.shared_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_session_id UUID REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  x_post_id TEXT,
  share_text TEXT,
  shared_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_played_at ON public.game_sessions(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_score ON public.game_sessions(score DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON public.daily_challenges(challenge_date);

-- Create view for daily leaderboard
CREATE OR REPLACE VIEW public.daily_leaderboard AS
SELECT 
  p.id AS user_id,
  p.username,
  p.x_username,
  MAX(gs.score) AS best_score,
  MIN(gs.avg_reaction_time) AS best_reaction_time,
  COUNT(gs.id) AS games_today
FROM public.profiles p
INNER JOIN public.game_sessions gs ON p.id = gs.user_id
WHERE DATE(gs.played_at) = CURRENT_DATE
GROUP BY p.id, p.username, p.x_username
ORDER BY best_score DESC, best_reaction_time ASC;

-- Create view for all-time leaderboard
CREATE OR REPLACE VIEW public.all_time_leaderboard AS
SELECT 
  p.id AS user_id,
  p.username,
  p.x_username,
  p.best_reaction_time,
  MAX(gs.score) AS best_score,
  p.total_games,
  p.lifetime_hits,
  p.lifetime_misses
FROM public.profiles p
LEFT JOIN public.game_sessions gs ON p.id = gs.user_id
GROUP BY p.id, p.username, p.x_username, p.best_reaction_time, p.total_games, p.lifetime_hits, p.lifetime_misses
ORDER BY best_score DESC NULLS LAST, p.best_reaction_time ASC NULLS LAST;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Game sessions: Users can read all sessions but only create their own
CREATE POLICY "Game sessions are viewable by everyone" ON public.game_sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own game sessions" ON public.game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User achievements: Users can read all but only earn their own
CREATE POLICY "Achievements are viewable by everyone" ON public.user_achievements
  FOR SELECT USING (true);

CREATE POLICY "Users can earn their own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Challenge completions: Users can read all but only complete their own
CREATE POLICY "Challenge completions are viewable by everyone" ON public.challenge_completions
  FOR SELECT USING (true);

CREATE POLICY "Users can complete their own challenges" ON public.challenge_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shared scores: Users can read all but only share their own
CREATE POLICY "Shared scores are viewable by everyone" ON public.shared_scores
  FOR SELECT USING (true);

CREATE POLICY "Users can share their own scores" ON public.shared_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, x_username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'username'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update profile stats after game session
CREATE OR REPLACE FUNCTION public.update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET 
    total_games = total_games + 1,
    lifetime_hits = lifetime_hits + NEW.successful_hits,
    lifetime_misses = lifetime_misses + NEW.incorrect_hits + NEW.missed_cues,
    best_reaction_time = LEAST(COALESCE(best_reaction_time, NEW.avg_reaction_time), NEW.avg_reaction_time),
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profile stats
CREATE TRIGGER update_profile_after_game
  AFTER INSERT ON public.game_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_stats();

-- Insert some default achievements
INSERT INTO public.achievements (name, description, icon, criteria) VALUES
  ('First Game', 'Complete your first game', '🎮', '{"type": "games_played", "value": 1}'),
  ('Speed Demon', 'Achieve average reaction time under 250ms', '⚡', '{"type": "reaction_time", "value": 250}'),
  ('Perfect Game', 'Complete a game with no misses', '🎯', '{"type": "perfect_game", "value": true}'),
  ('Consistent Player', 'Play 10 games', '🏆', '{"type": "games_played", "value": 10}'),
  ('Daily Warrior', 'Complete a daily challenge', '📅', '{"type": "daily_challenge", "value": 1}'),
  ('Sharing is Caring', 'Share your score on X', '🐦', '{"type": "shared_score", "value": 1}'),
  ('Top 10', 'Reach the top 10 on daily leaderboard', '🥇', '{"type": "leaderboard_rank", "value": 10}')
ON CONFLICT (name) DO NOTHING;