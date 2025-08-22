import { useEffect, useState } from 'react'
import { 
  getDeviceType, 
  getInputMethod, 
  getPlatformAdjustments,
  type DeviceType,
  type InputMethod,
  type PlatformAdjustments 
} from '@/lib/utils/deviceDetection'

export function usePlatformAdjustments() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse')
  const [adjustments, setAdjustments] = useState<PlatformAdjustments>(getPlatformAdjustments())
  const [lastInputMethod, setLastInputMethod] = useState<'touch' | 'mouse' | null>(null)
  
  useEffect(() => {
    // Initial detection
    setDeviceType(getDeviceType())
    setInputMethod(getInputMethod())
    setAdjustments(getPlatformAdjustments())
    
    // Track actual input method used (more accurate than capability detection)
    const handleTouch = () => {
      if (lastInputMethod !== 'touch') {
        setLastInputMethod('touch')
        console.log('Touch input detected - applying mobile adjustments')
      }
    }
    
    const handleMouse = (e: MouseEvent) => {
      // Ignore mouse events that come from touch (they have 0 buttons)
      if (e.buttons > 0 && lastInputMethod !== 'mouse') {
        setLastInputMethod('mouse')
        console.log('Mouse input detected - applying desktop adjustments')
      }
    }
    
    // Listen for input type changes
    window.addEventListener('touchstart', handleTouch)
    window.addEventListener('mousedown', handleMouse)
    
    // Handle window resize (device orientation change)
    const handleResize = () => {
      setDeviceType(getDeviceType())
      setAdjustments(getPlatformAdjustments())
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('touchstart', handleTouch)
      window.removeEventListener('mousedown', handleMouse)
      window.removeEventListener('resize', handleResize)
    }
  }, [lastInputMethod])
  
  // Apply adjustments to reaction time
  const adjustReactionTime = (rawTime: number): number => {
    return Math.max(0, rawTime + adjustments.reactionTimeHandicap)
  }
  
  // Apply adjustments to score
  const adjustScore = (rawScore: number): number => {
    return Math.round(rawScore * adjustments.scoreMultiplier)
  }
  
  // Get adjusted grade based on platform
  const getAdjustedGrade = (reactionTime: number, accuracy: number): string => {
    const adjustedTime = adjustReactionTime(reactionTime)
    const thresholds = adjustments.gradeThresholds
    
    // High accuracy bonus
    const accuracyBonus = accuracy >= 90
    
    if (adjustedTime <= thresholds.S && accuracyBonus) return 'S'
    if (adjustedTime <= thresholds.A) return 'A'
    if (adjustedTime <= thresholds.B) return 'B'
    if (adjustedTime <= thresholds.C) return 'C'
    if (adjustedTime <= thresholds.D) return 'D'
    return 'F'
  }
  
  // Get platform display info
  const getPlatformInfo = () => {
    const actualInput = lastInputMethod || inputMethod
    
    if (deviceType === 'mobile' && actualInput === 'touch') {
      return {
        label: '📱 Mobile',
        description: 'Mobile difficulty adjustments applied',
        color: 'text-blue-400'
      }
    } else if (deviceType === 'tablet' && actualInput === 'touch') {
      return {
        label: '📱 Tablet', 
        description: 'Tablet difficulty adjustments applied',
        color: 'text-cyan-400'
      }
    } else if (deviceType === 'desktop' && actualInput === 'mouse') {
      return {
        label: '🖥️ Desktop',
        description: 'Desktop difficulty (no adjustments)',
        color: 'text-green-400'
      }
    } else {
      return {
        label: '💻 Hybrid',
        description: 'Mixed input adjustments applied',
        color: 'text-yellow-400'
      }
    }
  }
  
  return {
    deviceType,
    inputMethod,
    actualInputMethod: lastInputMethod || inputMethod,
    adjustments,
    adjustReactionTime,
    adjustScore,
    getAdjustedGrade,
    getPlatformInfo,
    
    // Individual adjustment values for display
    reactionTimeHandicap: adjustments.reactionTimeHandicap,
    cueTimeoutBonus: adjustments.cueTimeoutBonus,
    circleSizeMultiplier: adjustments.circleSizeMultiplier,
    scoreMultiplier: adjustments.scoreMultiplier,
  }
}