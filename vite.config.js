import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: 'https://albertasd24.github.io/proyect-movile'
  // server: {
  //   port: 3100,
  //   host: "0.0.0.0",
  // },
})
