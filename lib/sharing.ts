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

export function createShareText(data: ShareData): string {
  const lines = []
  
  // Main score announcement
  lines.push(`🎯 Just scored ${formatScore(data.finalScore)} points in Xtreme Reaction!`)
  lines.push('')
  
  // Stats with emojis
  lines.push(`⚡ Avg reaction: ${formatTime(data.avgReactionTime)}`)
  lines.push(`🎯 Accuracy: ${data.accuracy}%`)
  lines.push(`🔥 Best streak: ${data.bestStreak}`)
  lines.push(`📊 Grade: ${data.grade}`)
  
  // Add rank if available
  if (data.userRank) {
    const rankType = data.leaderboardType === 'daily' ? 'Daily' : 'All-Time'
    lines.push(`🏆 ${rankType} Rank: #${data.userRank}`)
  }
  
  lines.push('')
  lines.push('Think you can beat me? 💪')
  lines.push('')
  
  // Hashtags
  lines.push('#XtremeReaction #ReactionTime #Gaming')
  
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
  const shareUrl = 'https://xtreme-reaction.vercel.app'
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