# Rivit Design System – Controller Widget

A React-based, highly composable widget system for Skydio’s “Rivit” design language, focused on real-time control, timer, and action workflows.

## Features

- **Timer Ring**: Circular countdown with smooth animation, auto-sizing label, and icon fade-in support.
- **Action Buttons**: Single flexible `IconButton` handles all stateful actions (stop, play, expand, etc.), with variants for color, tooltip, and accessibility.
- **Action Controls Row**: (Desktop) Fully composable row of action buttons for advanced mission controls.
- **Responsive Layout**: Optimized for both desktop and mobile (1280px and below: only timer + main action; desktop: full controls).
- **Status Message**: Optional, dynamically updates based on action state or external input.
- **Accessible & Themeable**: Built with semantic markup, keyboard support, and dark/light theming via Tailwind.

## Code Structure

```plaintext
src/
  components/
    ActionWidget/         # Main widget, handles layout and responsive state
    Timer/                # Countdown ring, supports label/icon swap
    IconButton/           # All-purpose action button, uses named icons
    ActionControls/       # Row of control buttons (desktop only)
    StatusMessage/        # Status text/message component
  hooks/                  # Custom hooks (breakpoint, timer logic)
  utils/                  # Shared utilities (e.g. time formatting)
  assets/
    icons/                # SVG icons (named e.g. PlayIcon.svg), imported as React components via SVGR
    # other assets (images, fonts)
  styles/                 # Tailwind, tokens, and theme files
  types/                  # Shared TS types/interfaces
```

## Barrel Architecture

This project uses a barrel architecture pattern for module organization. Each major directory (e.g., `components/`, `hooks/`, `utils/`, `assets/icons/`) contains an `index.ts` file that re-exports all public modules, components, or assets in that directory. This approach:

- Simplifies imports throughout the codebase
- Promotes encapsulation and modularity
- Makes it easy to update, refactor, or swap implementations

**Example:**
```ts
// Importing a component from the barrel
import { IconButton } from './components/IconButton'

// Importing an icon from the icons barrel
import { PlayIcon } from './assets/icons'
```

## 🚀 Getting Started

1. **Install dependencies:**
   `pnpm install`
2. **Run Storybook:**
   `pnpm storybook`
3. **Run the Dev Server:**
   `pnpm dev`

---

## 🧑‍💻 Development Guidelines

- All UI components documented in Storybook.
- Use the shared `IconButton` for all interactive icons (including expand/collapse).
- Responsive by default: minimal UI on mobile, full controls on desktop.
- Exports via `index.ts` for each component folder.
- Prefer composable patterns (children, flexible props).
- Key UI states must have a corresponding Storybook story.
- Follow project ESLint and Prettier configs.

---

## 🎨 Tailwind CSS

This project leverages the full power of [Tailwind CSS](https://tailwindcss.com/) for all styling, layout, and design system implementation. Our setup combines the core `tailwindcss` framework with the official [`@tailwindcss/vite`](https://tailwindcss.com/docs/guides/vite) plugin, ensuring lightning-fast builds, instant hot-reloading, and seamless integration with Vite and Storybook.

- **Atomic Design Tokens:**
  - All colors, spacing, typography, and radii are managed via Tailwind's config and extended in `src/styles/theme.ts` for consistency and rapid theming.
- **Utility-First Workflow:**
  - Components are styled exclusively with Tailwind utility classes, ensuring a scalable and maintainable UI foundation.
- **Zero Custom CSS:**
  - No custom CSS is written except for global resets or rare edge cases. All visual rules are encoded in Tailwind for clarity and portability.
- **Storybook Integration:**
  - Tailwind is fully loaded in Storybook via `.storybook/preview.ts` for pixel-perfect component previews and documentation.
- **Best Practices:**
  - Responsive, state, and dark mode variants are used throughout for robust, accessible, and adaptive UI.
  - All new components and UI states are built and documented using Tailwind conventions.

> **Why Tailwind?**
>
> Tailwind CSS enables rapid prototyping, strict design system adherence, and effortless scaling from MVP to enterprise. By codifying design tokens and using atomic utilities, we ensure every pixel is intentional and every component is consistent—no matter how complex the UI becomes.

---

## 🛠 Linting & Formatting

- ESLint with TypeScript and React rules.
- Prettier for formatting (`.prettierrc`).
- See `eslint.config.js` for configuration.

---

## 📄 License

All code and deliverables are the property of Skydio, Inc. and provided under contract.