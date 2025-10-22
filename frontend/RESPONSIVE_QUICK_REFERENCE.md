# Responsive Design Quick Reference

## Breakpoints Summary

| Device Type | Width Range | Key Changes |
|------------|-------------|-------------|
| **Desktop** | > 1024px | Default full layout |
| **Tablet** | 768px - 1024px | 2-column grids, reduced spacing |
| **Mobile** | 480px - 768px | Single column, stacked navigation |
| **Small Mobile** | 360px - 480px | Compact sizing, optimized touch |
| **Extra Small** | < 360px | Minimal layout, essential content |

## Component Responsive Behavior

### Navbar
```
Desktop:  [Logo] [Links...] [Notifications] [User] [Logout]
Tablet:   [Logo] [Links...] [Notifications] [User] [Logout]
Mobile:   [Logo]
          [Link 1]
          [Link 2]
          [Notifications]
          [User Info]
          [Logout Button]
```

### Machine Grid
```
Desktop:  [Card] [Card] [Card]
          [Card] [Card] [Card]

Tablet:   [Card] [Card]
          [Card] [Card]

Mobile:   [Card]
          [Card]
          [Card]
```

### Forms
```
Desktop:  [Label] [Input --------]
          [Label] [Input --------]

Mobile:   [Label]
          [Input ----------------]
          [Label]
          [Input ----------------]
```

### Notifications
```
Desktop/Tablet: Dropdown from bell icon (400px wide)

Mobile: Bottom sheet modal (full width, 80vh height)
        ┌─────────────────────┐
        │                     │
        │   Notifications     │
        │   [List...]         │
        │                     │
        └─────────────────────┘
```

## Typography Scale

| Element | Desktop | Tablet | Mobile | Small |
|---------|---------|--------|--------|-------|
| h1 | 2.5rem | 2rem | 1.75rem | 1.5rem |
| h2 | 2rem | 1.75rem | 1.5rem | 1.375rem |
| h3 | 1.5rem | 1.35rem | 1.25rem | 1.125rem |
| body | 16px | 15px | 14px | 14px |
| button | 1rem | 1rem | 0.95rem | 0.875rem |

## Spacing Scale

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Container padding | 2rem | 1.5rem | 1rem |
| Card padding | 2rem | 1.5rem | 1.25rem |
| Button padding | 0.75rem 1.5rem | 0.75rem 1.25rem | 0.625rem 1rem |
| Section padding | 6rem 2rem | 4rem 1.5rem | 3rem 1rem |

## Touch Targets

Minimum sizes for mobile:
- Buttons: 44px × 44px
- Links: 44px × 44px
- Icons: 24px × 24px (with 44px touch area)

## Common Patterns

### Responsive Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
```

### Responsive Container
```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1.5rem 1rem;
  }
}
```

### Responsive Typography
```css
h1 {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
}
```

## Testing Checklist

- [ ] Test on iPhone SE (375px)
- [ ] Test on iPhone 12 (390px)
- [ ] Test on iPad (768px)
- [ ] Test on iPad Pro (1024px)
- [ ] Test on Desktop (1920px)
- [ ] Test landscape orientation
- [ ] Test touch interactions
- [ ] Test form zoom on iOS
- [ ] Test table scrolling
- [ ] Test notification panel

## Quick Fixes

### Prevent iOS Zoom on Input Focus
```css
input, textarea, select {
  font-size: 16px; /* Minimum to prevent zoom */
}
```

### Enable Smooth Scrolling on iOS
```css
.scrollable {
  -webkit-overflow-scrolling: touch;
  overflow-x: auto;
}
```

### Full Width on Mobile
```css
@media (max-width: 768px) {
  .element {
    width: 100%;
  }
}
```

### Hide on Mobile
```css
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
}
```

## Resources

- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [CSS Tricks - Media Queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

**Quick Tip**: Use Chrome DevTools Device Mode (Ctrl+Shift+M) for rapid responsive testing!
