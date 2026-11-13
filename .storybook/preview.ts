import "../src/styles/theme.css";

import type { Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";

const preview: Preview = {
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: ["Overview", ["Introduction", "Architecture", "Design system"], "Components", ["AutonomyWidget", "Buttons", "Controls", "Timer", "StatusMessage", "Tooltip"], "Foundation", ["Tokens"], "Engineering", ["Integration", "Component API", "Verification"]],
      },
    },
    controls: {
      expanded: true,
      sort: "requiredFirst",
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
      toc: { headingSelector: 'h2' },
      story: { autoplay: false },
      source: { dark: true },
    },

    a11y: {
      test: "error",
    },
    backgrounds: {
      options: {
        dark: { name: "dark", value: "var(--color-surface)" },
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: "dark",
    },
  },
};

export default preview;
