import { useEffect, useState } from 'react'
import { getSoundManager } from '@/lib/game/sounds'

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const soundManager = getSoundManager()

  useEffect(() => {
    // Initialize sound state
    setSoundEnabled(soundManager.isEnabled())
  }, [soundManager])

  const playSuccess = () => {
    soundManager.play('success')
  }

  const playError = () => {
    soundManager.play('error')
  }

  const playPerfect = () => {
    soundManager.play('perfect')
  }

  const toggleSound = () => {
    const newState = soundManager.toggle()
    setSoundEnabled(newState)
    return newState
  }

  const setVolume = (volume: number) => {
    soundManager.setVolume(volume)
  }

  return {
    playSuccess,
    playError,
    playPerfect,
    toggleSound,
    setVolume,
    soundEnabled,
  }
}