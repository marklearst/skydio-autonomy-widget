# Rivit Design System – Autonomy Widget

A React-based, highly composable widget system for Skydio’s “Rivit” design language, focused on real-time control, timer, and autonomy workflows.


## 🚀 Full Feature List

- **Action-Driven Architecture**: Central, declarative config (`ACTION_CONFIGS`) powers all UI, ensuring Figma parity and rapid extensibility.
- **Context-Based State Management**: Unified state/context provider for all widget state, actions, and derived UI.
- **Configurable Button Sets**: Each action defines its own button set, icon, tooltip, and label—fully customizable.
- **Dynamic Timer with Icon Swap**: Circular countdown ring with animated icon transitions, responsive to state and action.
- **OrbitSlider**: Custom slider with dual progress indicators, chevron controls, and locked distance display for orbit mode.
- **Responsive Layout**: Compact mode (mobile) and expanded mode (desktop) with automatic adaptation.
- **Status Message**: Dynamic, expandable message area for mission status, errors, and notifications.
- **Figma-Exported SVG Icon Library**: All icons are Figma-exported SVGs, imported as React components with full theming and accessibility support.
- **Design Tokens & Tailwind v4**: Themeable via CSS custom properties and Tailwind tokens for colors, radii, and typography.
- **Accessible by Default**: Semantic markup, keyboard navigation, ARIA labels, and accessible tooltips.
- **Storybook Coverage**: Every component, state, and edge case is documented and testable in Storybook.
- **API-Like Integration**: Emulates a UI API for remote control, state sync, event hooks, and analytics.
- **Composable Barrel Architecture**: All modules, icons, and components are re-exported via directory `index.ts` for clean, scalable imports.
- **Dark/Light Theme Support**: Easily toggle between light and dark modes with design tokens.
- **Mission Grouping Logic**: Supports Waypoint, RTD, Orbit, Paused, Tracking, and more, each with unique UI behaviors.
- **Live Design Token Previews**: See and test every color, radius, and font in Storybook.
- **Extensible for Future Missions**: Add new actions, icons, or control sets in minutes.

---

## 🏛️ Stout Architecture & Component UI

The AutonomyWidget is engineered for scale, clarity, and design system rigor. Every component is a pure, dumb UI building block, orchestrated by a context-driven provider and a single source-of-truth config. This ensures:

- **Separation of Concerns**: UI components never hold business logic; all state and behavior are injected via context and config.
- **Pure Renderer Philosophy**: Components render only what they're told—no hidden state, no side effects.
- **Config-Driven Everything**: All actions, icons, and controls are mapped in `AutonomyWidget.configs.ts`, making UI parity with Figma effortless.
- **Atomic & Composable**: Components are small, focused, and designed to be composed for complex UIs.
- **Config-Driven**: All mission logic, icons, and controls are managed via a single source-of-truth config for easy extension and maintenance.
- **Barrel Exports**: Every directory exports a clean interface via `index.ts`, so imports are always intuitive and scalable.
- **Atomic Design**: Components are small, focused, and composable—ideal for rapid prototyping and robust production use.
- **TypeScript First**: Every prop, state, and config is strongly typed for confidence and safety.

### Component UI Map

- **AutonomyWidget**: The root layout, orchestrates context and renders all subcomponents.
- **Button**: Universal autonomy action button, supports icon, label, variant, tooltip, and accessibility.
- **Controls**: Row of autonomy buttons for mission control (desktop only).
- **Timer**: Circular countdown with icon swap and tooltip, responsive to mission state.
- **OrbitSlider**: Specialized slider for orbit actions, with dual indicators and chevron controls.
- **StatusMessage**: Expandable, styled area for mission status, errors, and info.
- **Tooltip**: Custom, accessible tooltip for all interactive elements.
- **Icon Library**: Figma-exported SVGs, imported as React components for full theme and a11y support.

---

## 🧭 Storybook Navigation & Usage Tips

**Component Discovery:**
Use the Storybook sidebar to browse by component, state, or design token. Components are grouped by function and mission type for intuitive navigation.

**Docs Tab:**
Every component includes a “Docs” tab featuring usage guidelines, prop tables, and live code examples.

