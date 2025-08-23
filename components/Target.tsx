interface TargetProps {
  isVisible: boolean
  onTargetClick?: (e: React.PointerEvent) => void
}

export default function Target({ isVisible, onTargetClick }: TargetProps) {
  if (!isVisible) return null

  return (
    <div 
      className="w-24 h-24 bg-green-500 rounded-full shadow-lg shadow-green-500/50 cursor-pointer hover:bg-green-400 transition-colors"
      onPointerDown={onTargetClick}
      aria-label="Target circle"
      role="button"
      tabIndex={0}
    />
  )
}