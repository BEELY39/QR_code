---
name: Dynamic Pop Studio
colors:
  surface: '#faf8ff'
  surface-dim: '#dad9e1'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fb'
  surface-container: '#eeedf5'
  surface-container-high: '#e9e7f0'
  surface-container-highest: '#e3e1ea'
  on-surface: '#1a1b21'
  on-surface-variant: '#464556'
  inverse-surface: '#2f3036'
  inverse-on-surface: '#f1f0f8'
  outline: '#777588'
  outline-variant: '#c7c4d9'
  surface-tint: '#4d3cf2'
  primary: '#412ce7'
  on-primary: '#ffffff'
  primary-container: '#5b4dff'
  on-primary-container: '#efebff'
  inverse-primary: '#c4c0ff'
  secondary: '#b4252d'
  on-secondary: '#ffffff'
  secondary-container: '#fe5b5b'
  on-secondary-container: '#60000b'
  tertiary: '#005e56'
  on-tertiary: '#ffffff'
  tertiary-container: '#00796f'
  on-tertiary-container: '#9dfff1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c0ff'
  on-primary-fixed: '#110068'
  on-primary-fixed-variant: '#3311dc'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3af'
  on-secondary-fixed: '#410005'
  on-secondary-fixed-variant: '#920418'
  tertiary-fixed: '#63f9e8'
  tertiary-fixed-dim: '#3edccc'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#faf8ff'
  on-background: '#1a1b21'
  surface-variant: '#e3e1ea'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '800'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The brand personality is energetic, approachable, inventive, and polished. Designed for creators, independent entrepreneurs, hospitality brands, and modern marketing teams, it transforms functional QR codes into engaging visual assets.

The visual direction marries modern SaaS precision with warm, tactile playfulness. Moving strictly away from neo-brutalism and industrial harshness, the interface uses generous curvatures, warm-tinted neutral canvases, juicy gradients, and luminous pill badges. Micro-interactions should feel bouncy and responsive, pairing refined utility with celebratory visual flair.

## Colors
The palette relies on high-energy chroma balanced by an ultra-soft, warm cream base:
- **Primary (`#5B4DFF`)**: Vibrant Electric Indigo. Used for primary calls-to-action, active studio navigation, and high-priority QR actions.
- **Secondary (`#FF5C5C`)**: Energetic Punch Coral. Anchors alerts, promo highlights, vibrant badges, and dynamic export toggles.
- **Tertiary (`#00C4B4`)**: Fresh Lagoon Mint. Accents customization states, success confirmations, and analytics badges.
- **Accent Gold (`#FFB800`)**: Solar Amber. Reserved for preset highlights, VIP templates, and dynamic stickers.
- **Base Canvas (`#FAF8F5`)**: Soft warm off-white that prevents eye fatigue and avoids the clinical coldness of pure `#FFFFFF`.
- **Card Surfaces (`#FFFFFF`)**: Pure white layered over the warm canvas to produce organic separation without harsh strokes.
- **Neutral Text (`#1F2026`)**: Deep charcoal-slate providing high-contrast readability without absolute black hardness.

## Typography
Plus Jakarta Sans is used globally across all levels. Its rounded geometric architecture, generous apertures, and friendly presence complement playful curved controls while maintaining legibility at compact interface scales.

Headlines leverage tight negative tracking and bolder weights (`700` and `800`) to create a confident editorial hierarchy. Micro-copy and chips utilize `label-caps` in uppercase styling with widened tracking to ensure quick legibility on colorful pastilles.

## Layout & Spacing
The layout follows a fluid 12-column grid system capped at a maximum width of 1440px for wide desktop screens. 

