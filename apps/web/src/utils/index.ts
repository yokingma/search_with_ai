/**
 * 解析返回回答中的引用标记[[citation:\d+]]
 */
export const citationMarkdownParse = (text: string) => {
  return text
    .replace(/\[\[([cC])itation/g, "[citation")
    .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
    .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
    .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)");
};

/**
 * 复制文本到剪贴板
 * @param text
 */
export function clipboardCopy(text: string) {
  if (!navigator.clipboard) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } else {
    navigator.clipboard.writeText(text);
  }
}
