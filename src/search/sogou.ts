import * as cheerio from 'cheerio';
import { httpRequest } from '../utils';
import { EndPoint } from '../constant';

const SELECTOR = {
  results: '#main .results',
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
        endpoint: EndPoint.SOGOU_SEARCH_ENDPOINT,
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
}
