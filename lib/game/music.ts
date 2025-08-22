// Background music manager
export class MusicManager {
  private audio: HTMLAudioElement | null = null
  private enabled: boolean = true
  private volume: number = 0.3 // Lower volume for background music
  private fadeInterval: NodeJS.Timeout | null = null
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.initMusic()
    }
  }

  private initMusic() {
    // Initialize with your music file
    this.audio = new Audio('/music/background.mp3')
    this.audio.loop = true
    this.audio.volume = 0 // Start at 0 for fade in
    this.audio.preload = 'auto'
    
    // Add error handling
    this.audio.addEventListener('error', (e) => {
      console.error('Music load error:', e)
    })
    
    this.audio.addEventListener('canplaythrough', () => {
      console.log('Music loaded and ready to play')
    })
  }

  async play() {
    if (!this.audio || !this.enabled) return
    
    try {
      // Reset to beginning if needed
      this.audio.currentTime = 0
      this.audio.volume = 0
      
      await this.audio.play()
      
      // Fade in over 2 seconds
      this.fadeIn(2000)
    } catch (err) {
      console.log('Music playback failed:', err)
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