import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import { resolve } from 'path'

export default defineConfig({
  root: './develop/',
  base: './',
  plugins: [vue2()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['es', 'umd'],
      name: 'ReadonlyFormItem',
      fileName: (format) => `readonly-form-item.${format}.js`
    }
  }
})
