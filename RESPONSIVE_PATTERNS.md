# Responsive Design Patterns - Xtreme Reaction

**Purpose**: Document the responsive patterns used throughout the application  
**Framework**: Tailwind CSS with mobile-first approach

---

## 🎯 Core Philosophy

**Mobile-First**: Start with mobile styles, add complexity for larger screens

```jsx
// Pattern: base (mobile) → sm → md → lg → xl
className="text-base sm:text-lg md:text-xl"
```

---

## 📱 Breakpoint System

### Tailwind Default Breakpoints
```css
sm: 640px   /* Large phones / small tablets */
md: 768px   /* Tablets / small laptops */
lg: 1024px  /* Laptops / desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large screens */
```

### Our Usage Pattern
- **Base**: 0-639px (Mobile phones)
- **sm**: 640px+ (Large phones)
- **md**: 768px+ (Tablets and up)
- We rarely need lg/xl for this game

---

## 🎨 Typography Patterns

### Heading Hierarchy
```jsx
// Main Title
<h1 className="text-2xl sm:text-3xl md:text-6xl">

// Subtitle
<h2 className="text-lg sm:text-xl md:text-2xl">

// Body Text
<p className="text-base sm:text-lg md:text-xl">

// Small Text
<span className="text-xs sm:text-sm md:text-base">
```

### Font Families
```jsx
// Cyberpunk headers
className="font-orbitron"

// Body text
className="font-rajdhani"

// Monospace data
className="font-mono" // Uses Share Tech Mono
```

---

## 📏 Spacing Patterns

### Padding Scale
```jsx
// Container padding
className="p-2 sm:p-4 md:p-6"

// Button padding
className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4"

// Section padding
className="py-2 sm:py-4 md:py-8"
```

### Margin Scale
```jsx
// Bottom margins
className="mb-2 sm:mb-4 md:mb-8"

// Top margins
className="mt-2 sm:mt-4 md:mt-8"

// Between elements
className="space-y-2 sm:space-y-4 md:space-y-6"
```

### Gap Scale (Flexbox/Grid)
```jsx
// Flex gaps
className="gap-2 sm:gap-4 md:gap-6"

// Specific axis
className="gap-x-2 gap-y-4"
```

---

## 🎯 Interactive Elements

### Button Patterns
```jsx
// Primary Button (START GAME)
<button className="
  px-4 sm:px-6 md:px-8 
  py-2.5 sm:py-3 md:py-4
  text-base sm:text-lg md:text-xl
  min-h-[44px]  // Ensures touch target
  rounded-lg
">

// Secondary Button
<button className="
  px-3 sm:px-4 md:px-6
  py-2 sm:py-2.5 md:py-3
  text-sm sm:text-base
  min-h-[44px]
">
```

### Touch Targets
- **Minimum**: 44x44px (iOS guideline)
- **Preferred**: 48x48px (Android guideline)
- **Implementation**: `min-h-[44px] min-w-[44px]`

---

## 📐 Layout Patterns

### Container Pattern
```jsx
// Full-height container
<main className="min-h-screen flex flex-col">

// Centered content
<div className="w-full max-w-2xl mx-auto">

// Responsive width
<div className="w-full sm:w-3/4 md:w-1/2">
```

### Flexbox Patterns
```jsx
// Vertical stack
<div className="flex flex-col gap-4">

// Horizontal on larger screens
<div className="flex flex-col sm:flex-row gap-4">

// Center everything
<div className="flex items-center justify-center">
```

### Grid Patterns
```jsx
// Responsive columns
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

// Auto-fit grid
<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
```

---

## 🎮 Game-Specific Patterns

### Play Area Boundaries
```javascript
// Mobile: More screen utilization
function getPlayAreaBounds() {
  const isMobile = window.innerWidth < 768
  return isMobile 
    ? { minX: 10, maxX: 90, minY: 25, maxY: 75 }  // 80% area
    : { minX: 20, maxX: 80, minY: 30, maxY: 70 }  // 60% area
}
```

### Target Sizing
```javascript
// Responsive target sizes
const targetSizes = {
  mobile: 64,   // Larger for touch
  tablet: 80,   // Medium
  desktop: 96   // Precise mouse control
}
```

### Score Display
```jsx
// Minimal during play
<div className="fixed top-4 text-lg sm:text-xl">
  Round {current}/{total}
</div>

// Detailed after game
<div className="space-y-2 text-base sm:text-lg">
  {/* All stats */}
</div>
```

---

## 🎨 Visual Effects

### Glow Effects (Neon Theme)
```jsx
// Text glow with responsive intensity
className="text-glow" // Custom class with shadows

// Box glow
className="shadow-neon-green" // Custom shadow utility
```

### Animations
```jsx
// Scale on hover (desktop only)
className="hover:scale-105 transition-transform"

// Always animate on mobile (no hover)
className="animate-pulse sm:hover:animate-none"
```

---

## 📱 Mobile-Specific Utilities

### Hide/Show Elements
```jsx
// Hide on mobile
className="hidden sm:block"

// Show only on mobile
className="block sm:hidden"

// Hide on small mobile only
className="hidden min-[400px]:block"
```

### Safe Areas (iOS)
```css
/* Custom utilities in globals.css */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.pt-safe {
  padding-top: env(safe-area-inset-top, 0);
}
```

### Viewport Units
```jsx
// Use min-height instead of height
className="min-h-screen"  // ✅ Correct
className="h-screen"       // ❌ Can cause issues

// Custom viewport height for mobile
style={{ minHeight: '-webkit-fill-available' }}
```

---

## 🔧 Implementation Examples

### Complete Responsive Component
```jsx
function GameButton({ children, onClick, variant = 'primary' }) {
  const baseClasses = `
    min-h-[44px] rounded-lg font-orbitron font-bold
    transition-all duration-200
    ${variant === 'primary' 
      ? 'bg-black border-2 border-neon-green text-neon-green' 
      : 'bg-gray-800 border-2 border-gray-600 text-gray-400'}
  `
  
  const sizeClasses = variant === 'primary'
    ? 'px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-base sm:text-lg md:text-xl'
    : 'px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-sm sm:text-base'
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses}`}
    >
      {children}
    </button>
  )
}
```

---

## ✅ Pattern Validation

### Before Using a Pattern
1. Test at 375px width (iPhone SE)
2. Test at 768px width (iPad)
3. Test at 1920px width (Desktop)
4. Verify touch targets ≥ 44px
5. Check text remains readable

### Common Mistakes to Avoid
- ❌ Fixed pixel values: `w-[600px]`
- ✅ Responsive widths: `w-full max-w-2xl`

- ❌ Desktop-first: `text-2xl md:text-xl sm:text-base`
- ✅ Mobile-first: `text-base sm:text-xl md:text-2xl`

- ❌ Hover-only: `hover:bg-green-500`
- ✅ Touch-friendly: `active:bg-green-500 hover:bg-green-500`

---

**Remember**: Every pattern should enhance mobile experience first, then progressively enhance for larger screens!