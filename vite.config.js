import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    // transformer: 'lightningcss',
    modules: true,
  },
  build: {
    copyPublicDir: true,
    cssCodeSplit: true,
    lib: {
      entry: './src/index.js',
      name: 'n1vgs',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom'],
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: '@components',
        replacement: fileURLToPath(new URL('./src/components', import.meta.url)),
      },
      {
        find: '@/*',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: '@storyAssets',
        replacement: fileURLToPath(new URL('./.ladle/assets', import.meta.url)),
      },
    ],
  },
  plugins: [
    // tailwindcss(),
    react(),
  ],
})
