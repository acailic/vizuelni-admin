/**
 * @file config.ts
 * @description AI configuration settings
 */

export const aiConfig = {
  backend:
    (process.env.AI_BACKEND as 'openai' | 'ollama' | 'hybrid') || 'hybrid',

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
    temperature: 0.3,
    maxTokens: 2000,
  },

  ollama: {
    endpoint: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
    model: 'llama3',
  },

  cache: {
    enabled: process.env.AI_CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.AI_CACHE_TTL || '3600'),
  },
};
