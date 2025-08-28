import { useState, useEffect, useCallback } from 'react'
import { audioManager, type SoundType, type MusicType } from '@/lib/audio'

interface UseSoundReturn {
  playSound: (sound: SoundType) => void
  playMusic: (music: MusicType) => void
  stopMusic: () => void
  switchMusic: (music: MusicType) => void
  volume: number
  setVolume: (volume: number) => void
  musicVolume: number
  setMusicVolume: (volume: number) => void
  muted: boolean
  toggleMute: () => void
  musicMuted: boolean
  toggleMusicMute: () => void
  initialized: boolean
  initializeAudio: () => Promise<void>
  soundEnabled: boolean
  enableSound: () => void
  disableSound: () => void
}

export function useSound(): UseSoundReturn {
  const [volume, setVolumeState] = useState(50)
  const [musicVolume, setMusicVolumeState] = useState(30)
  const [muted, setMuted] = useState(false)
  const [musicMuted, setMusicMuted] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Initialize audio on mount (requires user interaction on mobile)
  useEffect(() => {
    const initAudio = async () => {
      await audioManager.initialize()
      setVolumeState(audioManager.getVolume())
      setMusicVolumeState(audioManager.getMusicVolume())
      setMuted(audioManager.isMuted())
      setMusicMuted(audioManager.isMusicMuted())
      setSoundEnabled(audioManager.isSoundEnabled())
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

  const playMusic = useCallback((music: MusicType) => {
    audioManager.playMusic(music)
  }, [])

  const stopMusic = useCallback(() => {
    audioManager.stopMusic()
  }, [])

  const switchMusic = useCallback((music: MusicType) => {
    audioManager.switchMusic(music)
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    audioManager.setVolume(newVolume)
    setVolumeState(newVolume)
  }, [])

  const setMusicVolume = useCallback((newVolume: number) => {
    audioManager.setMusicVolume(newVolume)
    setMusicVolumeState(newVolume)
  }, [])

  const toggleMute = useCallback(() => {
    const newMutedState = audioManager.toggleMute()
    setMuted(newMutedState)
  }, [])

  const toggleMusicMute = useCallback(() => {
    const newMutedState = audioManager.toggleMusicMute()
    setMusicMuted(newMutedState)
  }, [])

  const initializeAudio = useCallback(async () => {
    await audioManager.initialize()
    await audioManager.ensureResumed()
    setVolumeState(audioManager.getVolume())
    setMusicVolumeState(audioManager.getMusicVolume())
    setMuted(audioManager.isMuted())
    setMusicMuted(audioManager.isMusicMuted())
    setSoundEnabled(audioManager.isSoundEnabled())
    setInitialized(true)
  }, [])

  const enableSound = useCallback(() => {
    audioManager.enableSound()
    setSoundEnabled(true)
  }, [])

  const disableSound = useCallback(() => {
    audioManager.disableSound()
    setSoundEnabled(false)
  }, [])

  return {
    playSound,
    playMusic,
    stopMusic,
    switchMusic,
    volume,
    setVolume,
    musicVolume,
    setMusicVolume,
    muted,
    toggleMute,
    musicMuted,
    toggleMusicMute,
    initialized,
    initializeAudio,
    soundEnabled,
    enableSound,
    disableSound
  }
}