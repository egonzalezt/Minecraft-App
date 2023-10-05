import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from './english.json'
import esTranslation from './spanish.json'
import jpTranslation from './japanese.json'
import frTranslation from './french.json'
import ruTranslation from './russian.json'
import desTranslation from './desmadrero.json'
const storedLang = localStorage.getItem("selectedLanguage");
const fallbackLang = 'es';
const defaultLang = storedLang || fallbackLang;

i18n.use(initReactI18next).init({
    debug: true,
    lng: defaultLang,
    fallbackLng: fallbackLang,
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
        },
        des: {
            translation: desTranslation
        }
    },
});

export default i18n;