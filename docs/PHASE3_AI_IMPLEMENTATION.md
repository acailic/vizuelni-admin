# Phase 3 AI Implementation Guide

> Step-by-step implementation plan for AI-powered features
> Created: 2026-03-17

---

## Implementation Phases

### Phase 1: Foundation (Months 19-21)

#### Week 1-2: Core Infrastructure

1. **Set up AI directory structure**

   ```bash
   mkdir -p src/lib/ai/backends
   mkdir -p src/components/ai
   mkdir -p src/data/ai
   mkdir -p tests/ai
   ```

2. **Install dependencies**

   ```bash
   npm install openai
   npm install @langchain/core @langchain/openai
   npm install natural compromise
   ```

3. **Create base types** (`src/types/ai.ts`)

   ```typescript
   export interface QueryResult {
     query: string;
     language: 'sr-Cyrl' | 'sr-Latn' | 'en';
     intent: QueryIntent;
     entities: QueryEntities;
     chartConfig: ChartConfig;
     insights: Insight[];
     followUpSuggestions: string[];
   }

   export interface Insight {
     type: 'trend' | 'anomaly' | 'comparison' | 'summary';
     title: string;
     description: string;
     confidence: number;
     data?: any;
   }
   ```

#### Week 3-4: Serbian NLP

1. **Create Serbian vocabulary database**
   - File: `src/data/ai/serbian-vocabulary.json`
   - Include: measures, regions, time expressions, common phrases

2. **Implement Serbian NLP utilities**
   - File: `src/lib/ai/serbian-nlp.ts`
   - Functions: normalizeWord(), extractEntities(), detectLanguage()

3. **Create entity mappings**
   - File: `src/data/ai/entity-mappings.json`
   - Map Serbian terms to database identifiers

#### Week 5-6: Query Processing

1. **Implement QueryProcessor class**
   - File: `src/lib/ai/query-processor.ts`
   - Methods: processQuery(), classifyIntent(), extractEntities()

2. **Create query templates**
   - File: `src/data/ai/query-templates.json`
   - Common query patterns for training/testing

3. **Add unit tests**
   - File: `tests/ai/query-processor.test.ts`

#### Week 7-8: Basic UI Components

1. **Create QueryInput component**
   - File: `src/components/ai/QueryInput.tsx`
   - Features: text input, auto-complete, language detection

2. **Create InsightDisplay component**
   - File: `src/components/ai/InsightDisplay.tsx`
   - Display generated insights with formatting

3. **Create basic ChatInterface**
   - File: `src/components/ai/ChatInterface.tsx`
   - Message history, input, basic styling

---

### Phase 2: Enhancement (Months 22-24)

#### Week 9-10: OpenAI Integration

1. **Implement OpenAI backend**
   - File: `src/lib/ai/backends/openai.ts`
   - Configure API client, prompt templates

2. **Create prompt templates**
   - Serbian language prompts
   - System prompts for different query types

3. **Add error handling**
   - Rate limiting
   - Fallback responses
   - Timeout handling

#### Week 11-12: Local LLM Integration

1. **Set up Ollama**
   - Install Ollama
   - Pull Serbian-compatible model (llama3)

2. **Implement Ollama backend**
   - File: `src/lib/ai/backends/ollama.ts`
   - Local API integration

3. **Test Serbian language support**
   - Evaluate model quality
   - Fine-tune prompts

#### Week 13-14: Hybrid Backend

1. **Implement HybridBackend class**
   - File: `src/lib/ai/backends/hybrid.ts`
   - Complexity assessment
   - Backend selection logic

2. **Add configuration options**
   - File: `src/lib/ai/config.ts`
   - Environment-based backend selection

#### Week 15-16: Insight Generation

1. **Implement TrendAnalyzer**
   - File: `src/lib/ai/trend-analyzer.ts`
   - Statistical analysis functions

2. **Implement StatisticsGenerator**
   - File: `src/lib/ai/statistics-generator.ts`
   - Summary statistics, comparisons

3. **Implement NarrativeGenerator**
   - File: `src/lib/ai/narrative-generator.ts`
   - Multi-language narrative generation

---

### Phase 3: Polish (Months 25-27)

