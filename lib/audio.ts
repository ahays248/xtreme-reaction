/**
 * Audio management system for sound effects
 * Uses Web Audio API for instant playback without lag
 */

export type SoundType = 'hit' | 'miss' | 'trap' | 'gameover'

class AudioManager {
  private audioContext: AudioContext | null = null
  private buffers: Map<SoundType, AudioBuffer> = new Map()
  private gainNode: GainNode | null = null
  private initialized = false
  private muted = false

  /**
   * Initialize audio context (requires user interaction on mobile)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
      
      // Load volume from localStorage
      const savedVolume = localStorage.getItem('gameVolume')
      if (savedVolume !== null) {
        this.setVolume(parseInt(savedVolume, 10))
      }

      // Load mute state
      const savedMute = localStorage.getItem('gameMuted')
      this.muted = savedMute === 'true'

      // Preload all sounds
      await this.preloadSounds()
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize audio:', error)
    }
  }

  /**
   * Preload all sound effects
   */
  private async preloadSounds(): Promise<void> {
    const sounds: SoundType[] = ['hit', 'miss', 'trap', 'gameover']
    
    const loadPromises = sounds.map(async (sound) => {
      try {
        const response = await fetch(`/sounds/${sound}.mp3`)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
        this.buffers.set(sound, audioBuffer)
      } catch (error) {
        console.warn(`Failed to load sound: ${sound}`, error)
      }
    })

    await Promise.all(loadPromises)
  }

  /**
   * Play a sound effect
   */
  play(sound: SoundType): void {
    if (!this.initialized || !this.audioContext || this.muted) return

    const buffer = this.buffers.get(sound)
    if (!buffer) return

    try {
      const source = this.audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(this.gainNode!)
      source.start(0)
    } catch (error) {
      console.error(`Failed to play sound: ${sound}`, error)
    }
  }

  /**
   * Set volume (0-100)
   */
  setVolume(volume: number): void {
    if (!this.gainNode) return
    
    const clampedVolume = Math.max(0, Math.min(100, volume))
    this.gainNode.gain.value = clampedVolume / 100
    localStorage.setItem('gameVolume', clampedVolume.toString())
  }

  /**
   * Toggle mute
   */
  toggleMute(): boolean {
    this.muted = !this.muted
    localStorage.setItem('gameMuted', this.muted.toString())
    return this.muted
  }

  /**
   * Get current mute state
   */
  isMuted(): boolean {
    return this.muted
  }

  /**
   * Get current volume (0-100)
   */
  getVolume(): number {
    if (!this.gainNode) return 50
    return Math.round(this.gainNode.gain.value * 100)
  }
}

// Export singleton instance
export const audioManager = new AudioManager()