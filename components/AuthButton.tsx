'use client'

import { useAuth } from '@/hooks/useAuth'

export default function AuthButton() {
  const { user, profile, loading, isPracticeMode, signInWithX, signOut } = useAuth()

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
            @{profile.x_username || profile.username}
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
    <div className="flex items-center gap-2 sm:gap-4">
      {isPracticeMode && (
        <div className="text-xs sm:text-sm text-amber-500">
          Practice Mode
        </div>
      )}
      <button
        onClick={signInWithX}
        className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black hover:bg-gray-900 border border-gray-700 rounded-lg text-white transition-all duration-200 group"
      >
        <XLogo />
        <span className="text-xs sm:text-sm font-medium">Sign in with X</span>
      </button>
    </div>
  )
}

function XLogo() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="group-hover:scale-110 transition-transform"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}