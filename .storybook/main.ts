import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const config: StorybookConfig = {
  stories: [
    '../src/components/ActionWidget/ActionWidget.stories.tsx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    {
      name: '@storybook/addon-themes',
      options: {
        themes: {
          default: 'dark', // Enforce dark mode
          list: [
            { name: 'Light', class: 'light', color: '#ffffff' },
            { name: 'Dark', class: 'dark', color: '#1a1a1a' },
          ],
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [
        svgr({
          svgrOptions: { exportType: 'default' },
        }),
      ],
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `
              @import "tailwindcss/base";
              @import "tailwindcss/components";
              @import "tailwindcss/utilities";
              @layer base {
                :root { @apply bg-gray-900 text-white; }
                .light { @apply bg-white text-black; }
                .dark { @apply bg-gray-900 text-white; }
              }
            `,
          },
        },
      },
    })
  },
}

export default config
