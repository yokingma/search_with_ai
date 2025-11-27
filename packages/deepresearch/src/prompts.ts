export const queryWriterInstructions = `Your goal is to generate sophisticated and diverse search queries. These queries are intended for an advanced automated research tool capable of analyzing complex results, following links, and synthesizing information.

Instructions:
- Always prefer a single search query, only add another query if the original question requests multiple aspects or elements and one query is not enough.
- Each query should focus on one specific aspect of the original question.
- Don't produce more than {number_queries} queries.
- Queries should be diverse, if the topic is broad, generate more than 1 query.
- Don't generate multiple similar queries, 1 is enough.
- Query should ensure that the most current information is gathered. The current date is {current_date}.
- Use specific keywords and technical terms rather than long descriptive sentences.
- Focus on core concepts, product names, versions, or specific features for better search results.
- **Language Constraint**: Always respond in the same language as the user's input. If the user asks in Chinese, respond in Chinese; if in English, respond in English, etc.

Context: {research_topic}`;

export const searcherInstructions = `Conduct targeted searches to gather the most recent, credible information on "{research_topic}" and synthesize it into a verifiable text artifact.

Instructions:
- Query should ensure that the most current information is gathered. The current date is {current_date}.
- Conduct multiple, diverse searches to gather comprehensive information.
- Consolidate key findings while meticulously tracking the source(s) for each specific piece of information.
- The output should be a well-written summary or report based on your search findings. 
- Only include the information found in the search results, don't make up any information.
- For each key finding, use numbered citations in double square brackets [[1]], [[2]], etc., referring to the search result numbers below.
- **Language Constraint**: Always respond in the same language as the user's input. If the user asks in Chinese, respond in Chinese; if in English, respond in English, etc.

Citation Format:
- Use [[1]], [[2]], [[3]] etc. to cite specific search results
- Each important claim or data point must include a citation
- Multiple sources can be cited as [[1]][[2]]

Example output format:
"According to recent studies, XYZ technology has shown significant improvements [[1]]. Market adoption rates have increased by 25% in 2024 [[2]][[3]]."

Search Results:
{search_results}

Research Topic:
{research_topic}
`;

export const reflectionInstructions = `You are an expert research assistant analyzing summaries about "{research_topic}".

Instructions:
- Identify knowledge gaps or areas that need deeper exploration and generate a follow-up query. (1 or multiple).
- If provided summaries are sufficient to answer the user's question, don't generate a follow-up query.
- If there is a knowledge gap, generate a follow-up query that would help expand your understanding.
- Don't produce more than {number_queries} follow-up queries.
- Focus on technical details, implementation specifics, or emerging trends that weren't fully covered.
- **Language Constraint**: Always respond in the same language as the user's input. If the user asks in Chinese, respond in Chinese; if in English, respond in English, etc.

Query Optimization Requirements:
- Ensure the follow-up query is self-contained and includes necessary context for search.
- Use specific keywords and technical terms rather than long descriptive sentences.
- Focus on core concepts, product names, versions, or specific features.
- Avoid overly complex or verbose phrasing that may reduce search effectiveness.
- **Language Constraint**: Always respond in the same language as the user's input. If the user asks in Chinese, respond in Chinese; if in English, respond in English, etc.

Reflect carefully on the Summaries to identify knowledge gaps and produce a follow-up query.

Summaries:
{summaries}
`;

export const answerInstructions = `Generate a high-quality answer to the user's question based on the provided summaries.

Instructions:
- The current date is {current_date}.
- You are the final step of a multi-step research process, don't mention that you are the final step. 
- You have access to all the information gathered from the previous steps.
- You have access to the user's question.
- Generate a high-quality answer to the user's question based on the provided summaries and the user's question.
- you MUST include all the citations from the summaries in the answer correctly: [title](id/url).
- **Language Constraint**: Always respond in the same language as the user's input. If the user asks in Chinese, respond in Chinese; if in English, respond in English, etc.

User Context:
- {research_topic}

Summaries:
{summaries}`;
