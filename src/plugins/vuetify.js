// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Vuetify
import { createVuetify } from 'vuetify';
//para traducciones 
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import { createI18n, useI18n } from 'vue-i18n';

//importar las traducciones desde node modules 
import esTranslations from 'vuetify/lib/locale/es.mjs';
import enTranslations from 'vuetify/lib/locale/en.mjs';


//la variable tiene que llamarse si o si messages porque da errores si colocamos otro nombre
const messages = {
  es: {
    $vuetify: {
      ...esTranslations,
    },
    10: '10',   // Forzar traducción para no mostrar errores por consola(aunque no sea necesaria)
    25: '25',   // Forzar traducción para no mostrar errores por consola(aunque no sea necesaria)
    50: '50',   // Forzar traducción para no mostrar errores por consola (aunque no sea necesaria)
    100: '100', // Forzar traducción para no mostrar errores por consola (aunque no sea necesaria)
  },
  en: {
    $vuetify: {
      ...enTranslations,
    },
    10: '10',   // Forzar traducción para no mostrar errores por consola(aunque no sea necesaria)
    25: '25',   // Forzar traducción para no mostrar errores por consola(aunque no sea necesaria)
    50: '50',   // Forzar traducción para no mostrar errores por consola (aunque no sea necesaria)
    100: '100', // Forzar traducción para no mostrar errores por consola (aunque no sea necesaria)
  },
};


const i18n = new createI18n({
  legacy: false,// Vuetify does not support the legacy mode of vue-i18n
  locale: 'es',
  fallbackLocale: 'en',
  messages,
});
export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});
