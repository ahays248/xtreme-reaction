import html2canvas from 'html2canvas'
import { formatScore } from './scoring'
import { formatTime } from './timing'

export interface ShareData {
  finalScore: number
  accuracy: number
  avgReactionTime: number
  bestStreak: number
  userRank?: number | null
  leaderboardType?: 'daily' | 'all-time'
  username?: string
  xHandle?: string | null
  grade: string
  scorePercentile?: number | null
  totalPlayersToday?: number
}

export async function generateScoreCardImage(element: HTMLElement): Promise<Blob> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true
    })
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to generate image blob'))
        }
      }, 'image/png', 0.95)
    })
  } catch (error) {
    console.error('Error generating scorecard image:', error)
    throw error
  }
}

export async function copyScoreCardToClipboard(element: HTMLElement): Promise<boolean> {
  try {
    console.log('Starting copy process...')
    
    // Detect if we're on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale: isMobile ? 1.5 : 2, // Lower scale for mobile to reduce memory usage
      logging: false,
      useCORS: true,
      allowTaint: true
    })
    
    console.log('Canvas created successfully')
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to generate image blob'))
        }
      }, 'image/png', 0.95)
    })
    
    console.log('Blob created:', blob.size, 'bytes')
    
    // Check browser support
    console.log('Checking clipboard support...')
    console.log('Is Mobile?', isMobile)
    console.log('Is Safari?', isSafari)
    console.log('ClipboardItem available?', typeof ClipboardItem !== 'undefined')
    console.log('navigator.clipboard?', !!navigator.clipboard)
    console.log('navigator.clipboard.write?', !!navigator.clipboard?.write)
    console.log('Location protocol:', window.location.protocol)
    
    // Safari and some mobile browsers don't support clipboard.write for images
    // DuckDuckGo browser on iOS is based on WebKit but has limited clipboard support
    if (isMobile || isSafari) {
      console.log('Mobile/Safari detected - clipboard copy may not work for images')
      return false
    }
    
    // Try modern clipboard API (requires HTTPS)
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      try {
        console.log('Attempting to copy with ClipboardItem API...')
        const item = new ClipboardItem({ 'image/png': blob })
        await navigator.clipboard.write([item])
        console.log('Copy successful!')
        return true
      } catch (err) {
        console.error('ClipboardItem write failed:', err)
        // Check if it's a permission issue
        if (err instanceof Error) {
          console.error('Error details:', err.message, err.name)
        }
      }
    } else {
      console.log('ClipboardItem API not available')
    }
    
    // All methods failed
    return false
  } catch (error) {
    console.error('Error in copyScoreCardToClipboard:', error)
    return false
  }
}

export function createShareText(data: ShareData): string {
  const lines = []
  
  // Main score announcement
  lines.push(`🎯 Just scored ${formatScore(data.finalScore)} in Xtreme Reaction!`)
  lines.push('')
  
  // Stats with emojis
  lines.push(`⚡ Avg reaction: ${formatTime(data.avgReactionTime)}`)
  lines.push(`🎯 Accuracy: ${data.accuracy}%`)
  lines.push(`🔥 Best streak: ${data.bestStreak}`)
  
  // Show rank if available (prioritize this over percentile)
  if (data.userRank && data.totalPlayersToday) {
    if (data.userRank === 1) {
      lines.push(`🏆 Ranked #1 today out of ${data.totalPlayersToday} players!`)
    } else {
      lines.push(`🏆 Ranked #${data.userRank} of ${data.totalPlayersToday} players today`)
    }
  } else if (data.scorePercentile !== null && data.scorePercentile !== undefined) {
    // Fallback to percentile if rank not available
    lines.push(`📊 Top ${100 - data.scorePercentile}% today!`)
  } else {
    // Fallback to grade
    lines.push(`📊 Grade: ${data.grade}`)
  }
  
  lines.push('')
  lines.push('Think you can beat me? 💪')
  
  return lines.join('\n')
}

export function createXShareUrl(text: string, url: string): string {
  const params = new URLSearchParams({
    text: text,
    url: url
  })
  
  return `https://x.com/intent/tweet?${params.toString()}`
}

export async function shareToX(data: ShareData, scoreCardElement?: HTMLElement): Promise<void> {
  const shareUrl = 'https://XtremeReaction.lol'
  const shareText = createShareText(data)
  
  // Check if Web Share API is available (mobile)
  if (navigator.share && scoreCardElement) {
    try {
      // Generate image for mobile sharing
      const imageBlob = await generateScoreCardImage(scoreCardElement)
      const file = new File([imageBlob], 'score.png', { type: 'image/png' })
      
      // Check if sharing files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Xtreme Reaction Score',
          text: shareText,
          url: shareUrl
        })
        return
      }
    } catch (error) {
      console.log('Web Share API with image failed, falling back to text only:', error)
    }
    
    // Fallback to text-only sharing on mobile
    try {
      await navigator.share({
        title: 'Xtreme Reaction Score',
        text: shareText,
        url: shareUrl
      })
      return
    } catch (error) {
      console.log('Web Share API failed, falling back to X intent:', error)
    }
  }
  
  // Desktop or fallback: Open X intent URL
  const xUrl = createXShareUrl(shareText, shareUrl)
  const width = 550
  const height = 420
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2
  
  const popup = window.open(
    xUrl,
    'share-x',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
  )
  
  // Check if popup was blocked
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    // Fallback: Open in same window if popup blocked
    window.location.href = xUrl
  }
}

export function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share
}