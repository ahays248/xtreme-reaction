import { useState, useEffect, useCallback } from 'react'
import { audioManager, type SoundType } from '@/lib/audio'

interface UseSoundReturn {
  playSound: (sound: SoundType) => void
  volume: number
  setVolume: (volume: number) => void
  muted: boolean
  toggleMute: () => void
  initialized: boolean
}

export function useSound(): UseSoundReturn {
  const [volume, setVolumeState] = useState(50)
  const [muted, setMuted] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Initialize audio on mount (requires user interaction on mobile)
  useEffect(() => {
    const initAudio = async () => {
      await audioManager.initialize()
      setVolumeState(audioManager.getVolume())
      setMuted(audioManager.isMuted())
      setInitialized(true)
    }

    // Try to initialize immediately (will work on desktop)
    initAudio()

    // Also initialize on first user interaction (for mobile)
    const handleFirstInteraction = () => {
      initAudio()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [])

  const playSound = useCallback((sound: SoundType) => {
    audioManager.play(sound)
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    audioManager.setVolume(newVolume)
    setVolumeState(newVolume)
  }, [])

  const toggleMute = useCallback(() => {
    const newMutedState = audioManager.toggleMute()
    setMuted(newMutedState)
  }, [])

  return {
    playSound,
    volume,
    setVolume,
    muted,
    toggleMute,
    initialized
  }
}