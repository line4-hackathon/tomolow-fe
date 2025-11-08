import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import fs from 'fs'

export default defineConfig({
  plugins: [svgr(), react()],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
    host: 'localhost',
    port: 5173,
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
})