- **Desktop (1024px and above)**: Two-panel studio workstation. The left/main column (7–8 columns) houses the granular customization canvas (modules, colors, patterns, logos), while the right column (4–5 columns) remains sticky for real-time QR rendering, scale testing, and immediate export actions. Gutter is set to `1.5rem` and outer margin to `2rem`.
- **Tablet (768px – 1023px)**: Single column with tabbed switching between “Design Studio” and “Live Preview & Export”. Gutter adjusts to `1.25rem` with a `1.5rem` margin.
- **Mobile (below 768px)**: Stacked single-column experience with horizontal scrolling pill carousels for pattern and color pickers. The preview stays docked as an expandable bottom floating sheet. Gutter and margin scale to `1rem`.

## Elevation & Depth
Depth is built on ambient, diffused light rather than physical drop shadows or heavy strokes. Pure black shadows are forbidden; all shadows are lightly tinted with indigo slate (`rgba(31, 32, 70, 0.06)`).

- **Flat / Canvas Level (Level 0)**: Background `#FAF8F5`.
- **Card Base (Level 1)**: White surfaces `#FFFFFF` with soft diffused shadow: `0 4px 20px -2px rgba(91, 77, 255, 0.05), 0 2px 6px -1px rgba(31, 32, 70, 0.03)` and a subtle ambient border `1px solid rgba(31, 32, 70, 0.05)`.
- **Floating Controls & Modals (Level 2)**: Elevated tooltips, color popovers, and sticky preview cards use: `0 12px 36px -4px rgba(91, 77, 255, 0.08), 0 4px 12px -2px rgba(31, 32, 70, 0.04)`.
- **Active Interactive Drag / Pick (Level 3)**: Active color swatches and dragged logo overlays lift with: `0 20px 48px -6px rgba(91, 77, 255, 0.16)`.

## Shapes
Shapes use high-radius values across all components to cultivate a welcoming, organic aesthetic.
- Buttons, chips, search bars, and tags are fully pill-shaped (`9999px`).
- Input fields and tool cards use `rounded-2xl` (1rem / 16px).
- Large preview viewports, QR code containers, and modal sheets use `rounded-3xl` (1.5rem to 2rem / 24px–32px).
- Internal QR code matrix corner eyes mimic these rounded aesthetics via curved concentric styling.

## Components

### Buttons
- **Primary**: Solid Indigo `#5B4DFF` with white text, fully pill-shaped (`rounded-full`), padded `12px 24px`. On hover, shifts to `#4A3CE6` with an elevation increase.
- **Secondary**: Tinted coral pastille (`#FFF0F0`) with coral text (`#FF5C5C`), hover to `#FFE2E2`.
- **Tertiary / Ghost**: Transparent with primary text, hover with a soft wash of `#5B4DFF` at 8% opacity.

### Chips & Badges
- Pill-shaped tags with uppercase `label-caps` typography. 
- Tone-on-tone coloring: Mint chip (`#E6FAF8` background, `#008C81` text), Amber chip (`#FFF8E6` background, `#B87B00` text), Coral chip (`#FFF0F0` background, `#FF5C5C` text).
- Interactive filter chips include an animated checkmark micro-icon.

### Inputs & Selectors
- Background: `#FFFFFF`.
- Border: `1.5px solid rgba(31, 32, 70, 0.08)`, transitioning to `1.5px solid #5B4DFF` on focus with a subtle glow `0 0 0 4px rgba(91, 77, 255, 0.12)`.
- Height: 48px with `rounded-xl` curvature and integrated leading iconography.

### Cards & Tool Tiles
- White `#FFFFFF` base on cream canvas, padded with `space-lg`.
- Feature modular toggles for dot styles (smooth, rounded, square, leafy) and eye styles (framed, rounded circle, teardrop).
- Selected tile state: framed in `2px solid #5B4DFF` with a subtle primary color tint (`#F6F5FF`).

### QR Code Viewport & Customizer
- Centered on a generous `rounded-3xl` canvas with an optional dynamic mesh gradient preview backdrop.
- Equipped with quick-action floating pill switches (Download PNG, SVG, PDF, or Share link).
- Integrated live frame selector allowing quick application of branded frames ("SCAN ME", "VISIT MENU", "JOIN WI-FI").