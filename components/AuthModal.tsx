'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SimpleCaptcha from './SimpleCaptcha'
import { hasPendingGameResults } from '@/lib/localStorage'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSignIn: (email: string, password: string) => Promise<void>
  onSignUp: (email: string, password: string, username: string, xHandle?: string) => Promise<void>
  onGoogleSignIn?: () => Promise<void>
}

export default function AuthModal({ isOpen, onClose, onSignIn, onSignUp, onGoogleSignIn }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [xHandle, setXHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hasPendingScore, setHasPendingScore] = useState(false)
  
  // Check if there's a pending score to save
  useEffect(() => {
    if (isOpen) {
      setHasPendingScore(hasPendingGameResults())
    }
  }, [isOpen])

  // Ensure we only render portal on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 100)
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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

  // Don't render until mounted (client-side only)
  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-x-0 top-0 bottom-0 overflow-y-auto pb-safe"
            style={{ zIndex: 9999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex min-h-full items-start sm:items-center justify-center p-4 pt-8 sm:pt-4">
              <motion.div
                className="bg-black border-2 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 max-w-md w-full shadow-neon-green"
                data-modal-content
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-orbitron font-bold text-neon-green">
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-neon-green transition-colors text-2xl p-1 min-w-[32px] min-h-[32px]"
                  disabled={loading}
                >
                  ×
                </button>
              </div>

              {/* Pending Score Message */}
              {hasPendingScore && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm">
                  🎯 Your practice score will be saved after signing in!
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-3 sm:px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all text-base"
                    placeholder="player@example.com"
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
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
                    className="w-full px-3 sm:px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all text-base"
                    placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  />
                </div>

                {/* Sign Up Fields */}
                {mode === 'signup' && (
                  <>
                    {/* Username */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
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
                        className="w-full px-3 sm:px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all text-base"
                        placeholder="CoolGamer123"
                        autoComplete="username"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        3-20 characters, letters, numbers, underscores
                      </p>
                    </div>

                    {/* X Handle (Optional) */}
                    <div>
                      <label htmlFor="xHandle" className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                        X Handle <span className="text-gray-500 text-xs">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="xHandle"
                        value={xHandle}
                        onChange={(e) => setXHandle(e.target.value)}
                        disabled={loading}
                        maxLength={15}
                        className="w-full px-3 sm:px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green focus:shadow-neon-green transition-all text-base"
                        placeholder="username (without @)"
                        autoComplete="off"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Only add if you want to show your real X profile
                      </p>
                    </div>

                    {/* Captcha for signup */}
                    <div className="border-t border-gray-700 pt-3 sm:pt-4">
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

                {/* Google Sign In */}
                {onGoogleSignIn && (
                  <>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-black text-gray-400">OR</span>
                      </div>
                    </div>
                    
                    <motion.button
                      type="button"
                      onClick={async () => {
                        setLoading(true)
                        setError(null)
                        try {
                          await onGoogleSignIn()
                        } catch (err) {
                          setError((err as Error).message)
                        } finally {
                          setLoading(false)
                        }
                      }}
                      disabled={loading}
                      className="w-full px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {loading ? 'Loading...' : 'Continue with Google'}
                    </motion.button>
                  </>
                )}

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
                
                {/* Why Sign In Info */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <details className="text-xs text-gray-400">
                    <summary className="cursor-pointer hover:text-neon-green transition-colors font-medium">
                      Why should I sign in?
                    </summary>
                    <div className="mt-2 space-y-1 text-gray-500">
                      <p>✓ Save your scores to the leaderboard</p>
                      <p>✓ Compete globally with other players</p>
                      <p>✓ Track your progress over time</p>
                      <p>✓ Share achievements on X</p>
                      <p className="pt-2 text-amber-500">⚠️ Without signing in, your scores won't be saved!</p>
                    </div>
                  </details>
                </div>
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