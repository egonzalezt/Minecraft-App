import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from './english.json'
import esTranslation from './spanish.json'
import jpTranslation from './japanese.json'

i18n.use(initReactI18next).init({
    debug: true,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: {
            translation: enTranslation
        },
        es: {
            translation: esTranslation
        },
        jp: {
            translation: jpTranslation
        }
    },
});

export default i18n;