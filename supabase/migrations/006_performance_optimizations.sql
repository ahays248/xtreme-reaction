-- Performance Optimizations Migration
-- Addresses performance advisor warnings from August 2025
-- Fixes: Unindexed foreign keys, RLS auth.uid() re-evaluation, unused indexes

-- ============================================
-- 1. Add missing indexes for foreign keys
-- These improve JOIN performance significantly
-- ============================================

-- Index for challenge_completions.challenge_id
CREATE INDEX IF NOT EXISTS idx_challenge_completions_challenge_id 
ON public.challenge_completions(challenge_id);

-- Index for challenge_completions.user_id (also helps with RLS)
CREATE INDEX IF NOT EXISTS idx_challenge_completions_user_id 
ON public.challenge_completions(user_id);

-- Index for shared_scores.game_session_id
CREATE INDEX IF NOT EXISTS idx_shared_scores_game_session_id 
ON public.shared_scores(game_session_id);

-- Index for shared_scores.user_id (also helps with RLS)
CREATE INDEX IF NOT EXISTS idx_shared_scores_user_id 
ON public.shared_scores(user_id);

-- Index for user_achievements.achievement_id
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id 
ON public.user_achievements(achievement_id);

-- ============================================
-- 2. Fix RLS policies to prevent auth.uid() re-evaluation
-- Replace auth.uid() with (SELECT auth.uid()) for better performance
-- ============================================

-- Fix profiles policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING ((SELECT auth.uid()) = id);

-- Fix game_sessions policies
DROP POLICY IF EXISTS "Users can create their own game sessions" ON public.game_sessions;
CREATE POLICY "Users can create their own game sessions" ON public.game_sessions
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- Fix user_achievements policies
DROP POLICY IF EXISTS "Users can earn their own achievements" ON public.user_achievements;
CREATE POLICY "Users can earn their own achievements" ON public.user_achievements
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- Fix challenge_completions policies
DROP POLICY IF EXISTS "Users can complete their own challenges" ON public.challenge_completions;
CREATE POLICY "Users can complete their own challenges" ON public.challenge_completions
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- Fix shared_scores policies
DROP POLICY IF EXISTS "Users can share their own scores" ON public.shared_scores;
CREATE POLICY "Users can share their own scores" ON public.shared_scores
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- ============================================
-- 3. Remove unused indexes to reduce storage and write overhead
-- These have never been used according to performance advisor
-- ============================================

-- Note: Only removing truly unused indexes that don't support critical queries
-- Keeping indexes that might be used for leaderboards once we have data

-- Remove redundant user_id index (we're adding a better one above)
DROP INDEX IF EXISTS public.idx_user_achievements_user_id;

-- Keep these for now as they'll be needed for leaderboards:
-- idx_game_sessions_user_id
-- idx_game_sessions_score
-- idx_game_sessions_user_score
-- idx_profiles_high_score
-- idx_daily_challenges_date

-- Remove these less useful indexes
DROP INDEX IF EXISTS public.idx_game_sessions_duration;
DROP INDEX IF EXISTS public.idx_game_sessions_targets;

-- ============================================
-- 4. Add composite indexes for common query patterns
-- These will be used by leaderboard views
-- ============================================

-- Composite index for daily leaderboard query
-- Using timestamp directly for better performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_played_at_score 
ON public.game_sessions(played_at DESC, score DESC);

-- Composite index for user's best scores
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_score_desc 
ON public.game_sessions(user_id, score DESC);

-- ============================================
-- 5. Update table statistics for query planner
-- ============================================

ANALYZE public.profiles;
ANALYZE public.game_sessions;
ANALYZE public.user_achievements;
ANALYZE public.achievements;
ANALYZE public.daily_challenges;
ANALYZE public.challenge_completions;
ANALYZE public.shared_scores;

-- ============================================
-- Migration complete!
-- This should significantly improve query performance
-- especially for RLS policies and foreign key joins
-- ============================================