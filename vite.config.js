import mkcert from 'vite-plugin-mkcert'

const vue = require('@vitejs/plugin-vue')
const path = require('path')

const { defineConfig } = require('vite')

const pathSrc = path.resolve(__dirname, path.join('src', 'renderer', 'src'))

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
  plugins: [
    vue(),
    //  mkcert()
    ],
  root: path.join(__dirname, 'src', 'renderer'),
  publicDir: 'public',
  resolve: {
    alias: {
      '@': pathSrc,
      '~': pathSrc
    }
  },
  server: {
    // https: true
    port: 8080
  },
  open: false,
  build: {
    outDir: path.join(__dirname, 'build', 'renderer'),
    emptyOutDir: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '~/assets/styles/variables';
          @import '~/assets/styles/mixins';
          @import '~/assets/styles/typography';
        `
      }
    }
  }
})

module.exports = config
