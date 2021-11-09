import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      en: ['en-US'],
    },
    load: 'currentOnly',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      bindI18n: 'languageChanged',
      useSuspense: true,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage'],
      caches: ['localStorage', 'cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
