export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          criteria: Json
          description: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          criteria: Json
          description: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          description?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      challenge_completions: {
        Row: {
          challenge_id: string | null
          completed_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_completions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_time_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "challenge_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "daily_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "challenge_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          challenge_date: string
          created_at: string | null
          description: string
          id: string
          target_metric: string
          target_value: number
          title: string
        }
        Insert: {
          challenge_date?: string
          created_at?: string | null
          description: string
          id?: string
          target_metric: string
          target_value: number
          title: string
        }
        Update: {
          challenge_date?: string
          created_at?: string | null
          description?: string
          id?: string
          target_metric?: string
          target_value?: number
          title?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          accuracy: number | null
          avg_reaction_time: number
          difficulty_reached: number | null
          fakes_avoided: number | null
          game_duration: number | null
          id: string
          incorrect_hits: number
          max_streak: number | null
          missed_cues: number
          played_at: string | null
          rounds_survived: number | null
          score: number
          successful_hits: number
          targets_shown: number | null
          total_clicks: number | null
          trap_targets_hit: number | null
          user_id: string | null
        }
        Insert: {
          accuracy?: number | null
          avg_reaction_time: number
          difficulty_reached?: number | null
          fakes_avoided?: number | null
          game_duration?: number | null
          id?: string
          incorrect_hits: number
          max_streak?: number | null
          missed_cues: number
          played_at?: string | null
          rounds_survived?: number | null
          score: number
          successful_hits: number
          targets_shown?: number | null
          total_clicks?: number | null
          trap_targets_hit?: number | null
          user_id?: string | null
        }
        Update: {
          accuracy?: number | null
          avg_reaction_time?: number
          difficulty_reached?: number | null
          fakes_avoided?: number | null
          game_duration?: number | null
          id?: string
          incorrect_hits?: number
          max_streak?: number | null
          missed_cues?: number
          played_at?: string | null
          rounds_survived?: number | null
          score?: number
          successful_hits?: number
          targets_shown?: number | null
          total_clicks?: number | null
          trap_targets_hit?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_time_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "daily_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          best_accuracy: number | null
          best_reaction_time: number | null
          best_streak: number | null
          created_at: string | null
          fakes_avoided_total: number | null
          high_score: number | null
          id: string
          lifetime_hits: number | null
          lifetime_misses: number | null
          lifetime_traps_hit: number | null
          most_rounds_survived: number | null
          overall_accuracy: number | null
          total_clicks: number | null
          total_errors: number | null
          total_games: number | null
          updated_at: string | null
          username: string
          x_username: string | null
        }
        Insert: {
          best_accuracy?: number | null
          best_reaction_time?: number | null
          best_streak?: number | null
          created_at?: string | null
          fakes_avoided_total?: number | null
          high_score?: number | null
          id: string
          lifetime_hits?: number | null
          lifetime_misses?: number | null
          lifetime_traps_hit?: number | null
          most_rounds_survived?: number | null
          overall_accuracy?: number | null
          total_clicks?: number | null
          total_errors?: number | null
          total_games?: number | null
          updated_at?: string | null
          username: string
          x_username?: string | null
        }
        Update: {
          best_accuracy?: number | null
          best_reaction_time?: number | null
          best_streak?: number | null
          created_at?: string | null
          fakes_avoided_total?: number | null
          high_score?: number | null
          id?: string
          lifetime_hits?: number | null
          lifetime_misses?: number | null
          lifetime_traps_hit?: number | null
          most_rounds_survived?: number | null
          overall_accuracy?: number | null
          total_clicks?: number | null
          total_errors?: number | null
          total_games?: number | null
          updated_at?: string | null
          username?: string
          x_username?: string | null
        }
        Relationships: []
      }
      shared_scores: {
        Row: {
          game_session_id: string | null
          id: string
          share_text: string | null
          shared_at: string | null
          user_id: string | null
          x_post_id: string | null
        }
        Insert: {
          game_session_id?: string | null
          id?: string
          share_text?: string | null
          shared_at?: string | null
          user_id?: string | null
          x_post_id?: string | null
        }
        Update: {
          game_session_id?: string | null
          id?: string
          share_text?: string | null
          shared_at?: string | null
          user_id?: string | null
          x_post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_scores_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_efficiency"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_scores_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_time_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "shared_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "daily_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "shared_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_time_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "daily_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      all_time_leaderboard: {
        Row: {
          best_reaction_time: number | null
          best_score: number | null
          lifetime_hits: number | null
          lifetime_misses: number | null
          total_games: number | null
          user_id: string | null
          username: string | null
          x_username: string | null
        }
        Relationships: []
      }
      daily_leaderboard: {
        Row: {
          best_reaction_time: number | null
          best_score: number | null
          games_today: number | null
          user_id: string | null
          username: string | null
          x_username: string | null
        }
        Relationships: []
      }
      game_efficiency: {
        Row: {
          avg_reaction_time: number | null
          game_duration: number | null
          hit_rate: number | null
          id: string | null
          missed_cues: number | null
          played_at: string | null
          score: number | null
          successful_hits: number | null
          targets_per_second: number | null
          targets_shown: number | null
          trap_targets_hit: number | null
          traps_avoided: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "all_time_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "daily_leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const