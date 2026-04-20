# Copilot UI & Material Design 3 Guidelines

This project strictly follows the **M3 Expressive** design system. You must adhere to these rules whenever you generate code, create UI components, or apply styling.

## 1. Single Sources of Truth
- **Design System:** Reference DESIGN_SYSTEM.md for ALL visual decisions.
- **Motion & Shape:** Reference docs/project/M3_EXPRESSIVE_GUIDELINES.md for animation and border-radius rules.

## 2. Icon System (CRITICAL)
- **Primary Icons:** Use **Material Symbols Rounded** ONLY. Do NOT use Lucide React (it is legacy, migrate any you see).
- HTML usage: <span className="material-symbols-rounded">icon_name</span>
- **Active state:** ontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
- **Inactive/Default:** Use FILL=0.
- **No Emojis:** Never use emojis in any UI element (nav, buttons, badges, cards). Emojis are only allowed in static data config text.

## 3. Styling & Colors
- **Theme:** M3 Expressive Light. 
- **Palette Reference:**
  - Background: #FFFBFE
  - Primary: #6750A4
- **Typography:** Roboto font. Use .question-text utilities where applicable.
- **Components:** Use predefined utilities like .card, .btn-primary located in src/index.css.
- **FORBIDDEN:** 
  - NEVER use default Tailwind blue (#2563EB)
  - NEVER use neon colors
  - NEVER use ackdrop-filter blur
  - NEVER use arbitrary gba() layering

## 4. Stack
- React 19 + TypeScript
- Vite + Tailwind CSS 4
- Motion (for animations via motion components)
- Mobile-first layout (max-width: md), optimized for phone use.

Before making any UI modification, confirm you are aligning with these Material guidelines and relying on the design system markdown files.
