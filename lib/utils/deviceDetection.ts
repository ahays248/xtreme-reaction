/**
 * Device detection utilities for platform-specific adjustments
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop'
export type InputMethod = 'touch' | 'mouse' | 'hybrid'

/**
 * Detect the device type based on screen size and user agent
 */
export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  const userAgent = navigator.userAgent.toLowerCase()
  
  // Check for mobile devices
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  
  // Check for tablets
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent)
  
  // Also check screen size
  if (isMobile || width < 768) {
    return 'mobile'
  } else if (isTablet || width < 1024) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

/**
 * Detect the primary input method
 */
export function getInputMethod(): InputMethod {
  if (typeof window === 'undefined') return 'mouse'
  
  // Check if device has touch capability
  const hasTouch = 'ontouchstart' in window || 
                   navigator.maxTouchPoints > 0 ||
                   (navigator as any).msMaxTouchPoints > 0
  
  // Check if device has mouse
  const hasMouse = matchMedia('(pointer: fine)').matches
  
  if (hasTouch && !hasMouse) {
    return 'touch'
  } else if (!hasTouch && hasMouse) {
    return 'mouse'
  } else {
    return 'hybrid'
  }
}

/**
 * Get platform-specific adjustments for game difficulty
 */
export interface PlatformAdjustments {
  reactionTimeHandicap: number  // ms to add/subtract from reaction times
  cueTimeoutBonus: number        // extra ms for cue timeout
  circleSizeMultiplier: number  // multiplier for circle size
  scoreMultiplier: number        // scoring adjustment
  gradeThresholds: {
    S: number
    A: number
    B: number
    C: number
    D: number
  }
}

export function getPlatformAdjustments(): PlatformAdjustments {
  const device = getDeviceType()
  const input = getInputMethod()
  
  // Mobile with touch - ADVANTAGED (small screen, everything in thumb reach)
  if (device === 'mobile' && input === 'touch') {
    return {
      reactionTimeHandicap: 0,      // No handicap - they have the advantage
      cueTimeoutBonus: 0,           // No extra time needed
      circleSizeMultiplier: 1.0,    // Standard size - easy to tap on small screen
      scoreMultiplier: 1.0,          // Standard scoring
      gradeThresholds: {
        S: 250,
        A: 350,
        B: 450,
        C: 550,
        D: 650
      }
    }
  }
  
  // Tablet with touch - Slightly advantaged
  if (device === 'tablet' && input === 'touch') {
    return {
      reactionTimeHandicap: -25,    // Small handicap for medium screen
      cueTimeoutBonus: 200,
      circleSizeMultiplier: 1.1,
      scoreMultiplier: 1.05,
      gradeThresholds: {
        S: 275,
        A: 375,
        B: 475,
        C: 575,
        D: 675
      }
    }
  }
  
  // Desktop with mouse - DISADVANTAGED (large screen, long mouse travel)
  if (device === 'desktop' && input === 'mouse') {
    return {
      reactionTimeHandicap: -100,   // Subtract 100ms for mouse travel time
      cueTimeoutBonus: 750,         // 750ms extra time for mouse movement
      circleSizeMultiplier: 1.3,    // 30% larger circles for easier targeting
      scoreMultiplier: 1.2,          // 20% score bonus for difficulty
      gradeThresholds: {
        S: 400,  // Much more forgiving
        A: 500,
        B: 600,
        C: 700,
        D: 800
      }
    }
  }
  
  // Hybrid devices (touchscreen laptops) - depends on input
  return {
    reactionTimeHandicap: -50,
    cueTimeoutBonus: 400,
    circleSizeMultiplier: 1.15,
    scoreMultiplier: 1.1,
    gradeThresholds: {
      S: 325,
      A: 425,
      B: 525,
      C: 625,
      D: 725
    }
  }
}

/**
 * Check if user is on a slow/old device
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for reduced motion preference (often indicates lower-end device)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  // Check memory if available
  const memory = (navigator as any).deviceMemory
  const isLowMemory = memory && memory < 4
  
  // Check CPU cores if available
  const cores = navigator.hardwareConcurrency
  const isLowCores = cores && cores < 4
  
  return prefersReducedMotion || isLowMemory || isLowCores
}

/**
 * Format device info for display/analytics
 */
export function getDeviceInfo() {
  return {
    type: getDeviceType(),
    input: getInputMethod(),
    screen: {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio
    },
    isLowEnd: isLowEndDevice(),
    userAgent: navigator.userAgent
  }
}