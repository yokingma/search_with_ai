import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { markedKatex } from './katex';

const marked = new Marked();

// hljs
marked.use(markedHighlight({
  emptyLangClass: 'hljs',
  langPrefix: 'hljs language-',
  highlight (code, lang) {
    const language = hljs.getLanguage(lang) !== undefined ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

// custom code block renderer
marked.use({
  renderer: {
    code(token) {
      const lang = token.lang || '';
      const displayLang = lang || 'text';

      // Call the original highlight renderer
      const originalRenderer = this.constructor.prototype.code;
      const highlightedCode = originalRenderer.call(this, token);

      return `<div class="code-block-container">
        <div class="code-block-header">
          <span class="code-block-icon"></span>
          <span class="code-block-language">${displayLang}</span>
        </div>
        ${highlightedCode}
      </div>`;
    }
  }
});

marked.use(markedKatex({ strict: false }));

export default (text: string, async = false): string | Promise<string> => {
  return marked.parse(text, { async });
};
