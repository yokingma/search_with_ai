import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
// 数学公式
import { markedKatex } from './katex';

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight (code, lang) {
      const language = hljs.getLanguage(lang) !== undefined ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

marked.use(markedKatex({ strict: false }));

export default (text: string, async = false): string | Promise<string> => {
  return marked.parse(text, { async });
};
