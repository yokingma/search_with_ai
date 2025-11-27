import fs from 'node:fs';
import { DeepResearch, SearcherFunction } from './dist/index.js';

async function main() {
  const searcher: SearcherFunction = async ({ query, id }) => {
    console.log('query', query, id);
    return [];
  };

  const instance = new DeepResearch({
    searcher,
  });

  const agent = await instance.compile();

  const png = await (await agent.getGraphAsync()).drawMermaidPng();
  const buffer = Buffer.from(await png.arrayBuffer());
  fs.writeFileSync('graph.png', buffer);
}

main();
