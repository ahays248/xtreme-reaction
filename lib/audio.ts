/**
 * Audio management system for sound effects and background music
 * Uses Web Audio API for instant playback without lag
 */

export type SoundType = 'hit' | 'miss' | 'trap'
export type MusicType = 'menu' | 'gameplay' | 'results'

class AudioManager {
  private audioContext: AudioContext | null = null
  private buffers: Map<SoundType, AudioBuffer> = new Map()
  private musicBuffers: Map<MusicType, AudioBuffer> = new Map()
  private gainNode: GainNode | null = null
  private musicGainNode: GainNode | null = null
  private currentMusicSource: AudioBufferSourceNode | null = null
  private currentMusic: MusicType | null = null
  private initialized = false
  private muted = false
  private musicMuted = false

  /**
   * Initialize audio context (requires user interaction on mobile)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Setup sound effects gain node
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
      
      // Setup music gain node (separate volume control)
      this.musicGainNode = this.audioContext.createGain()
      this.musicGainNode.connect(this.audioContext.destination)
      
      // Load volume from localStorage
      const savedVolume = localStorage.getItem('gameVolume')
      if (savedVolume !== null) {
        this.setVolume(parseInt(savedVolume, 10))
      }
      
      // Load music volume
      const savedMusicVolume = localStorage.getItem('musicVolume')
      if (savedMusicVolume !== null) {
        this.setMusicVolume(parseInt(savedMusicVolume, 10))
      } else {
        this.setMusicVolume(30) // Default music volume lower
      }

      // Load mute states
      const savedMute = localStorage.getItem('gameMuted')
      this.muted = savedMute === 'true'
      
      const savedMusicMute = localStorage.getItem('musicMuted')
      this.musicMuted = savedMusicMute === 'true'

      // Preload all sounds and music
      await Promise.all([
        this.preloadSounds(),
        this.preloadMusic()
      ])
      
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize audio:', error)
    }
  }

  /**
   * Ensure AudioContext is resumed (for mobile browsers)
   */
  async ensureResumed(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
      console.log('AudioContext resumed')
    }
  }

  /**
   * Preload all sound effects
   */
  private async preloadSounds(): Promise<void> {
    const sounds: SoundType[] = ['hit', 'miss', 'trap']
    
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
   * Preload background music
   */
  private async preloadMusic(): Promise<void> {
    const musicTracks: MusicType[] = ['menu', 'gameplay', 'results']
    
    const loadPromises = musicTracks.map(async (track) => {
      try {
        const response = await fetch(`/music/${track}.mp3`)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
        this.musicBuffers.set(track, audioBuffer)
      } catch (error) {
        console.warn(`Failed to load music: ${track}`, error)
      }
    })

    await Promise.all(loadPromises)
  }

  /**
   * Play a sound effect
   */
  async play(sound: SoundType): Promise<void> {
    if (!this.initialized || !this.audioContext || this.muted) return

    // Ensure AudioContext is resumed (for mobile)
    await this.ensureResumed()

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
   * Play background music
   */
  async playMusic(music: MusicType): Promise<void> {
    if (!this.initialized || !this.audioContext) return

    // Always track what music should be playing
    this.currentMusic = music

    // Don't actually play if muted
    if (this.musicMuted) return

    // Ensure AudioContext is resumed (for mobile)
    await this.ensureResumed()

    // Stop current music if playing (but keep currentMusic tracked)
    if (this.currentMusicSource) {
      try {
        this.currentMusicSource.stop()
      } catch (error) {
        // Ignore error if already stopped
      }
      this.currentMusicSource = null
    }

    const buffer = this.musicBuffers.get(music)
    if (!buffer) return

    try {
      this.currentMusicSource = this.audioContext.createBufferSource()
      this.currentMusicSource.buffer = buffer
      this.currentMusicSource.loop = true // Loop the music
      this.currentMusicSource.connect(this.musicGainNode!)
      this.currentMusicSource.start(0)
      // currentMusic already set above
    } catch (error) {
      console.error(`Failed to play music: ${music}`, error)
    }
  }

  /**
   * Stop background music
   */
  stopMusic(clearCurrent: boolean = true): void {
    if (this.currentMusicSource) {
      try {
        this.currentMusicSource.stop()
      } catch (error) {
        // Ignore error if already stopped
      }
      this.currentMusicSource = null
      // Only clear currentMusic if explicitly stopping (not just muting)
      if (clearCurrent) {
        this.currentMusic = null
      }
    }
  }

  /**
   * Switch background music with crossfade
   */
  switchMusic(music: MusicType): void {
    if (this.currentMusic === music) return
    this.playMusic(music)
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

  /**
   * Set music volume (0-100)
   */
  setMusicVolume(volume: number): void {
    if (!this.musicGainNode) return
    
    const clampedVolume = Math.max(0, Math.min(100, volume))
    this.musicGainNode.gain.value = clampedVolume / 100
    localStorage.setItem('musicVolume', clampedVolume.toString())
  }

  /**
   * Get music volume (0-100)
   */
  getMusicVolume(): number {
    if (!this.musicGainNode) return 30
    return Math.round(this.musicGainNode.gain.value * 100)
  }

  /**
   * Toggle music mute
   */
  toggleMusicMute(): boolean {
    this.musicMuted = !this.musicMuted
    localStorage.setItem('musicMuted', this.musicMuted.toString())
    
    if (this.musicMuted) {
      // Stop music but keep track of what was playing
      if (this.currentMusicSource) {
        this.stopMusic(false) // false = don't clear currentMusic
      }
    } else if (this.currentMusic) {
      // Resume the music that was playing before mute
      this.playMusic(this.currentMusic)
    }
    
    return this.musicMuted
  }

  /**
   * Get music mute state
   */
  isMusicMuted(): boolean {
    return this.musicMuted
  }
}

// Export singleton instance
export const audioManager = new AudioManager()