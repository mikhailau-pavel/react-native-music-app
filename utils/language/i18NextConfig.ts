import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as en from '../language/json/en.json';
import * as pl from '../language/json/pl.json';
import { Languages } from './LanguageUtils';

const resources = {
  en: { translation: en },
  pl: { translation: pl },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: Languages.EN,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
