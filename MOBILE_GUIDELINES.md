# Mobile Development Guidelines - Xtreme Reaction

**Created**: August 24, 2025  
**Purpose**: Ensure consistent mobile-first development across all phases

---

## 🎯 CORE PRINCIPLE: Mobile-First Design

The game MUST work perfectly on mobile devices first, then scale up to desktop. Most users will play on phones.

---

## 📱 Device Support Requirements

### Primary Targets
- **iPhone SE (375x667)** - Smallest common device
- **iPhone 14/15 (390x844)** - Standard modern iPhone
- **iPhone 14/15 Pro Max (430x932)** - Large iPhone
- **Samsung Galaxy S23 (360x780)** - Android flagship
- **iPad Mini (768x1024)** - Small tablet

### Critical Considerations
- Devices with notches (iPhone X+)
- Devices with hole-punch cameras (Android)
- Devices with home indicators
- Various aspect ratios (16:9 to 21:9)

---

## 🎨 Responsive Design Patterns

### Breakpoints (Tailwind)
```css
sm: 640px   /* Larger phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
```

### Text Sizing Pattern
```jsx
// ALWAYS use responsive text sizes
className="text-base sm:text-lg md:text-xl"  // Body text
className="text-2xl sm:text-3xl md:text-6xl"  // Headers
className="text-xs sm:text-sm md:text-base"   // Small text
```

### Spacing Pattern
```jsx
// Responsive padding/margins
className="p-2 sm:p-4 md:p-6"      // Container padding
className="mb-2 sm:mb-4 md:mb-8"   // Bottom margins
className="gap-2 sm:gap-4 md:gap-6" // Flex gaps
```

### Button Sizing
```jsx
// Mobile-friendly touch targets (min 44x44px)
className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4"
```

---

## 🚫 NEVER DO THIS

### Layout Mistakes
```jsx
// ❌ WRONG - Forces exact height, cuts off content
className="h-screen overflow-hidden"

// ✅ CORRECT - Allows content to fit
className="min-h-screen"
```

### Fixed Sizing
```jsx
// ❌ WRONG - Not responsive
className="text-6xl p-8 w-600px"

// ✅ CORRECT - Responsive
className="text-2xl sm:text-4xl md:text-6xl p-2 sm:p-4 md:p-8 w-full max-w-2xl"
```

### Missing Touch Considerations
```jsx
// ❌ WRONG - Too small for fingers
className="p-1 text-xs"

// ✅ CORRECT - Minimum 44px touch target
className="p-2.5 text-base min-h-[44px]"
```

---

## 📐 Safe Areas & Viewport

### iOS Safe Areas
```css
/* Always use safe area insets for iOS devices */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.pt-safe {
  padding-top: env(safe-area-inset-top, 0);
}
```

### Viewport Configuration
```jsx
// app/layout.tsx
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Critical for notched devices
}
```

---

## 🎮 Game-Specific Considerations

### Play Area Boundaries
```javascript
// Mobile gets more play area (80% vs 60% desktop)
Mobile:  10-90% horizontal, 25-75% vertical
Desktop: 20-80% horizontal, 30-70% vertical
```

### Target Sizing
- Mobile: Larger targets (compensate for finger size)
- Desktop: Standard targets (precise mouse control)
- Minimum: 44x44px on mobile

### UI During Gameplay
- **Minimal**: Only essential info during play
- **Top**: Round counter and score only
- **Hidden**: Detailed stats until game over
- **Floating**: Feedback messages that don't shift layout

---

## ✅ Mobile Testing Checklist

Before committing ANY changes:

### Visual Checks
- [ ] Text readable at arm's length
- [ ] Buttons easily tappable with thumb
- [ ] No content cut off at screen edges
- [ ] No horizontal scrolling
- [ ] Safe areas respected (notches/indicators)

### Interaction Checks
- [ ] Touch targets minimum 44x44px
- [ ] No hover-only interactions
- [ ] Double-tap prevention working
- [ ] Swipe doesn't trigger browser navigation

### Performance Checks
- [ ] 60 FPS animations on mid-range phones
- [ ] No janky scrolling
- [ ] Fast touch response (<100ms)
- [ ] Smooth transitions

### Device-Specific
- [ ] iPhone SE (smallest screen)
- [ ] iPhone with notch
- [ ] Android with hole-punch
- [ ] iPad orientation (if supported)

---

## 🔧 Debugging Mobile Issues

### Common Problems & Solutions

#### "Button cut off at bottom"
```jsx
// Add safe area padding and remove fixed heights
className="pb-safe mb-4"  // Not just mb-4
```

#### "Text too small to read"
```jsx
// Use larger base sizes for mobile
className="text-base sm:text-lg"  // Not text-xs
```

#### "Layout breaks on small phones"
```jsx
// Hide non-essential elements on mobile
className="hidden sm:block"  // Hide on mobile
```

#### "Targets hard to hit"
```jsx
// Increase touch target size
style={{ minWidth: '44px', minHeight: '44px' }}
```

---

## 📊 Testing Tools

### Browser DevTools
1. Chrome DevTools → Device Mode
2. Test these devices:
   - iPhone SE
   - iPhone 14 Pro
   - Samsung Galaxy S20
   - iPad

### Real Device Testing
- **Critical**: Always test on real devices before release
- **Minimum**: One iOS device, one Android device
- **Ideal**: Old iPhone (SE), new iPhone, Android phone

### Viewport Sizes to Test
- 375x667 (iPhone SE)
- 390x844 (iPhone 14)
- 360x780 (Android)
- 768x1024 (iPad)

---

## 🚀 Implementation Examples

### Responsive Game Container
```jsx
<main className="min-h-screen bg-black flex flex-col p-2 sm:p-4">
  {/* Content automatically adjusts */}
</main>
```

### Mobile-First Button
```jsx
<button className="
  px-4 sm:px-6 md:px-8 
  py-2.5 sm:py-3 md:py-4
  text-base sm:text-lg md:text-xl
  min-h-[44px]
">
  START GAME
</button>
```

### Adaptive Text
```jsx
<h1 className="
  text-2xl sm:text-3xl md:text-6xl
  mb-2 sm:mb-4 md:mb-6
">
  XTREME REACTION
</h1>
```

---

## 📝 Phase-Specific Notes

### Phase 11 (Sound)
- Test audio on mobile (often muted by default)
- Provide visual feedback when sound is muted

### Phase 12 (Performance Card)
- Ensure stats fit on small screens
- Consider scrollable area if needed

### Phase 14 (X Auth)
- OAuth must work in mobile browsers
- Handle app-to-browser transitions

### Phase 17 (Share)
- Mobile share API integration
- Screenshot sizing for mobile

---

## 🎯 Golden Rules

1. **Test on iPhone SE first** - If it works there, it works everywhere
2. **Fingers are fat** - Minimum 44x44px touch targets
3. **Thumbs reach bottom easier** - Important controls at bottom
4. **Less is more** - Hide non-essential elements on mobile
5. **Performance matters more** - Mobile CPUs are slower
6. **Network varies** - Optimize assets for 3G speeds
7. **Battery conscious** - Minimize animations when possible

---

**Remember**: The majority of users will play on mobile. Design for thumb-first interaction!