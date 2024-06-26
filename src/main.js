import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import vuetify from '@/plugins/vuetify';
import { loadFonts } from '@/plugins/webfontloader';
//animate css
import 'animate.css';
//pinia
import { createPinia } from 'pinia';
//estilos
import '@/assets/css/style.css';
//import '@/assets/css/normalize.css';
import 'mosha-vue-toastify/dist/style.css';

const pinia = createPinia();

loadFonts();

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount('#app');
