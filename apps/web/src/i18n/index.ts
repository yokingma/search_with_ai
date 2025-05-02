import { createI18n } from 'vue-i18n';
import zh from './zh';
import en from './en';
import ptBR from './ptBR';

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式，更推荐
  locale: 'en', // 默认语言
  fallbackLocale: 'zh', // 回退语言，当当前语言没有对应翻译时使用
  messages: {
    en,
    zh,
    'pt-BR': ptBR, // 推荐使用标准的语言区域代码
  },
});

export default i18n;
