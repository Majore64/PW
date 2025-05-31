import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/scss/main.scss'

const app = createApp(App);
const pinia = createPinia();

// Use o router e o pinia na instância do app
app.use(router);
app.use(pinia); 
app.mount('#app');