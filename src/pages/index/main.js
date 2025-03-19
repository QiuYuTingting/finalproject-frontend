import vuetify from '/src/vuetify';
import router from './router';
import App from './App.vue';
import { createApp } from 'vue';

const app = createApp(App);

app.use(vuetify);
app.use(router);

app.mount('#app');
