import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Actions sets the repository name for project pages; local builds use `/`.
export default defineConfig({
  plugins: [vue()],
  base: process.env.GITHUB_ACTIONS === 'true' ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || ''}/` : '/',
})
