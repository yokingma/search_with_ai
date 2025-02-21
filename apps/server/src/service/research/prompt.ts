export const deepResearchSystemPrompt = () => {
  const now = new Date().toISOString();
  return `You are an expert researcher. Today is ${now}. Follow these instructions when responding:
  - You may be asked to research subjects that is after your knowledge cutoff, assume the user is right when presented with news.
  - The user is a highly experienced analyst, no need to simplify it, be as detailed as possible and make sure your response is correct.
  - Be highly organized.
  - Suggest solutions that I didn't think about.
  - Be proactive and anticipate my needs.
  - Treat me as an expert in all subject matter.
  - Mistakes erode my trust, so be accurate and thorough.
  - Provide detailed explanations, I'm comfortable with lots of detail.
  - Value good arguments over authorities, the source is irrelevant.
  - Consider new technologies and contrarian ideas, not just the conventional wisdom.
  - You may use high levels of speculation or prediction, just flag it for me.
  - Your response should be in the same language as the user's original query.`;
};

export const generateSerpQueriesPrompt = (query: string, numQueries: number, learnings?: string[]) => {
  return `Given the following prompt from the user, generate a list of SERP queries to research the topic. Return a maximum of ${numQueries} queries, but feel free to return less if the original prompt is clear. Make sure each query is unique and not similar to each other: <prompt>${query}</prompt>\n\n${
    learnings
      ? `Here are some learnings from previous research, use them to generate more specific queries: ${learnings.join('\n')}`
      : ''
  }`;
};

export const processSerpResultPrompt = (query: string, contents: string[], numLearnings = 3) => {
  return `Given the following contents from a SERP search for the query <query>${query}</query>, generate a list of learnings from the contents. Return a maximum of ${numLearnings} learnings, but feel free to return less if the contents are clear. Make sure each learning is unique and not similar to each other. The learnings should be concise and to the point, as detailed and information dense as possible. Make sure to include any entities like people, places, companies, products, things, etc in the learnings, as well as any exact metrics, numbers, or dates. The learnings will be used to research the topic further.
  
  <contents>
  ${contents.map(content => `<content>\n${content}\n</content>`).join('\n')}
  </contents>
  `;
};

export const generateReportPrompt = (prompt: string, learningsString: string) => {
  return `Given the following prompt from the user, write a final report on the topic using the learnings from research. Make it as as detailed as possible, aim for 3 or more pages, include ALL the learnings from research:\n\n<prompt>${prompt}</prompt>\n\nHere are all the learnings from previous research:\n\n<learnings>\n${learningsString}\n</learnings>`;
};

export const generateFollowUpPrompt = (query: string, numQuestions = 3) => {
  return `Given the following query from the user, ask some follow up questions to clarify the research direction, and give answers to these questions. Return a maximum of ${numQuestions} questions, but feel free to return less if the original query is clear: <query>${query}</query>, you should use the same language as the user's original query.`;
};
