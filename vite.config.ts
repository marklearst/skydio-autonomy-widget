import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  optimizeDeps: { include: ['storybook/theming'] },
  plugins: [react(), tailwindcss(), svgr({ svgrOptions: { exportType: 'default' } })],
  test: {
    // Storybook adds preview transforms; retain a separate server for each test layer.
    sharedViteServer: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.tsx', 'src/**/*.stories.tsx', 'src/**/*.d.ts'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'behavior',
          include: ['src/**/*.test.tsx'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            // Check settled accessible states; dedicated motion tests exercise travel and interruption.
            provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      hooks: path.resolve(dirname, 'src/hooks'),
      components: path.resolve(dirname, 'src/components'),
      utils: path.resolve(dirname, 'src/utils'),
      icons: path.resolve(dirname, 'src/assets/icons'),
    },
  },
})
