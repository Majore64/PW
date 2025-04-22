import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

// Importe na ordem correta
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/scss/main.scss' // Note a remoção do @

createApp(App).use(router).mount('#app')