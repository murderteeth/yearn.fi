import { existsSync } from 'fs'
import path from 'path'
import { defineConfig } from 'vitest/config'

/**
 * Bun workspaces hoist dependencies to the monorepo root, but a nested
 * `node_modules` can still appear when versions conflict. Probe both.
 */
const resolveHoisted = (relativePath: string): string =>
  [
    path.resolve(__dirname, './node_modules', relativePath),
    path.resolve(__dirname, '../../node_modules', relativePath)
  ].find(existsSync) ?? path.resolve(__dirname, '../../node_modules', relativePath)

export default defineConfig({
  esbuild: {
    jsx: 'automatic'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/components/shared'),
      '@pages': path.resolve(__dirname, './src/components/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@plausible-analytics/tracker': resolveHoisted('@plausible-analytics/tracker/plausible.js')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    server: {
      deps: {
        inline: ['@shared']
      }
    }
  }
})
