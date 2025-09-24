import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import '@/assets/site.css'
import 'leaflet/dist/leaflet.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
