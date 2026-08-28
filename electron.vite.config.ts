import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist-electron',
      rollupOptions: {
        external: ['electron'],
        input: {
          main: resolve(__dirname, 'electron/main.ts')
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'electron')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist-electron',
      rollupOptions: {
        external: ['electron'],
        input: {
          preload: resolve(__dirname, 'electron/preload.ts')
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      }
    }
  },
  renderer: {
    root: resolve(__dirname, 'src'),
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/index.html')
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 5173,
      strictPort: true
    }
  }
})
