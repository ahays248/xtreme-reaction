// Sound effects manager for the game
export class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.5
  
  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      this.initAudioContext()
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (err) {
      console.log('Web Audio API not supported:', err)
    }
  }

  private ensureAudioContext() {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.initAudioContext()
    }
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volumeMultiplier: number = 1) {
    if (!this.enabled) return
    
    this.ensureAudioContext()
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      
      // Set volume with fade in/out
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.volume * volumeMultiplier, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (err) {
      console.log('Sound play failed:', err)
    }
  }

  play(soundName: 'success' | 'error' | 'perfect') {
    if (!this.enabled) return
    
    switch (soundName) {
      case 'success':
        // Pleasant chime - C major chord arpeggio
        this.playTone(523.25, 0.1, 'sine', 0.8) // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.8), 50) // E5
        setTimeout(() => this.playTone(783.99, 0.15, 'sine', 1), 100) // G5
        break
        
      case 'perfect':
        // Special achievement sound - higher and more complex
        this.playTone(659.25, 0.1, 'sine', 0.8) // E5
        setTimeout(() => this.playTone(783.99, 0.1, 'sine', 0.8), 50) // G5
        setTimeout(() => this.playTone(987.77, 0.1, 'sine', 0.8), 100) // B5
        setTimeout(() => this.playTone(1318.51, 0.2, 'sine', 1), 150) // E6
        break
        
      case 'error':
        // Discord/error sound - lower frequency buzz
        this.playTone(150, 0.2, 'sawtooth', 0.6)
        this.playTone(75, 0.2, 'square', 0.4)
        break
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }

  isEnabled() {
    return this.enabled
  }
}

// Singleton instance
let soundManagerInstance: SoundManager | null = null

export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager()
  }
  return soundManagerInstance
}