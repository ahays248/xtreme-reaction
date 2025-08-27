import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Singleton instance to prevent multiple GoTrueClient warnings
let clientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Hardcode values as fallback if env vars fail to load
// These are public keys, safe to expose
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xhcfjhzfyozzuicubqmh.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoY2ZqaHpmeW96enVpY3VicW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjgyOTQsImV4cCI6MjA3MTQwNDI5NH0.YvXw2sAxjg28t5E8MXGArbFRRpFFdpjyBAE2APYlv7g'

// Create a single Supabase client instance for the browser
// This prevents the "Multiple GoTrueClient instances" warning
export function createClient() {
  // Log if env vars are missing (for debugging)
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Environment variables not loaded, using fallback values')
  }
  
  // Only create a new instance if we're on the server or don't have one yet
  if (typeof window === 'undefined') {
    // Server-side: always create a new instance
    return createSupabaseClient<Database>(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    )
  }
  
  // Client-side: use singleton pattern
  if (!clientInstance) {
    clientInstance = createSupabaseClient<Database>(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    )
  }
  
  return clientInstance
}