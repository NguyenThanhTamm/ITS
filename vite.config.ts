import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// GITHUB_PAGES_BASE is injected by the GitHub Actions workflow
// Set it to your repo name, e.g. '/ITS_Landing'
const base = process.env.GITHUB_PAGES_BASE ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})

