import * as VueI18n from 'vue-i18n';
import zh from './zh';
import en from './en';

const i18n = VueI18n.createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'zh',
  messages: {
    en,
    zh,
  },
});

export default i18n;