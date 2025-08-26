-- Security Fixes Migration
-- Addresses security advisor warnings from August 2025
-- Fixes: SECURITY DEFINER views, RLS disabled tables, function search paths

-- ============================================
-- 1. Fix SECURITY DEFINER views
-- Change to SECURITY INVOKER to respect RLS
-- ============================================

-- Drop and recreate all_time_leaderboard view with SECURITY INVOKER
DROP VIEW IF EXISTS public.all_time_leaderboard CASCADE;
CREATE VIEW public.all_time_leaderboard WITH (security_invoker = true) AS
SELECT p.id AS user_id,
    p.username,
    p.x_username,
    p.best_reaction_time,
    max(gs.score) AS best_score,
    p.total_games,
    p.lifetime_hits,
    p.lifetime_misses
FROM profiles p
    LEFT JOIN game_sessions gs ON p.id = gs.user_id
GROUP BY p.id, p.username, p.x_username, p.best_reaction_time, p.total_games, p.lifetime_hits, p.lifetime_misses
ORDER BY (max(gs.score)) DESC NULLS LAST, p.best_reaction_time;

-- Drop and recreate daily_leaderboard view with SECURITY INVOKER
DROP VIEW IF EXISTS public.daily_leaderboard CASCADE;
CREATE VIEW public.daily_leaderboard WITH (security_invoker = true) AS
SELECT p.id AS user_id,
    p.username,
    p.x_username,
    max(gs.score) AS best_score,
    min(gs.avg_reaction_time) AS best_reaction_time,
    count(gs.id) AS games_today
FROM profiles p
    JOIN game_sessions gs ON p.id = gs.user_id
WHERE date(gs.played_at) = CURRENT_DATE
GROUP BY p.id, p.username, p.x_username
ORDER BY (max(gs.score)) DESC, (min(gs.avg_reaction_time));

-- Drop and recreate game_efficiency view with SECURITY INVOKER
DROP VIEW IF EXISTS public.game_efficiency CASCADE;
CREATE VIEW public.game_efficiency WITH (security_invoker = true) AS
SELECT gs.id,
    gs.user_id,
    p.username,
    gs.score,
    gs.successful_hits,
    gs.trap_targets_hit,
    gs.fakes_avoided AS traps_avoided,
    gs.missed_cues,
    gs.targets_shown,
    gs.game_duration,
    gs.avg_reaction_time,
    CASE
        WHEN gs.targets_shown > 0 THEN round(gs.successful_hits::numeric / gs.targets_shown::numeric * 100::numeric, 2)
        ELSE 0::numeric
    END AS hit_rate,
    CASE
        WHEN gs.game_duration > 0 THEN round(gs.targets_shown::numeric / (gs.game_duration::numeric / 1000.0), 2)
        ELSE 0::numeric
    END AS targets_per_second,
    gs.played_at
FROM game_sessions gs
    JOIN profiles p ON gs.user_id = p.id
ORDER BY gs.played_at DESC;

-- ============================================
-- 2. Enable RLS on public tables
-- ============================================

-- Enable RLS on achievements table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Enable RLS on daily_challenges table
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Add RLS policies for proper access control
-- ============================================

-- Achievements: Everyone can read (they're public game achievements)
CREATE POLICY "Achievements are viewable by everyone"
ON public.achievements 
FOR SELECT
USING (true);

-- Daily challenges: Everyone can read (they're public challenges)
CREATE POLICY "Daily challenges are viewable by everyone"
ON public.daily_challenges 
FOR SELECT
USING (true);

-- ============================================
-- 4. Fix function search paths
-- Add explicit search_path to prevent injection
-- ============================================

-- Fix update_trap_stats function
ALTER FUNCTION public.update_trap_stats()
SET search_path = public, pg_catalog;

-- Fix handle_new_user function
ALTER FUNCTION public.handle_new_user()
SET search_path = public, auth, pg_catalog;

-- Fix update_profile_stats function
ALTER FUNCTION public.update_profile_stats()
SET search_path = public, pg_catalog;

-- ============================================
-- 5. Grant appropriate permissions for views
-- ============================================

-- Grant SELECT on views to authenticated and anon users
GRANT SELECT ON public.all_time_leaderboard TO authenticated, anon;
GRANT SELECT ON public.daily_leaderboard TO authenticated, anon;
GRANT SELECT ON public.game_efficiency TO authenticated;

-- ============================================
-- Migration complete!
-- This fixes all SQL-related security warnings.
-- Note: OTP expiry must be fixed in Supabase Dashboard Auth settings
-- ============================================