/**
 * 解析返回回答中的引用标记[[citation:\d+]]
 * @param text 
 */
export const citationMarkdownParse = (text: string) => {
  return text
    .replace(/\[\[([cC])itation/g, "[citation")
    .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
    .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
    .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)")
}