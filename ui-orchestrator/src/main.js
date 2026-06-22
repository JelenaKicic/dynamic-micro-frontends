import './assets/main.css'

import { createApp } from 'vue/dist/vue.esm-bundler';
import App from './App.vue'
import router from './router/index.js'


const app = createApp(App)

app.use(router)

app.mount('#app')
