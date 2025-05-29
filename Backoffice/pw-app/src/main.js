import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BootstrapVueNext } from 'bootstrap-vue-next';

const app = createApp(App);
app.use(router);
app.use(BootstrapVueNext);
app.mount('#app');