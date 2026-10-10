import './assets/main.css'

import { createApp } from 'vue/dist/vue.esm-bundler';
import App from './App.vue'
import router, { loadRoutes } from './router/index.js'

loadRoutes().then(() => {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
})
