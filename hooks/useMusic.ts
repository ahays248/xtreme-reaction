import { useEffect, useState } from 'react'
import { getMusicManager } from '@/lib/game/music'

export function useMusic() {
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const musicManager = getMusicManager()

  useEffect(() => {
    // Initialize music state
    setMusicEnabled(musicManager.isEnabled())
  }, [musicManager])

  const startMusic = async () => {
    await musicManager.play()
    setIsPlaying(true)
  }

  const stopMusic = () => {
    musicManager.stop()
    setIsPlaying(false)
  }

  const pauseMusic = () => {
    musicManager.pause()
    setIsPlaying(false)
  }

  const resumeMusic = () => {
    musicManager.resume()
    setIsPlaying(true)
  }

  const toggleMusic = () => {
    const newState = musicManager.toggle()
    setMusicEnabled(newState)
    if (!newState) {
      setIsPlaying(false)
    }
    return newState
  }

  const setVolume = (volume: number) => {
    musicManager.setVolume(volume)
  }

  const setMusicFile = (url: string) => {
    musicManager.setMusicFile(url)
  }

  return {
    startMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    toggleMusic,
    setVolume,
    setMusicFile,
    musicEnabled,
    isPlaying,
  }
}