import * as cheerio from 'cheerio';
import { httpRequest } from '../utils';

const EndPoints = {
  WEB: 'https://www.sogou.com/web',
  LINK: 'https://www.sogou.com/'
};

const SELECTOR = {
  results: '#main .results',
  resultTitle: '.vr-title',
  resultLink: '.vr-title > a',
  resultSnippet: ['.star-wiki', '.fz-mid', '.attribute-centent'],
  resultSnippetExcluded: ['.text-lightgray', '.zan-box', '.tag-website'],
  related: '#main .vrwrap.middle-better-hintBox .hint-mid'
};

export class Sogou {
  private query: string;
  private $: cheerio.CheerioAPI;

  constructor(query: string) {
    this.query = query;
  }

  async init() {
    const res = await this.search(this.query);
    this.$ = cheerio.load(res);
  }

  private async search(query: string) {
    try {
      const res = await httpRequest({
        endpoint: EndPoints.WEB,
        query: {
          query,
        }
      });
      return res.text();
    } catch(err) {
      return '';
    }
  }

  /**
   * 搜狗大家还在搜
   */
  public getRelatedQueries() {
    const $related = this.$(SELECTOR.related);
    const texts = $related.children().map((i, el) => {
      return this.$(el).text();
    });
    return texts.toArray();
  }

  public async getResults() {
    const $result = this.$(SELECTOR.results);
    const nodes = $result.children().map((i, el) => {
      return this.resultFilter(el);
    });
    const list = await Promise.all(nodes);
    return list.filter(item => item.link && item.snippet && item.title);
  }

  private async resultFilter(el: cheerio.Element) {
    const $el = this.$(el);
    const title = $el.find(SELECTOR.resultTitle).text().replace(/\n/g, '').trim();
    const link = $el.find(SELECTOR.resultLink).get(0)?.attribs.href;
    const snippets = SELECTOR.resultSnippet.map(item => {
      SELECTOR.resultSnippetExcluded.forEach(e => {
        $el.find(e).remove();
      });
      return $el.find(item).text().trim() ?? '';
    });
    let url = link;
    if (!link?.includes('http')) url = await this.getRealTargetUrl(link);
    return {
      title,
      link: url,
      snippet: snippets.join(''),
    };
  }

  /**
   * 解析搜狗搜索结果中的link，获取真实的链接
   * @param url
   */
  private async getRealTargetUrl(url?: string) {
    if (!url) return '';
    const res = await httpRequest({
      endpoint: EndPoints.LINK + url,
      headers: {
        Accept: '*/*'
      }
    });
    const txt = await res.text();
    const $ = cheerio.load(txt);
    // eg. <script>window.location.replace("https://www.bilibili.com/video/BV1HL4y1h7gH")</script>
    const link = $('script').text();
    const matches = link.match(/"(.*?)"/);
    return matches?.[1] || '';
  }
}
