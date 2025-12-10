import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enGB from './locales/en-GB.json';
import ptBR from './locales/pt-BR.json';
import es from './locales/es.json';
import it from './locales/it.json';
import fr from './locales/fr.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import hi from './locales/hi.json';
import ja from './locales/ja.json';

const resources = {
  'en-GB': { translation: enGB },
  'pt-BR': { translation: ptBR },
  'es': { translation: es },
  'it': { translation: it },
  'fr': { translation: fr },
  'ru': { translation: ru },
  'zh': { translation: zh },
  'hi': { translation: hi },
  'ja': { translation: ja },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en-GB',
    lng: 'en-GB',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
