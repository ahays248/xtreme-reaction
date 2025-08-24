// Target positioning and spawn location logic

export interface TargetPosition {
  x: number // Percentage from left (0-100)
  y: number // Percentage from top (0-100)
}

/**
 * Get play area boundaries based on device type
 * Desktop: 60% of screen width/height
 * Mobile: 80% of screen width/height
 */
export function getPlayAreaBounds(): { minX: number; maxX: number; minY: number; maxY: number } {
  if (typeof window === 'undefined') {
    // Default bounds for SSR
    return { minX: 10, maxX: 90, minY: 25, maxY: 75 }
  }
  
  const windowWidth = window.innerWidth
  const isMobile = windowWidth < 768
  
  // Calculate the actual game area width (max-w-2xl = 672px on desktop)
  const gameAreaWidth = Math.min(windowWidth, isMobile ? windowWidth : 672)
  const gameAreaOffset = (windowWidth - gameAreaWidth) / 2
  
  // Convert pixel offsets to percentages
  const leftOffsetPercent = (gameAreaOffset / windowWidth) * 100
  const rightOffsetPercent = 100 - leftOffsetPercent
  
  if (isMobile) {
    // Mobile: Use most of screen, avoid UI elements
    return {
      minX: 5,   // 5% padding from left
      maxX: 95,  // 5% padding from right
      minY: 20,  // Below header
      maxY: 75   // Above buttons
    }
  } else {
    // Desktop: Constrain to the max-w-2xl container
    return {
      minX: leftOffsetPercent + 5,   // Container left edge + padding
      maxX: rightOffsetPercent - 5,   // Container right edge - padding
      minY: 25,  // Below header
      maxY: 70   // Above buttons
    }
  }
}

/**
 * Generate a random position within the play area
 * Ensures targets don't spawn too close to edges
 * IMPORTANT: Targets must spawn within the same bounds used by isClickInPlayArea
 */
export function generateRandomPosition(): TargetPosition {
  const bounds = getPlayAreaBounds()
  
  // Add padding to account for target size (roughly 3% of viewport on each side)
  // This ensures the entire target is clickable and within the play area
  const targetPadding = 3
  const paddedMinX = bounds.minX + targetPadding
  const paddedMaxX = bounds.maxX - targetPadding
  const paddedMinY = bounds.minY + targetPadding
  const paddedMaxY = bounds.maxY - targetPadding
  
  // Generate position within the padded bounds
  const x = Math.random() * (paddedMaxX - paddedMinX) + paddedMinX
  const y = Math.random() * (paddedMaxY - paddedMinY) + paddedMinY
  
  return {
    x: Math.round(x),
    y: Math.round(y)
  }
}

/**
 * Check if a click/tap is within the play area
 * Used to determine if a miss should be counted
 */
export function isClickInPlayArea(clientX: number, clientY: number): boolean {
  const bounds = getPlayAreaBounds()
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  
  const xPercent = (clientX / windowWidth) * 100
  const yPercent = (clientY / windowHeight) * 100
  
  return (
    xPercent >= bounds.minX &&
    xPercent <= bounds.maxX &&
    yPercent >= bounds.minY &&
    yPercent <= bounds.maxY
  )
}

/**
 * Convert percentage position to pixel position
 * Used for absolute positioning of targets
 */
export function percentToPixels(position: TargetPosition): { left: number; top: number } {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  
  return {
    left: Math.round((position.x / 100) * windowWidth),
    top: Math.round((position.y / 100) * windowHeight)
  }
}