import { createI18n } from 'vue-i18n';
import zh from './zh';
import en from './en';
import ptBR from './ptBR';
import ja from './ja'; // 导入日语语言包

const i18n = createI18n({
  legacy: false,
  locale: 'en', // 保持默认语言为英语
  fallbackLocale: 'zh', // 保持回退语言为中文
  messages: {
    en,
    zh,
    'pt-BR': ptBR,
    ja, // 添加日语语言包
  },
});

export default i18n;
