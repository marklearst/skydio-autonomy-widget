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
    IconButton/           # All-purpose action button
    ActionControls/       # Row of control buttons (desktop only)
    StatusMessage/        # Status text/message component
  hooks/                  # Custom hooks (breakpoint, timer logic)
  utils/                  # Shared utilities (e.g. time formatting)
  assets/                 # SVG/React icons
  styles/                 # Tailwind, tokens, and theme files
  types/                  # Shared TS types/interfaces
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

## 🛠 Linting & Formatting

- ESLint with TypeScript and React rules.
- Prettier for formatting (`.prettierrc`).
- See `eslint.config.js` for configuration.

---

## 📄 License

All code and deliverables are the property of Skydio, Inc. and provided under contract.