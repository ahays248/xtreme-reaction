'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface UsernameSetupProps {
  isOpen: boolean
  currentUsername?: string
  onSave: (username: string, xHandle?: string) => Promise<void>
}

export default function UsernameSetup({ isOpen, currentUsername, onSave }: UsernameSetupProps) {
  const [username, setUsername] = useState('')
  const [xHandle, setXHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure we only render portal on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const validateUsername = (value: string): string | null => {
    if (!value || value.length < 3) {
      return 'Username must be at least 3 characters'
    }
    if (value.length > 20) {
      return 'Username must be 20 characters or less'
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores'
    }
    if (value.includes('@') || value.includes('.com') || value.includes('.')) {
      return 'Username cannot look like an email address'
    }
    if (value.toLowerCase().includes('player')) {
      return 'Please choose a more creative username'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate username
    const validationError = validateUsername(username)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setLoading(true)

    try {
      // Clean up X handle - remove @ if present
      const cleanXHandle = xHandle.startsWith('@') ? xHandle.slice(1) : xHandle
      await onSave(username, cleanXHandle || undefined)
      // Modal will be closed by parent component on success
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  // Don't render until mounted (client-side only)
  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - cannot be clicked to close */}
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-x-0 top-0 bottom-0 overflow-y-auto pb-safe flex items-center justify-center"
            style={{ zIndex: 9999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="p-4 w-full max-w-md">
              <motion.div
                className="bg-black border-2 border-neon-green rounded-lg p-6 md:p-8 shadow-neon-green"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.3 }}
              >
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-orbitron font-bold text-neon-green mb-2">
                    Choose Your Username
                  </h2>
                  <p className="text-sm text-gray-400">
                    This will be displayed on the public leaderboard
                  </p>
                </div>

                {/* Important Notice */}
                <div className="mb-6 p-3 bg-amber-900/20 border border-amber-500/50 rounded-lg">
                  <p className="text-sm text-amber-400">
                    ⚠️ Important: Choose wisely! Your username will be public and helps protect your privacy.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                      Username <span className="text-neon-green">*</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value)
                        setError(null)
                      }}
                      required
                      disabled={loading}
                      minLength={3}
                      maxLength={20}
                      className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all"
                      placeholder="CoolGamer123"
                      autoComplete="off"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      3-20 characters, letters, numbers, underscores only
                    </p>
                    {username && (
                      <p className={`text-xs mt-1 ${validateUsername(username) ? 'text-red-400' : 'text-green-400'}`}>
                        {validateUsername(username) || '✓ Username is available'}
                      </p>
                    )}
                  </div>

                  {/* X Handle (Optional) */}
                  <div>
                    <label htmlFor="xHandle" className="block text-sm font-medium text-gray-300 mb-2">
                      X Handle <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="xHandle"
                      value={xHandle}
                      onChange={(e) => setXHandle(e.target.value)}
                      disabled={loading}
                      maxLength={15}
                      className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all"
                      placeholder="@username (optional)"
                      autoComplete="off"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Add your X handle if you want to show it on the leaderboard
                    </p>
                  </div>

                  {/* Why Username Notice */}
                  <div className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded-lg">
                    <p className="mb-1 font-semibold">Why do I need a username?</p>
                    <ul className="space-y-1">
                      <li>• Protects your email privacy on leaderboards</li>
                      <li>• Makes you recognizable to other players</li>
                      <li>• Required for competitive play</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || !username}
                    className="w-full px-6 py-3 min-h-[44px] bg-black border-2 border-neon-green text-neon-green font-orbitron font-bold text-sm sm:text-base rounded-lg hover:bg-neon-green/20 hover:shadow-neon-intense transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? 'Saving...' : 'Save Username & Continue'}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // Use portal to render at document root level
  return createPortal(modalContent, document.body)
}