# RecruitReady Enhancement - Development Plan

## Design Guidelines
- **Style**: Military Dark Mode, existing design system maintained
- **Color Palette**: Primary #0F1419 (bg), #1E2A3A (cards), #1A2332 (sidebar), Green #22C55E (accent)
- **Typography**: System defaults from shadcn/ui, font-extrabold for headings
- **Key Styles**: Dark cards with #2D3B4E borders, green accent for CTAs

## Development Tasks

### Files to Create/Modify (8 file limit):
1. **src/lib/api-helpers.ts** (NEW) - Cloud sync helper functions using web-sdk client for progress entries and user preferences
2. **src/hooks/useAuth.ts** (NEW) - Auth hook for login state, user info, subscription tier
3. **src/pages/BMI.tsx** (NEW) - BMI Calculator page with height/weight inputs, BMI result, category display, health tips
4. **src/pages/Pricing.tsx** (NEW) - Subscription plans page showing Recruit (Free), Soldier (£4.99/mo), Officer (£9.99/mo) tiers
5. **src/components/Layout.tsx** (MODIFY) - Add BMI & Pricing nav items, add auth button (login/avatar), mobile-optimized bottom nav
6. **src/pages/Index.tsx** (MODIFY) - Add auth-aware dashboard, cloud sync status indicator, BMI quick link
7. **src/pages/Progress.tsx** (MODIFY) - Cloud sync progress entries (save to DB when logged in, localStorage fallback when not)
8. **src/App.tsx** (MODIFY) - Add BMI and Pricing routes

### Feature Summary:
- **Auth**: Login/logout via web-sdk, avatar icon in header
- **Cloud Sync**: Progress entries sync to backend when logged in, localStorage fallback
- **BMI Calculator**: Height (cm/ft), weight (kg/lbs), BMI result with category and color coding
- **Subscription Tiers**: Recruit (Free), Soldier (£4.99/mo), Officer (£9.99/mo) - display only (no Stripe yet)
- **Mobile Optimization**: Already good, ensure bottom nav includes new pages