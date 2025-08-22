'use client'

import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'

export function AuthStatus() {
  const { user, loading, isAnonymous, signInAnonymously, signInWithX, signOut } = useAuth()

  if (loading) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-400 text-sm">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <div className="px-4 py-2 bg-gray-800 rounded-lg text-white text-sm">
              {isAnonymous ? (
                <span className="text-gray-400">Playing as Guest</span>
              ) : (
                <span>Logged in</span>
              )}
            </div>
            {isAnonymous ? (
              <button
                onClick={signInWithX}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign in with X
              </button>
            ) : (
              <button
                onClick={signOut}
                className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
              >
                Sign out
              </button>
            )}
          </>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={signInAnonymously}
              className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
            >
              Play as Guest
            </button>
            <button
              onClick={signInWithX}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign in with X
            </button>
          </div>
        )}
      </div>
    </div>
  )
}