import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    jsx: 'automatic'
  },
  resolve: {
    alias: {
      '@yearn/util': path.resolve(__dirname, '../util/src'),
      '@yearn/components': path.resolve(__dirname, '../components/src'),
      '@yearn/vaults': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'node'
  }
})
