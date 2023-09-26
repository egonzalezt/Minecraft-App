import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from './english.json'
import esTranslation from './spanish.json'
import jpTranslation from './japanese.json'
import frTranslation from './french.json'
import ruTranslation from './russian.json'

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
        },
        fr: {
            translation: frTranslation
        },
        ru: {
            translation: ruTranslation
        }
    },
});

export default i18n;