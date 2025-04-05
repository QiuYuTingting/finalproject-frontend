import vuetify from '/src/vuetify';
import router from './router';
import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(vuetify);
app.use(router);
app.use(pinia);

app.mount('#app');
