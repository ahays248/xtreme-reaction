# Mobile Testing Checklist ✅

**Use this checklist before EVERY commit to ensure mobile compatibility**

---

## 🔍 Quick Test (2 minutes)

### Chrome DevTools - iPhone SE (375x667)
- [ ] Open Chrome DevTools (F12)
- [ ] Toggle Device Mode (Ctrl+Shift+M)
- [ ] Select iPhone SE
- [ ] Refresh page

### Visual Checks
- [ ] **START GAME button visible** without scrolling
- [ ] **Text readable** at arm's length
- [ ] **No horizontal scroll** bar appears
- [ ] **No content cut off** at edges

### Interaction Checks
- [ ] **Buttons clickable** with cursor as touch
- [ ] **Targets appear** within screen bounds
- [ ] **Game ends properly** when expected

---

## 📱 Comprehensive Test (5 minutes)

### Test These Devices in DevTools
- [ ] iPhone SE (375x667) - Smallest
- [ ] iPhone 14 Pro (390x844) - Notch
- [ ] Samsung Galaxy S20 (360x800) - Android
- [ ] iPad (768x1024) - Tablet

### For Each Device Check

#### Home Screen
- [ ] Logo/title fits without wrapping
- [ ] Instructions are readable
- [ ] START GAME button fully visible
- [ ] High score displays properly

#### During Gameplay
- [ ] Round counter stays at top
- [ ] Score is visible
- [ ] Targets spawn within bounds
- [ ] Feedback messages don't overlap
- [ ] End Game button accessible

#### Game Over Screen
- [ ] All stats fit on screen
- [ ] Grade is prominent
- [ ] Score is readable
- [ ] PLAY AGAIN button visible
- [ ] MENU button visible

---

## 🚨 Common Issues to Check

### Button Problems
- [ ] Minimum 44x44px touch area
- [ ] Not too close to screen edge
- [ ] Not covered by phone UI (home bar)

### Text Issues
- [ ] Font size at least 14px (base)
- [ ] Good contrast (green on black)
- [ ] No text cutoff mid-word

### Layout Issues
- [ ] No fixed heights cutting content
- [ ] Safe areas for notched devices
- [ ] Proper padding on all sides

---

## 🎮 Real Device Test (If Available)

### iPhone Test
- [ ] Open in Safari
- [ ] Play full game
- [ ] Check notch doesn't hide content
- [ ] Home indicator doesn't block buttons

### Android Test
- [ ] Open in Chrome
- [ ] Play full game
- [ ] Check status bar spacing
- [ ] Navigation buttons don't interfere

---

## ⚡ Performance Checks

### On Mobile Device or Throttled DevTools
- [ ] Targets animate smoothly (60 FPS)
- [ ] No lag on button press
- [ ] Matrix rain doesn't cause stutter
- [ ] Page loads in < 3 seconds on 3G

---

## 🔄 Responsive Breakpoints

### Verify These Transitions
- [ ] 375px → 640px (mobile to large mobile)
- [ ] 640px → 768px (mobile to tablet)
- [ ] 768px → 1024px (tablet to desktop)

### Each Should
- [ ] Scale text appropriately
- [ ] Adjust spacing smoothly
- [ ] Maintain functionality

---

## ✅ Final Checklist

Before pushing to GitHub:

- [ ] Tested on iPhone SE viewport
- [ ] START GAME button visible
- [ ] Can play complete game
- [ ] Can see game over stats
- [ ] Can restart game
- [ ] No console errors

---

## 🚀 Quick Commands

### Test Build
```bash
npm run build
```

### Check TypeScript
```bash
npm run typecheck
```

### Push to Live
```bash
git add -A
git commit -m "your message"
git push
```

---

**Remember: If it works on iPhone SE (375x667), it works everywhere!**