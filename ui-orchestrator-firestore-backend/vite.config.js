import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements - e.g. web components
          isCustomElement: (tag) => tag.startsWith('micro-')
        }
      }
    }),
  ],
  server: {
    port: 3000, // Specify your port here
    open: true, // Automatically open the app in the browser
  },
  configureServer(server) {
    server.httpServer?.once('listening', () => {
      console.log(`\n🚀 UI-orchestrator is running on: http://localhost:3000`);
      console.log(`🔗 Custom message: You can now access the app!`);
    });
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
