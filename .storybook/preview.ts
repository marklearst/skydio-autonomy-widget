import '../src/styles/tailwind.css'

import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'ActionWidget',
          'ActionControls',
          'IconButton',
          'Timer',
          'StatusMessage',
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#222831' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
}

export default preview
