import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/', // ¡Súper importante que quede solo la barra!
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html')
      }
    }
  }
})