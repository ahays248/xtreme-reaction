import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Singleton instance to prevent multiple GoTrueClient warnings
let clientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Create a single Supabase client instance for the browser
// This prevents the "Multiple GoTrueClient instances" warning
export function createClient() {
  // Only create a new instance if we're on the server or don't have one yet
  if (typeof window === 'undefined') {
    // Server-side: always create a new instance
    return createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  
  // Client-side: use singleton pattern
  if (!clientInstance) {
    clientInstance = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  
  return clientInstance
}