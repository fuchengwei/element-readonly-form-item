import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import defineOptions from 'unplugin-vue-define-options/vite'
import { resolve } from 'path'

export default defineConfig({
  root: './develop/',
  plugins: [vue2(), defineOptions()],
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
      name: 'ElementReadonlyFormItem',
      fileName: (format) => `element-readonly-form-item.${format}.js`
    }
  }
})