**Controls & Knobs:**
Use Storybook Controls to interactively adjust props (actions, icons, states) and instantly preview UI updates.

---

## 📝 Storybook Design System Documentation

- **Component Stories**: Every component (Button, Timer, Controls, OrbitSlider, StatusMessage, Tooltip) has exhaustive stories for:
  - All variants (primary, secondary, danger, etc.)
  - All states (default, active, disabled, loading, etc.)
  - Responsive behavior (mobile/desktop)
  - Accessibility features (keyboard, screen reader)
  - Theming and dark mode

- **AutonomyWidget Stories**:
  - Stories for every major mission/action (Waypoint, RTD, Orbit, Paused, Tracking, etc.)
  - Interactive controls for switching mission type, state, and view
  - Realistic mission flows and error states

- **Design Tokens Documentation**:
  - Stories and documentation for all design tokens (colors, spacing, radii, typography)
  - Live preview of theme changes via Storybook controls

- **Usage Recipes**:
  - Code examples for wrapping with provider, consuming context, and extending configs
  - Recipes for integrating with APIs, analytics, and custom themes

- **Best Practices**:
  - Guidelines for adding new actions, icons, or controls
  - Accessibility requirements for new components
  - How to maintain Figma parity and update tokens

---

## Code Structure

```plaintext
src/
  components/
    AutonomyWidget/
      AutonomyWidget.tsx            # Main widget, pure renderer
      AutonomyWidget.configs.ts     # Central action/button/icon config mapping
      AutonomyWidget.types.ts       # All widget types/interfaces
      AutonomyWidget.context.tsx    # React Context for state sharing
      AutonomyWidget.provider.tsx   # Provider for unified state/logic
      hooks/
        useAutonomyWidget.ts        # Unified state hook
    Timer/                          # Countdown ring, supports label/icon swap, tooltip
    Button/                         # All-purpose autonomy button, variants, icons, tooltips
    Controls/                       # Row of autonomy control buttons (desktop only)
    OrbitSlider/                    # Orbit mode slider with chevrons, dual indicators
    StatusMessage/                  # Status text/message component
    Tooltip/                        # Custom, accessible tooltip
    # index.ts in each folder for barrel exports
  hooks/                            # Custom hooks (breakpoint, timer logic, etc)
  utils/                            # Shared utilities (e.g. time formatting)
  assets/
    icons/                          # Figma-exported SVG icons, imported as React components via SVGR
    # other assets (images, fonts)
  styles/
    theme.css                       # Tailwind v4 theme, design tokens, color palette
    # other Tailwind, global, and token files
  types/                            # Shared TypeScript types/interfaces
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
- Use the shared `IconButton` for all interactive autonomy icons (including expand/collapse).
- Responsive by default: minimal UI on mobile, full controls on desktop.
- Exports via `index.ts` for each component folder.
- Prefer composable patterns (children, flexible props).
- Key UI states must have a corresponding Storybook story.
- Follow project ESLint and Prettier configs.

---

## 🧩 Context API & Config-Driven State Management

The AutonomyWidget now uses a modern, context-driven architecture for unified state and configuration. All widget state, actions, and UI are managed via a React Context Provider and a central config mapping, making the widget highly reusable and easy to extend.

### How It Works

- **Provider:**
  Wrap your widget (or app section) with `<AutonomyWidgetProvider initialState={...}>`. The provider manages all widget state and exposes it via context to all children.

- **Context:**
  Use the `AutonomyWidgetContext` to access state, dispatch actions, or read derived UI properties anywhere in the widget tree.

- **Config Mapping:**
  All action-driven UI (buttons, icons, labels, tooltips) is defined in a central config (`AutonomyWidget.configs.ts`). This ensures Figma parity and makes it easy to update or extend supported actions.

### Example Usage

```tsx
import {
  AutonomyWidgetProvider,
  useAutonomyWidget,
} from './components/AutonomyWidget';

const initialState = {
  action: 'flying-to-point',
  // ...other state fields
};

export default function App() {
  return (
    <AutonomyWidgetProvider initialState={initialState}>
      <AutonomyWidget />
    </AutonomyWidgetProvider>
  );
}

