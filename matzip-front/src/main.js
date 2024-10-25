import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import { BootstrapVue3 } from "bootstrap-vue-3"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import '@fortawesome/fontawesome-free/css/all.css';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(BootstrapVue3);
app.use(pinia);
app.mount('#app');