#### Week 17-18: Chart Recommendations

1. **Implement ChartRecommender**
   - File: `src/lib/ai/chart-recommender.ts`
   - Scoring algorithms for chart types

2. **Implement AutoConfigurator**
   - File: `src/lib/ai/auto-configurator.ts`
   - Auto-generate chart configurations

#### Week 19-20: Voice Input

1. **Implement VoiceInput component**
   - File: `src/components/ai/VoiceInput.tsx`
   - Web Speech API integration

2. **Add Serbian voice recognition**
   - Test accuracy
   - Handle edge cases

#### Week 21-22: Context Management

1. **Implement ContextManager**
   - File: `src/lib/ai/context-manager.ts`
   - Conversation history
   - Context retention

2. **Implement SuggestionEngine**
   - File: `src/lib/ai/suggestion-engine.ts`
   - Follow-up query suggestions

#### Week 23-24: Testing & Optimization

1. **Comprehensive testing**
   - Unit tests for all AI functions
   - Integration tests for query flow
   - E2E tests for UI

2. **Performance optimization**
   - Query caching
   - Response time optimization
   - Bundle size optimization

---

## File Structure

```
src/
├── lib/
│   └── ai/
│       ├── query-processor.ts       # Main query processing
│       ├── serbian-nlp.ts           # Serbian language utilities
│       ├── trend-analyzer.ts        # Trend detection
│       ├── statistics-generator.ts  # Statistical summaries
│       ├── narrative-generator.ts   # Natural language generation
│       ├── chart-recommender.ts     # Chart type suggestions
│       ├── auto-configurator.ts     # Auto chart configuration
│       ├── context-manager.ts       # Conversation context
│       ├── suggestion-engine.ts     # Follow-up suggestions
│       ├── config.ts                # AI configuration
│       └── backends/
│           ├── openai.ts            # OpenAI integration
│           ├── ollama.ts            # Local LLM integration
│           └── hybrid.ts            # Hybrid backend
├── components/
│   └── ai/
│       ├── QueryInput.tsx           # Text/voice input
│       ├── VoiceInput.tsx           # Voice recording
│       ├── ChatInterface.tsx        # Chat UI
│       ├── InsightDisplay.tsx       # Insights visualization
│       ├── FollowUpSuggestions.tsx  # Suggestion buttons
│       └── ConversationHistory.tsx  # Message history
├── data/
│   └── ai/
│       ├── serbian-vocabulary.json  # Serbian terms
│       ├── query-templates.json     # Query patterns
│       └── entity-mappings.json     # Entity to ID mappings
└── types/
    └── ai.ts                        # TypeScript types

tests/
└── ai/
    ├── query-processor.test.ts
    ├── serbian-nlp.test.ts
    ├── trend-analyzer.test.ts
    └── integration.test.ts
```

---

## Configuration

### Environment Variables

```bash
# .env.local
AI_BACKEND=hybrid                    # 'openai' | 'ollama' | 'hybrid'
OPENAI_API_KEY=sk-...
OLLAMA_ENDPOINT=http://localhost:11434
AI_CACHE_ENABLED=true
AI_CACHE_TTL=3600
```

### AI Config File

```typescript
// src/lib/ai/config.ts
export const aiConfig = {
  backend: process.env.AI_BACKEND || 'hybrid',

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
```

---

## Testing Strategy

### Unit Tests

- Test each AI function independently
- Mock external API calls
- Test Serbian language processing

### Integration Tests

- Test full query flow
- Test backend switching
- Test caching

### E2E Tests

- Test chat interface
- Test voice input
- Test insight generation

---

## Success Metrics

| Metric            | Target | Measurement                         |
| ----------------- | ------ | ----------------------------------- |
| Query Accuracy    | >85%   | Manual evaluation of 100 queries    |
| Response Time     | <10s   | Average time from query to response |
| User Satisfaction | >4.2/5 | User surveys                        |
| Serbian Support   | 95%    | Query understanding accuracy        |

---

## Next Steps

1. ✅ Create AI feature architecture document
2. ⏳ Create AI component structure
3. ⏳ Create AI library functions
4. ⏳ Create Serbian language data
5. ⏳ Create AI backend integrations