// Access context anywhere in the widget tree:
const { state, setState, config } = useAutonomyWidget();
```

### Extending or Customizing

- **Add new actions or buttons:**
  Update `AutonomyWidget.configs.ts` with new action configs.
- **Custom state or logic:**
  Extend the context/provider or use the provided hooks for advanced integrations.
- **Theme and tokens:**
  The widget uses design tokens and Tailwind v4 for consistent styling; update `theme.css` for custom themes.

### Advanced Usage

#### 1. Programmatically Updating State

You can update the widget state from anywhere in the tree using the context hook:

```tsx
const { state, setState } = useAutonomyWidget();

// Example: Pause the mission
setState(prev => ({ ...prev, action: 'mission-paused' }));
```

#### 2. Listening to State Changes

React to widget state changes in your own components:

```tsx
const { state } = useAutonomyWidget();

useEffect(() => {
  if (state.action === 'return-to-home') {
    // Trigger analytics, notifications, etc.
  }
}, [state.action]);
```

#### 3. Extending the Action Config

Add a new action with custom buttons and icons:

```ts
// In AutonomyWidget.configs.ts
ACTION_CONFIGS['my-custom-action'] = {
  name: 'Custom Action',
  timerIcon: 'c_route', // Use any available icon name
  buttons: [
    { icon: 'c_play', label: 'Start', onClick: () => {/* ... */} },
    // ...more buttons
  ],
  primaryButton: { icon: 'm_stop_sign', label: 'Stop', onClick: () => {/* ... */} },
};
```

#### 4. Integrating with External Systems

You can synchronize widget state with external APIs, Redux, or parent app state:

```tsx
const { state, setState } = useAutonomyWidget();

// Example: Update widget when drone status changes
useEffect(() => {
  if (drone.status === 'paused') {
    setState(prev => ({ ...prev, action: 'mission-paused' }));
  }
}, [drone.status]);
```

#### 5. Custom Theming

Override theme tokens or Tailwind classes for brand integration:

- Edit `src/styles/theme.css` to change color palette, radii, or typography.
- Use Tailwind's `@apply` to add utility classes to your own components.

#### 6. Consuming Derived UI State

The context exposes derived fields (e.g., current config, button set, timer icon) for advanced UI composition:

```tsx
const { config } = useAutonomyWidget();
return <span>Current action: {config.name}</span>;
```

### Legacy State/Config

> **Note:**
> Previous state/config APIs are deprecated. All new integrations should use the context/provider and config-driven approach described above.

---

## 🛡️ API Emulation & Integration Patterns

The config-driven architecture of the AutonomyWidget is designed to emulate a robust UI API, enabling seamless integration with external systems, SDKs, or cloud services. This pattern allows the widget to behave like a "UI microservice" that can be controlled, extended, or observed programmatically—just like a traditional API.

### How the Widget Emulates an API

- **Declarative Config as API Schema:**
  - The `ACTION_CONFIGS` object acts as an API schema for all supported actions, buttons, icons, and UI states.
  - Adding or modifying actions is as simple as updating the config, similar to updating an API endpoint or contract.

- **Context as API Surface:**
  - The React context (`useAutonomyWidget`) exposes state, config, and update methods, emulating API calls for getting/setting widget state.
  - Consumers can subscribe to state changes, trigger actions, or inject new configs at runtime.

- **Event Hooks:**
  - Consumers can listen for state transitions (e.g., mission started, paused, completed) and trigger side effects, analytics, or remote calls.

### Suggested API Integration Patterns

- **Remote State Sync:**
  - Sync widget state with a backend or device API (e.g., drone telemetry) by calling `setState` in response to remote events.
  - Example: When a REST/WebSocket API signals "mission-paused", update the widget state accordingly.

- **Config Injection:**
  - Dynamically inject or override action configs at runtime, allowing the API to define available actions, button sets, or labels.
  - Example: Fetch a config JSON from an API and merge it into `ACTION_CONFIGS` before rendering.

- **Command/Control Interface:**
  - Expose imperative methods (e.g., `startMission()`, `pauseMission()`, `setAction('orbit')`) that update widget state and UI, mirroring traditional API endpoints.
  - Example: Parent app provides an interface for external scripts or SDKs to control the widget.

- **Event Subscription:**
  - Provide hooks or callbacks for external consumers to listen for action changes, button presses, or timer events.
  - Example: Pass an `onActionChange` prop to the provider, or use a custom event emitter inside the context.

- **Analytics & Telemetry:**
  - Automatically emit events on state transitions, button clicks, or timer completions to external analytics or telemetry APIs.

### Example: Integrating with an External API

```tsx
// Sync widget state with an external drone API
useEffect(() => {
  api.on('missionUpdate', (status) => {
    setState(prev => ({ ...prev, action: status.action }));
  });
}, []);

