import { useCallback } from 'react'

export function useClickHandler(onTargetClick: () => void) {
  const handleClick = useCallback((e: React.PointerEvent) => {
    // Only handle primary pointer (main mouse button or first touch)
    if (e.isPrimary) {
      e.preventDefault()
      onTargetClick()
      console.log('Target clicked!')
    }
  }, [onTargetClick])

  return handleClick
}