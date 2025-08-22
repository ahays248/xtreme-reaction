// Background music manager
export class MusicManager {
  private audio: HTMLAudioElement | null = null
  private enabled: boolean = true
  private volume: number = 0.3 // Lower volume for background music
  private fadeInterval: NodeJS.Timeout | null = null
  
  constructor() {
    if (typeof window !== 'undefined') {
      // Don't initialize audio immediately - wait for user interaction
    }
  }

  private initMusic() {
    if (this.audio) {
      console.log('Audio already initialized')
      return // Already initialized
    }
    
    try {
      console.log('Initializing music with file: /music/background.mp3')
      
      // Initialize with your music file
      this.audio = new Audio('/music/background.mp3')
      this.audio.loop = true
      this.audio.volume = 0 // Start at 0 for fade in
      this.audio.preload = 'auto'
      
      // Add error handling
      this.audio.addEventListener('error', (e: any) => {
        console.error('Music load error:', e)
        console.error('Error type:', e.type)
        if (e.target) {
          console.error('Audio src:', e.target.src)
          console.error('Audio error code:', e.target.error?.code)
          console.error('Audio error message:', e.target.error?.message)
        }
      })
      
      this.audio.addEventListener('loadstart', () => {
        console.log('Music loading started...')
      })
      
      this.audio.addEventListener('canplaythrough', () => {
        console.log('Music loaded and ready to play')
        console.log('Audio duration:', this.audio?.duration)
      })
      
      this.audio.addEventListener('loadeddata', () => {
        console.log('Music data loaded')
      })
      
      console.log('Music manager initialized')
    } catch (err) {
      console.error('Failed to initialize music:', err)
    }
  }

  // Call this on first user interaction (e.g., Start Game button click)
  initOnUserInteraction() {
    if (typeof window !== 'undefined' && !this.audio) {
      this.initMusic()
    }
  }

  async play() {
    // Initialize if needed
    if (!this.audio) {
      console.log('Music not initialized, initializing now...')
      this.initMusic()
    }
    
    if (!this.audio) {
      console.log('Failed to initialize audio')
      return
    }
    
    if (!this.enabled) {
      console.log('Music is disabled')
      return
    }
    
    try {
      // Reset to beginning if needed
      this.audio.currentTime = 0
      this.audio.volume = 0
      
      console.log('Attempting to play music...')
      await this.audio.play()
      console.log('Music started playing successfully')
      
      // Fade in over 2 seconds
      this.fadeIn(2000)
    } catch (err: any) {
      console.error('Music playback failed:', err)
      console.error('Error name:', err.name)
      console.error('Error message:', err.message)
      
      // If it's an autoplay policy error, we need user interaction
      if (err.name === 'NotAllowedError') {
        console.log('Autoplay blocked. Music will play after user interaction.')
      }
    }
  }

  stop() {
    if (!this.audio) return
    
    // Fade out over 1 second then pause
    this.fadeOut(1000, () => {
      if (this.audio) {
        this.audio.pause()
        this.audio.currentTime = 0
      }
    })
  }

  pause() {
    if (!this.audio) return
    
    // Quick fade out
    this.fadeOut(500, () => {
      if (this.audio) {
        this.audio.pause()
      }
    })
  }

  resume() {
    if (!this.audio || !this.enabled) return
    
    this.audio.play().then(() => {
      this.fadeIn(500)
    }).catch(err => {
      console.log('Music resume failed:', err)
    })
  }

  private fadeIn(duration: number) {
    if (!this.audio) return
    
    // Clear any existing fade
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
    }
    
    const targetVolume = this.volume
    const steps = 50
    const stepDuration = duration / steps
    const volumeStep = targetVolume / steps
    let currentStep = 0
    
    this.fadeInterval = setInterval(() => {
      if (!this.audio) return
      
      currentStep++
      this.audio.volume = Math.min(volumeStep * currentStep, targetVolume)
      
      if (currentStep >= steps) {
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval)
          this.fadeInterval = null
        }
      }
    }, stepDuration)
  }

  private fadeOut(duration: number, callback?: () => void) {
    if (!this.audio) return
    
    // Clear any existing fade
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
    }
    
    const startVolume = this.audio.volume
    const steps = 50
    const stepDuration = duration / steps
    const volumeStep = startVolume / steps
    let currentStep = 0
    
    this.fadeInterval = setInterval(() => {
      if (!this.audio) return
      
      currentStep++
      this.audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0)
      
      if (currentStep >= steps) {
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval)
          this.fadeInterval = null
        }
        if (callback) callback()
      }
    }, stepDuration)
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.audio && !this.fadeInterval) {
      this.audio.volume = this.volume
    }
  }

  toggle() {
    this.enabled = !this.enabled
    // Initialize if needed before pausing
    if (!this.audio && this.enabled) {
      this.initMusic()
    }
    if (!this.enabled && this.audio) {
      this.pause()
    }
    return this.enabled
  }

  isEnabled() {
    return this.enabled
  }

  setMusicFile(url: string) {
    // Stop current music
    this.stop()
    
    // Load new music file
    if (this.audio) {
      this.audio.src = url
      this.audio.load()
    }
  }
}

// Singleton instance
let musicManagerInstance: MusicManager | null = null

export function getMusicManager(): MusicManager {
  if (!musicManagerInstance) {
    musicManagerInstance = new MusicManager()
  }
  return musicManagerInstance
}