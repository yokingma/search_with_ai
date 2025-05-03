import { useI18n } from '@/i18n';
import zh from './zh';
import en from './en';
import ptBR from './ptBR';
import ja from './ja';
import zhTW from './zh-TW'; // 导入繁体中文语言包 (请根据您的文件名修改)

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'zh',
  messages: {
    en,
    zh,
    'pt-BR': ptBR,
    ja,
    'zh-TW': zhTW, // 添加繁体中文语言包 (请根据您的文件名修改)
  },
});

export default i18n;
