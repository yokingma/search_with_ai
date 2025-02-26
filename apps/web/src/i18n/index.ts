import * as VueI18n from 'vue-i18n';
import zh from './zh';
import en from './en';
import ptBR from './ptBR';

const i18n = VueI18n.createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'zh',
  messages: {
    en,
    zh,
    ptBR
  },
});

export default i18n;