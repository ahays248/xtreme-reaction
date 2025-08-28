'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SimpleCaptcha from './SimpleCaptcha'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSignIn: (email: string, password: string) => Promise<void>
  onSignUp: (email: string, password: string, username: string, xHandle?: string) => Promise<void>
}

export default function AuthModal({ isOpen, onClose, onSignIn, onSignUp }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [xHandle, setXHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaVerified, setCaptchaVerified] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Check captcha for signup
    if (mode === 'signup' && !captchaVerified) {
      setError('Please complete the captcha verification')
      return
    }
    
    setLoading(true)

    try {
      if (mode === 'signin') {
        await onSignIn(email, password)
      } else {
        // Clean up X handle - remove @ if present
        const cleanXHandle = xHandle.startsWith('@') ? xHandle.slice(1) : xHandle
        await onSignUp(email, password, username, cleanXHandle || undefined)
      }
      // Clear form on success
      setEmail('')
      setPassword('')
      setUsername('')
      setXHandle('')
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError(null)
    setCaptchaVerified(false) // Reset captcha when switching
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black border-2 border-neon-green rounded-lg p-6 sm:p-8 max-w-md w-full shadow-neon-green"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-neon-green">
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-neon-green transition-colors text-2xl"
                  disabled={loading}
                >
                  ×
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all"
                    placeholder="player@example.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                    className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all"
                    placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  />
                </div>

                {/* Sign Up Fields */}
                {mode === 'signup' && (
                  <>
                    {/* Username */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                        Username <span className="text-neon-green">*</span>
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        minLength={3}
                        maxLength={20}
                        pattern="[a-zA-Z0-9_]+"
                        className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all"
                        placeholder="CoolGamer123"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        3-20 characters, letters, numbers, and underscores only
                      </p>
                    </div>

                    {/* X Handle (Optional) */}
                    <div>
                      <label htmlFor="xHandle" className="block text-sm font-medium text-gray-300 mb-2">
                        X Handle <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="xHandle"
                        value={xHandle}
                        onChange={(e) => setXHandle(e.target.value)}
                        disabled={loading}
                        maxLength={15}
                        className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all"
                        placeholder="@YourXHandle"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Your X (Twitter) username for leaderboard display
                      </p>
                    </div>

                    {/* Captcha for signup */}
                    <div className="border-t border-gray-700 pt-4">
                      <SimpleCaptcha onVerify={setCaptchaVerified} />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-black border-2 border-neon-green text-neon-green font-orbitron font-bold rounded-lg hover:bg-neon-green/20 hover:shadow-neon-intense transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? 'Loading...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                </motion.button>

                {/* Switch Mode */}
                <div className="text-center text-sm">
                  <span className="text-gray-400">
                    {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                  </span>
                  <button
                    type="button"
                    onClick={switchMode}
                    disabled={loading}
                    className="text-neon-green hover:text-neon-cyan transition-colors font-medium"
                  >
                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}