// Emit widget events to analytics
useEffect(() => {
  if (state.action === 'landing') {
    analytics.track('Widget:LandingStarted');
  }
}, [state.action]);
```

> **Tip:**
> For large-scale apps, consider wrapping the widget in a higher-order provider that bridges between your API and the widget context, handling all sync, events, and config injection in one place.

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

## 📚 Storybook v9

This project uses [Storybook v9](https://storybook.js.org/) as the single source of truth for component documentation, design review, and UI state validation.

- **Vite Integration:**
  - Storybook is configured to run with Vite for fast builds and instant feedback.
- **Tailwind Support:**
  - All Tailwind CSS styles are loaded in Storybook for perfect design fidelity.
- **Component-Driven:**
  - Every UI component and key state is documented as a Storybook story, supporting rapid prototyping and stakeholder review.
- **Accessibility & Testing:**
  - Addons like `@storybook/addon-a11y` and `@storybook/addon-vitest` are included for accessibility checks and interactive testing.

> **Why Storybook?**
>
> Storybook enables scalable, collaborative UI development. Designers, engineers, and PMs can all review and validate components in isolation, ensuring quality and consistency before integration.

---

## 🛠 Linting & Formatting

- ESLint with TypeScript and React rules.
- Prettier for formatting (`.prettierrc`).
- See `eslint.config.js` for configuration.

---

## 📄 License

All code and deliverables are the property of Mark Learst, Inc. and provided under contract.
**Ownership is retained by Mark Learst, Inc. until full payment is received.**

---

## 📝 Changelog

### v2.0.0 (2025-07-28)
- Full config-driven, context/provider architecture
- Unified `AutonomyWidgetProvider` and state hook
- Central `ACTION_CONFIGS` for all UI logic
- Figma-exported SVG icon system
- Tailwind v4 and design tokens for full theming
- OrbitSlider with dual indicators and chevron controls
- Pure renderer component structure, barrel exports
- Complete Storybook coverage for all states and tokens
- API-like integration patterns and advanced usage

### v1.0.0 (2025-06-01)
- Initial release: Timer, Button, Controls, StatusMessage, basic Storybook

---

## 🤝 Guidelines

**Component Naming:**
Use PascalCase for components, camelCase for props, and kebab-case for file names.

**Commit Messages:**
Follow [Conventional Commits](https://www.conventionalcommits.org/) for all PRs.

> **Tip:** See the "Best Practices" and "Storybook Design System Documentation" sections above for architectural and UI guidelines.

---

## 🛠️ Storybook Addons Used

- **@storybook/addon-essentials:** Controls, Docs, Actions, Viewport, Backgrounds, etc.
- **@storybook/addon-a11y:** Accessibility checks and recommendations
- **@storybook/addon-themes:** Light/dark mode switching
- **@storybook/addon-interactions:** For interactive stories
- **@storybook/addon-docs:** For Markdown/MDX documentation

---

## ❓ FAQ

**How do I add a new mission or action?**
- Edit `AutonomyWidget.configs.ts` and add a new entry to `ACTION_CONFIGS`.
- Add any new icons to `assets/icons/` and export them in the icons index.
- Document the new action in Storybook.

**Can I control the widget from an external API?**
- Yes! Use the context hook (`useAutonomyWidget`) to update state in response to API events.
- See the API Emulation & Integration Patterns section for full examples.

**How do I add a new icon?**
- Export the SVG from Figma, add to `assets/icons/`, and import with `?react`.
- Re-export from the icons index file for easy use.