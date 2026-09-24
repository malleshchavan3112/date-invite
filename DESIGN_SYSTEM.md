# Design System

## Direction
Premium + playful + romantic + minimal.

Avoid:
- Generic dating-app UI
- Excessive hearts everywhere
- Clutter
- Cheap gradients
- Overly childish graphics

## Colors
- Background: `#FFF8F5`
- Primary: `#FF4F7B`
- Primary Hover: `#E8436B`
- Primary Subtle: `#FFF0F3`
- Dark (Text): `#1F1F1F` (15:1 contrast against `#FFF8F5`)
- Soft Pink: `#FFE4EC`
- White (Card/Surface): `#FFFFFF`
- Muted: `#6B7280` / `#4B5563`
- Border: `#F0D6DF`
- Sand Tones: `#FAF6F3`, `#F5EFEB`

## Typography
- Headings & Proposals: DM Serif Display
- Body & Interactive UI: Inter

## Components
- `PrimaryButton`: Gradient CTA with ambient pulse, spring hover/tap physics, and loading spinner
- `SecondaryButton`: Soft outline button with hover state and visible focus ring
- `NoEscapeButton`: Signature evasive NO button with physics-based proximity evasion and mobile touch escalation
- `ChoiceCard`: Single/multi-selection radio cards with touch target >= 48px, spring feedback, and checkmark badge
- `DateInviteCard`: Glassmorphic card surface (`bg-surface/95 backdrop-blur-md border border-border/80 shadow-card`)
- `DecorativeBackground`: Ambient blurred gradient orbs with drifting micro-petals
- `QuestionnaireProgress`: Header stepper with back navigation, step counter, and animated progress pills

## Interactive NO Button Specification

### 1. Desktop Pointer Proximity Interaction
- **Proximity Detection**: Monitors cursor coordinates relative to button center. Proximity threshold is 90px.
- **Escape Vector**: When cursor approaches within 90px, calculates escape vector pointing away from pointer.
- **Boundary Clamping**:
  - `minX: -15px` (strictly avoids moving left into YES button).
  - `maxX: 110px` (playful dodging to the right within card bounds).
  - `minY: -48px`, `maxY: 48px` (stays safely inside card boundary).
- **No Overlap Guarantee**: When cursor approaches from the right, the escape angle deflects vertically and maintains positive X offset to prevent collision with the YES button.
- **Anti-Jitter Throttle**: 220ms cooldown between moves prevents rapid jitter.
- **Spring Physics**: Framer Motion spring (`stiffness: 340, damping: 24, mass: 0.7`).

### 2. Dedicated Mobile Touch Model
- **Touch Detection**: Automatically identifies touch / coarse pointer environments via `window.matchMedia('(pointer: coarse)')` and touch events.
- **No Evasive Chase**: Mobile users are never forced into an impossible touch chase. The button stays stationary.
- **Playful Feedback**: On touch tap, executes a gentle spring wobble (`rotate: [-7, 7, -4, 4, 0]`) and displays a whimsical micro-hint (`Wait, really? 🥺`, `Are you sure? 💔`).
- **Honest Choice Preservation**: After playful interaction, a 3rd tap confirms and opens the respectful confirmation modal / step. The user is never trapped in the YES path.

### 3. Keyboard & Screen Reader Accessibility
- **No Keyboard Trap**: When focused via keyboard (`Tab`), the button immediately centers at `(0, 0)` and proximity evasion is completely disabled.
- **Standard Activation**: Activating via `Enter` or `Space` executes `onSelectNo()` cleanly.
- **Focus Rings**: High-contrast outline `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`.
- **Screen Reader Semantics**: Accessible button with descriptive `aria-label="No, decline invitation"`.

## Motion & Reduced-Motion Behavior
- All animations respect `@media (prefers-reduced-motion: reduce)`.
- When reduced-motion is requested:
  - Celebration burst renders a gentle opacity pulse instead of exploding particles.
  - Floating orbs and drifting petals become static with reduced opacity.
  - Page transitions switch to quick cross-fades without horizontal sliding.
  - Evasive dodging is disabled (`x: 0, y: 0`).

## Responsive Strategy
- Designed mobile-first, tested across:
  - Mobile: 360×800, 375×812, 390×844, 412×915, 430×932
  - Tablet: 768×1024, 1024×768
  - Desktop: 1280×720, 1440×900, 1920×1080
- Touch targets: minimum 44×44px on all interactive elements.
- Viewport safe areas: `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` applied to prevent mobile notch / home bar collisions.
