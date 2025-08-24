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
    // Mobile: Use 80% of screen, centered
    return {
      minX: 10,  // 10% from left
      maxX: 90,  // 90% from left (80% width)
      minY: 20,  // 20% from top (leave room for header)
      maxY: 70   // 70% from top (leave room for buttons)
    }
  } else {
    // Desktop: Use 60% of screen, centered
    return {
      minX: 20,  // 20% from left
      maxX: 80,  // 80% from left (60% width)
      minY: 25,  // 25% from top
      maxY: 65   // 65% from top (40% height)
    }
  }
}

/**
 * Generate a random position within the play area
 * Ensures targets don't spawn too close to edges
 */
export function generateRandomPosition(): TargetPosition {
  const bounds = getPlayAreaBounds()
  
  // Add 5% padding to prevent targets from being cut off at edges
  const paddedMinX = bounds.minX + 5
  const paddedMaxX = bounds.maxX - 5
  const paddedMinY = bounds.minY + 5
  const paddedMaxY = bounds.maxY - 5
  
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