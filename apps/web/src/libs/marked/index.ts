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

      const uniqueId = `code-${Math.random().toString(36).substring(2, 11)}`;

      return `<div class="code-block-container collapsible" id="${uniqueId}">
        <div class="code-block-header">
          <div class="code-block-title">
            <span class="code-block-icon"></span>
            <span class="code-block-language">${displayLang}</span>
          </div>
          <div class="code-block-op">
            <button class="code-block-toggle" onclick="this.closest('.code-block-container').classList.toggle('collapsed')">
              <svg class="collapse-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9995 0.499512L16.9492 5.44926L15.535 6.86347L12.9995 4.32794V9.99951H10.9995L10.9995 4.32794L8.46643 6.86099L7.05222 5.44678L11.9995 0.499512ZM10.9995 13.9995L10.9995 19.6704L8.46448 17.1353L7.05026 18.5496L12 23.4995L16.9497 18.5498L15.5355 17.1356L12.9995 19.6716V13.9995H10.9995Z"></path></svg>
              <svg class="expand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9995 13.4995 16.9492 18.4493 12.9995 18.4483 12.9995 22.9995H10.9995L10.9995 18.4478 7.05222 18.4468 11.9995 13.4995ZM10.9995.999512 10.9995 5.54964 7.05026 5.54956 12 10.4995 16.9497 5.54977 12.9995 5.54968V.999512L10.9995.999512Z"></path></svg>
            </button>
          </div>
        </div>
        <div class="code-block-body">
        ${highlightedCode}
        </div>
      </div>`;
    }
  }
});

marked.use(markedKatex({ strict: false }));

export default (text: string, async = false): string | Promise<string> => {
  return marked.parse(text, { async });
};
