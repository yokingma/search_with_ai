import katex, { type KatexOptions } from 'katex';
import 'katex/dist/katex.css';
import { MarkedExtension, TokenizerAndRendererExtension } from 'marked';

export const markedKatex = (options: KatexOptions = {}): MarkedExtension => {
  return {
    extensions: [
      inlineKatex(options),
      inlineParenthesesKatex(options),
      blockKatex(options),
      blockBracketsKatex(options)
    ]
  };
};

function inlineKatex (options: KatexOptions): TokenizerAndRendererExtension {
  return {
    name: 'inlineKatex',
    level: 'inline',
    start (src: string) {
      return src.indexOf('$');
    },
    tokenizer (src: string, _tokens) {
      const match = src.match(/^\$+([^$\n]+?)\$+/);
      if (match !== null) {
        return {
          type: 'inlineKatex',
          raw: match[0],
          text: match[1].trim()
        };
      }
    },
    renderer (token) {
      const html: string = katex.renderToString(token.text, options);
      return `<span style="display: inline-block;">${html}</span>`;
    }
  };
}

function inlineParenthesesKatex (options: KatexOptions): TokenizerAndRendererExtension {
  return {
    name: 'inlineParenthesesKatex',
    level: 'inline',
    start (src: string) {
      return src.indexOf('\\\\(');
    },
    tokenizer (src: string, _tokens) {
      const match = src.match(/^\\\(+([^$\n]+?)\\\)+/);
      if (match !== null) {
        return {
          type: 'inlineParenthesesKatex',
          raw: match[0],
          text: match[1].trim()
        };
      }
    },
    renderer (token) {
      const html: string = katex.renderToString(token.text, options);
      return `<span style="display: inline-block;">${html}</span>`;
    }
  };
}

function blockKatex (options: KatexOptions): TokenizerAndRendererExtension {
  return {
    name: 'blockKatex',
    level: 'block',
    start (src: string) {
      return src.indexOf('$$');
    },
    tokenizer (src: string, _tokens) {
      // Match multiline block formulas: $$\n...\n$$
      const multilineMatch = src.match(/^\$\$+\n([^$]+?)\n\$\$/);
      if (multilineMatch !== null) {
        return {
          type: 'blockKatex',
          raw: multilineMatch[0],
          text: multilineMatch[1].trim()
        };
      }

      // Match single-line block formulas: $$ ... $$
      const singlelineMatch = src.match(/^\$\$+([^$\n]+?)\$\$/);
      if (singlelineMatch !== null) {
        return {
          type: 'blockKatex',
          raw: singlelineMatch[0],
          text: singlelineMatch[1].trim()
        };
      }
    },
    renderer (token) {
      options.displayMode = true;
      try {
        const html: string = katex.renderToString(token.text, options);
        return `<p>${html}</p>`;
      } catch (error) {
        console.log(error);
        return `<p>${token.text as string}</p>`;
      }
    }
  };
}

function blockBracketsKatex (options: KatexOptions): TokenizerAndRendererExtension {
  return {
    name: 'blockBracketsKatex',
    level: 'block',
    start (src: string) {
      return src.indexOf('\\\\[');
    },
    tokenizer (src: string, _tokens) {
      const match = src.match(/^\\\[+([^$]+?)\\\]+/);
      if (match !== null) {
        return {
          type: 'blockBracketsKatex',
          raw: match[0],
          text: match[1].trim()
        };
      }
    },
    renderer (token) {
      options.displayMode = true;
      try {
        const str = token.text as string;
        // A single formula group may contain multiple \tag tags [caused by recognition errors from large models].
        // Check and remove redundant \tag tags.
        // Use a regular expression to match \tag tags and remove the extra ones.
        let tagFirstFound = false;
        const sanitizedText = str.replace(/(\\tag{[^}]*})/g, (match) => {
          // 只保留第一个 \tag
          if (!tagFirstFound) {
            tagFirstFound = true;
            return match;
          }
          return '';
        });
        const html: string = katex.renderToString(sanitizedText, options);
        return `<p>${html}</p>`;
      } catch (error) {
        console.error(error);
        return `<p>${token.text as string}</p>`;
      }
    }
  };
}
