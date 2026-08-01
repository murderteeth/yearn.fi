import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@yearn/util': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'node'
  }
})
