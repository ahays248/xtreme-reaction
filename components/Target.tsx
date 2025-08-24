import { getTargetSizeClass } from '@/lib/difficulty'

interface TargetProps {
  isVisible: boolean
  onTargetClick?: (e: React.PointerEvent) => void
  size?: number
  variant?: 'normal' | 'trap'
}

export default function Target({ isVisible, onTargetClick, size = 96, variant = 'normal' }: TargetProps) {
  if (!isVisible) return null

  // Get appropriate Tailwind class for size
  const sizeClass = getTargetSizeClass(size)
  
  // Determine colors based on variant
  const isTrap = variant === 'trap'
  const bgColor = isTrap ? 'bg-red-500' : 'bg-green-500'
  const hoverColor = isTrap ? 'hover:bg-red-400' : 'hover:bg-green-400'
  const shadowColor = isTrap ? 'shadow-red-500/50' : 'shadow-green-500/50'

  return (
    <div 
      className={`${sizeClass} ${bgColor} rounded-full shadow-lg ${shadowColor} cursor-pointer ${hoverColor} transition-all duration-200`}
      onPointerDown={onTargetClick}
      aria-label={isTrap ? "Trap circle - don't click!" : "Target circle"}
      role="button"
      tabIndex={0}
    />
  )
}