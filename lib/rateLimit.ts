/**
 * Rate limiting for API protection
 * Prevents bots and abuse
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  /**
   * Check if a user/IP has exceeded rate limit
   */
  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const userLimit = this.store[identifier]

    // Clean up expired entries
    this.cleanup()

    // No existing record, create new one
    if (!userLimit || now > userLimit.resetTime) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.windowMs
      }
      return false
    }

    // Check if limit exceeded
    if (userLimit.count >= this.maxRequests) {
      return true
    }

    // Increment counter
    userLimit.count++
    return false
  }

  /**
   * Get remaining requests for identifier
   */
  getRemainingRequests(identifier: string): number {
    const userLimit = this.store[identifier]
    if (!userLimit) return this.maxRequests
    
    const now = Date.now()
    if (now > userLimit.resetTime) return this.maxRequests
    
    return Math.max(0, this.maxRequests - userLimit.count)
  }

  /**
   * Clean up expired entries to prevent memory leak
   */
  private cleanup() {
    const now = Date.now()
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    }
  }
}

// Game session rate limiter - 30 saves per minute max (generous for testing)
export const gameSessionLimiter = new RateLimiter(60000, 30)

// Auth rate limiter - 5 attempts per minute
export const authLimiter = new RateLimiter(60000, 5)

// Leaderboard rate limiter - 60 requests per minute
export const leaderboardLimiter = new RateLimiter(60000, 60)