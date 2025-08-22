export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          x_username: string | null
          total_games: number
          lifetime_hits: number
          lifetime_misses: number
          best_reaction_time: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          x_username?: string | null
          total_games?: number
          lifetime_hits?: number
          lifetime_misses?: number
          best_reaction_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          x_username?: string | null
          total_games?: number
          lifetime_hits?: number
          lifetime_misses?: number
          best_reaction_time?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string | null
          avg_reaction_time: number
          successful_hits: number
          incorrect_hits: number
          missed_cues: number
          difficulty_reached: number
          score: number
          played_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          avg_reaction_time: number
          successful_hits: number
          incorrect_hits: number
          missed_cues: number
          difficulty_reached?: number
          score: number
          played_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          avg_reaction_time?: number
          successful_hits?: number
          incorrect_hits?: number
          missed_cues?: number
          difficulty_reached?: number
          score?: number
          played_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string | null
          criteria: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon?: string | null
          criteria: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string | null
          criteria?: Json
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string | null
          achievement_id: string | null
          earned_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          achievement_id?: string | null
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          achievement_id?: string | null
          earned_at?: string
        }
      }
      daily_challenges: {
        Row: {
          id: string
          challenge_date: string
          title: string
          description: string
          target_metric: string
          target_value: number
          created_at: string
        }
        Insert: {
          id?: string
          challenge_date?: string
          title: string
          description: string
          target_metric: string
          target_value: number
          created_at?: string
        }
        Update: {
          id?: string
          challenge_date?: string
          title?: string
          description?: string
          target_metric?: string
          target_value?: number
          created_at?: string
        }
      }
      challenge_completions: {
        Row: {
          id: string
          user_id: string | null
          challenge_id: string | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          challenge_id?: string | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          challenge_id?: string | null
          completed_at?: string
        }
      }
      shared_scores: {
        Row: {
          id: string
          user_id: string | null
          game_session_id: string | null
          x_post_id: string | null
          share_text: string | null
          shared_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          game_session_id?: string | null
          x_post_id?: string | null
          share_text?: string | null
          shared_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          game_session_id?: string | null
          x_post_id?: string | null
          share_text?: string | null
          shared_at?: string
        }
      }
    }
    Views: {
      daily_leaderboard: {
        Row: {
          user_id: string | null
          username: string | null
          x_username: string | null
          best_score: number | null
          best_reaction_time: number | null
          games_today: number | null
        }
      }
      all_time_leaderboard: {
        Row: {
          user_id: string | null
          username: string | null
          x_username: string | null
          best_reaction_time: number | null
          best_score: number | null
          total_games: number | null
          lifetime_hits: number | null
          lifetime_misses: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}