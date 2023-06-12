import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import defineOptions from 'unplugin-vue-define-options/vite'
import { resolve } from 'path'

export default defineConfig({
  root: './example/',
  plugins: [vue2(), defineOptions()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
