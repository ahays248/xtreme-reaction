import { useCallback } from 'react'

export function useClickHandler(onTargetClick: (e: React.PointerEvent) => void) {
  const handleClick = useCallback((e: React.PointerEvent) => {
    // Only handle primary pointer (main mouse button or first touch)
    if (e.isPrimary) {
      e.preventDefault()
      onTargetClick(e)
      console.log('Target clicked!')
    }
  }, [onTargetClick])

  return handleClick
}