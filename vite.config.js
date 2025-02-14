import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.YOUTUBE_API_KEY': JSON.stringify(env.YOUTUBE_API_KEY),
      'process.env.GEMINIKEY': JSON.stringify(env.GEMINIKEY),
    },
    plugins: [react()],
    server:{
      port:3000,
    }
  }
})