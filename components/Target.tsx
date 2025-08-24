import { getTargetSizeClass } from '@/lib/difficulty'

interface TargetProps {
  isVisible: boolean
  onTargetClick?: (e: React.PointerEvent) => void
  size?: number
}

export default function Target({ isVisible, onTargetClick, size = 96 }: TargetProps) {
  if (!isVisible) return null

  // Get appropriate Tailwind class for size
  const sizeClass = getTargetSizeClass(size)

  return (
    <div 
      className={`${sizeClass} bg-green-500 rounded-full shadow-lg shadow-green-500/50 cursor-pointer hover:bg-green-400 transition-all duration-200`}
      onPointerDown={onTargetClick}
      aria-label="Target circle"
      role="button"
      tabIndex={0}
    />
  )
}