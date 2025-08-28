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
  private soundEnabled = false  // User's explicit choice to enable sound
  private isIOS = false  // Detect iOS for special handling
  private audioElements: Map<SoundType | MusicType, HTMLAudioElement> = new Map()

  /**
   * Initialize audio context (requires user interaction on mobile)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Detect iOS
      this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      console.log('Is iOS device:', this.isIOS)
      
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      console.log('AudioContext created, state:', this.audioContext.state)
      
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
      
      // Load sound enabled state (user's choice)
      const savedSoundEnabled = localStorage.getItem('soundEnabled')
      this.soundEnabled = savedSoundEnabled === 'true'

      // Preload all sounds and music
      await Promise.all([
        this.preloadSounds(),
        this.preloadMusic()
      ])
      
      // For iOS, also create HTML5 Audio elements as fallback
      if (this.isIOS) {
        await this.createAudioElements()
      }
      
      this.initialized = true
      console.log('Audio initialized successfully')
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
   * Create HTML5 Audio elements for iOS fallback
   */
  private async createAudioElements(): Promise<void> {
    console.log('Creating HTML5 Audio elements for iOS')
    
    // Create audio elements for sound effects
    const sounds: SoundType[] = ['hit', 'miss', 'trap']
    for (const sound of sounds) {
      const audio = new Audio(`/sounds/${sound}.mp3`)
      audio.preload = 'auto'
      // Set playsinline to work on iOS
      audio.setAttribute('playsinline', '')
      // Volume control
      audio.volume = this.gainNode?.gain.value || 1
      this.audioElements.set(sound, audio)
    }
    
    // Create audio elements for music
    const musicTracks: MusicType[] = ['menu', 'gameplay', 'results']
    for (const track of musicTracks) {
      const audio = new Audio(`/music/${track}.mp3`)
      audio.preload = 'auto'
      audio.loop = true
      audio.setAttribute('playsinline', '')
      audio.volume = this.musicGainNode?.gain.value || 0.3
      this.audioElements.set(track, audio)
    }
    
    console.log('HTML5 Audio elements created')
  }

  /**
   * Preload all sound effects
   */
  private async preloadSounds(): Promise<void> {
    const sounds: SoundType[] = ['hit', 'miss', 'trap']
    
    const loadPromises = sounds.map(async (sound) => {
      try {
        const response = await fetch(`/sounds/${sound}.mp3`)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
        this.buffers.set(sound, audioBuffer)
        console.log(`Loaded sound: ${sound}`)
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
    console.log(`Attempting to play sound: ${sound}, initialized: ${this.initialized}, soundEnabled: ${this.soundEnabled}, muted: ${this.muted}, iOS: ${this.isIOS}`)
    
    if (!this.initialized) {
      console.log('Audio not initialized')
      return
    }
    if (!this.soundEnabled) {
      console.log('Sound not enabled by user')
      return
    }
    if (this.muted) {
      console.log('Sound is muted')
      return
    }

    // Use HTML5 Audio on iOS for better compatibility with silent mode
    if (this.isIOS) {
      const audioElement = this.audioElements.get(sound)
      if (audioElement) {
        try {
          // Reset and play
          audioElement.currentTime = 0
          audioElement.volume = this.gainNode?.gain.value || 1
          const playPromise = audioElement.play()
          if (playPromise) {
            await playPromise
          }
          console.log(`Successfully played sound via HTML5 Audio: ${sound}`)
        } catch (error) {
          console.error(`Failed to play HTML5 audio: ${sound}`, error)
        }
      }
      return
    }

    // Non-iOS: use Web Audio API
    if (!this.audioContext) {
      console.log('No audio context')
      return
    }

    // Ensure AudioContext is resumed (for mobile)
    await this.ensureResumed()

    const buffer = this.buffers.get(sound)
    if (!buffer) {
      console.warn(`No buffer found for sound: ${sound}`)
      return
    }

    try {
      const source = this.audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(this.gainNode!)
      source.start(0)
      console.log(`Successfully played sound via Web Audio: ${sound}`)
    } catch (error) {
      console.error(`Failed to play sound: ${sound}`, error)
    }
  }

  /**
   * Play background music
   */
  async playMusic(music: MusicType): Promise<void> {
    if (!this.initialized) return

    // Always track what music should be playing
    this.currentMusic = music

    // Don't actually play if not enabled by user or if muted
    if (!this.soundEnabled || this.musicMuted) return

    // Use HTML5 Audio on iOS
    if (this.isIOS) {
      // Stop all other music first
      for (const [key, audio] of this.audioElements.entries()) {
        if (key === 'menu' || key === 'gameplay' || key === 'results') {
          audio.pause()
          audio.currentTime = 0
        }
      }
      
      const audioElement = this.audioElements.get(music)
      if (audioElement) {
        try {
          audioElement.volume = this.musicGainNode?.gain.value || 0.3
          const playPromise = audioElement.play()
          if (playPromise) {
            await playPromise
          }
          console.log(`Successfully played music via HTML5 Audio: ${music}`)
        } catch (error) {
          console.error(`Failed to play HTML5 music: ${music}`, error)
        }
      }
      return
    }

    // Non-iOS: use Web Audio API
    if (!this.audioContext) return

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
    // Stop HTML5 Audio on iOS
    if (this.isIOS) {
      for (const [key, audio] of this.audioElements.entries()) {
        if (key === 'menu' || key === 'gameplay' || key === 'results') {
          audio.pause()
          audio.currentTime = 0
        }
      }
    }
    
    // Stop Web Audio
    if (this.currentMusicSource) {
      try {
        this.currentMusicSource.stop()
      } catch (error) {
        // Ignore error if already stopped
      }
      this.currentMusicSource = null
    }
    
    // Only clear currentMusic if explicitly stopping (not just muting)
    if (clearCurrent) {
      this.currentMusic = null
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

  /**
   * Enable sound (user's explicit choice)
   */
  async enableSound(): Promise<void> {
    this.soundEnabled = true
    localStorage.setItem('soundEnabled', 'true')
    
    // Ensure AudioContext is resumed (critical for mobile)
    await this.ensureResumed()
    
    // Play a silent buffer to unlock audio on iOS Safari
    if (this.audioContext) {
      try {
        const buffer = this.audioContext.createBuffer(1, 1, 22050)
        const source = this.audioContext.createBufferSource()
        source.buffer = buffer
        source.connect(this.audioContext.destination)
        source.start(0)
        console.log('Played silent buffer to unlock audio')
      } catch (error) {
        console.warn('Failed to play silent buffer:', error)
      }
    }
    
    // If there was music that should be playing, start it now
    if (this.currentMusic && !this.musicMuted) {
      this.playMusic(this.currentMusic)
    }
  }

  /**
   * Disable sound (user's explicit choice)
   */
  disableSound(): void {
    this.soundEnabled = false
    localStorage.setItem('soundEnabled', 'false')
    // Stop any currently playing music
    this.stopMusic(false) // Keep track of what was playing
  }

  /**
   * Check if sound is enabled by user
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled
  }
}

// Export singleton instance
export const audioManager = new AudioManager()