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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  if (isMobile) {
    // Mobile: Use most of screen, avoid UI elements
    return {
      minX: 10,  // 10% from left
      maxX: 90,  // 90% from left (80% width)
      minY: 25,  // 25% from top (below header)
      maxY: 75   // 75% from top (above buttons)
    }
  } else {
    // Desktop: Use center area of screen
    return {
      minX: 20,  // 20% from left
      maxX: 80,  // 80% from left (60% width)
      minY: 30,  // 30% from top (below header)
      maxY: 70   // 70% from top (above buttons)
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