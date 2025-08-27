'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from './AuthModal'

export default function AuthButton() {
  const { user, profile, loading, isPracticeMode, signInWithEmail, signUpWithEmail, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-sm">
        <div className="animate-pulse text-neon-green">Loading...</div>
      </div>
    )
  }

  if (user && profile) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-xs sm:text-sm">
          <span className="text-gray-400">Playing as</span>{' '}
          <span className="text-neon-green font-bold">
            {profile.username}
            {profile.x_username && (
              <span className="text-gray-500 ml-1">(@{profile.x_username})</span>
            )}
          </span>
        </div>
        <button
          onClick={signOut}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-xs sm:text-sm text-gray-300 hover:text-white transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-4">
        {isPracticeMode && (
          <div className="text-xs sm:text-sm text-amber-500">
            Practice Mode
          </div>
        )}
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black hover:bg-gray-900 border border-neon-green rounded-lg text-neon-green font-medium transition-all duration-200 group text-xs sm:text-sm"
        >
          Sign In
        </button>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={signInWithEmail}
        onSignUp={signUpWithEmail}
      />
    </>
  )
}