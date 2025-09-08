'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from './AuthModal'

export default function AuthStatusBar() {
  const { user, profile, loading, isPracticeMode, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Don't show bar if loading
  if (loading) {
    return null
  }

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-green-500/30 z-20"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Status */}
            <div className="flex items-center gap-2 sm:gap-4">
              {user && profile ? (
                <>
                  <span className="text-xs sm:text-sm text-gray-400">Playing as</span>
                  <span className="text-xs sm:text-sm text-neon-green font-bold">
                    {profile.username}
                    {profile.x_username && (
                      <span className="text-gray-500 ml-1">(@{profile.x_username})</span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs sm:text-sm text-amber-500 font-medium">
                    ⚠️ Guest Mode
                  </span>
                  <span className="hidden sm:inline text-xs text-amber-400/80">
                    Scores not saved
                  </span>
                </>
              )}
            </div>

            {/* Right side - Action button */}
            <div>
              {user ? (
                <button
                  onClick={signOut}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-xs sm:text-sm text-gray-300 hover:text-white transition-all duration-200"
                >
                  Sign Out
                </button>
              ) : (
                <motion.button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] bg-black border-2 border-amber-500 text-amber-400 font-bold rounded-lg hover:bg-amber-500/20 hover:border-amber-400 transition-all duration-200 text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔐 Sign In
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={signInWithEmail}
        onSignUp={signUpWithEmail}
        onGoogleSignIn={signInWithGoogle}
      />
    </>
  )
}