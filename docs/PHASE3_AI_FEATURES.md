# Phase 3 AI Features: Natural Language Queries & Insights

> Detailed feature map for AI-powered capabilities
> Created: 2026-03-17

---

## Table of Contents

1. [Vision & Goals](#vision--goals)
2. [Natural Language Query Interface](#natural-language-query-interface)
3. [AI Insight Generator](#ai-insight-generator)
4. [Smart Chart Suggestions](#smart-chart-suggestions)
5. [Conversational Interface](#conversational-interface)
6. [Technical Architecture](#technical-architecture)
7. [Implementation Phases](#implementation-phases)

---

## Vision & Goals

### Vision

Enable every Serbian citizen to ask questions about government data in their native language (Cyrillic, Latin, or English) and receive instant, accurate visualizations with AI-generated insights.

### Goals

1. **Democratize Data Access**: Remove technical barriers to data exploration
2. **Multi-Language Support**: Native Serbian language understanding (Cyrillic & Latin)
3. **Actionable Insights**: Go beyond visualization to provide context and explanations
4. **Privacy-First**: Offer both cloud and local AI options

---

## Natural Language Query Interface

### Query Input Methods

#### Text Input

```typescript
// Component: src/components/ai/QueryInput.tsx
interface QueryInputProps {
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en';
  placeholder: string;
  onSubmit: (query: string) => void;
  suggestions: QuerySuggestion[];
}

// Features:
// - Auto-complete for common queries
// - Query history dropdown
// - Language auto-detection
// - Syntax highlighting for data entities
```

#### Voice Input

```typescript
// Component: src/components/ai/VoiceInput.tsx
interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language: 'sr-RS' | 'en-US';
}

// Implementation:
// - Web Speech API for browser support
// - Fallback to text input if not supported
// - Visual feedback during recording
// - Serbian language voice recognition
```

### Query Processing Pipeline

```typescript
// src/lib/ai/query-processor.ts
export class QueryProcessor {
  async processQuery(input: string): Promise<ProcessedQuery> {
    // Step 1: Language Detection
    const language = await this.detectLanguage(input);

    // Step 2: Intent Classification
    const intent = await this.classifyIntent(input, language);

    // Step 3: Entity Extraction
    const entities = await this.extractEntities(input, language);

    // Step 4: Query Translation
    const structuredQuery = await this.translateQuery(
      input,
      intent,
      entities,
      language
    );

    return { language, intent, entities, structuredQuery };
  }
}

// Intent Types
type QueryIntent =
  | 'trend' // "Show unemployment trends"
  | 'comparison' // "Compare Belgrade and Novi Sad"
  | 'distribution' // "Population by region"
  | 'geographic' // "Budget allocation map"
  | 'ranking' // "Top 10 municipalities"
  | 'correlation' // "Relationship between X and Y"
  | 'aggregation' // "Total budget for education"
  | 'filter'; // "Unemployment in 2024"

// Entity Types
interface QueryEntities {
  regions?: string[]; // ["Belgrade", "Vojvodina"]
  timePeriod?: TimeRange; // { start: "2020", end: "2024" }
  measures?: string[]; // ["unemployment rate", "budget"]
  datasets?: string[]; // ["population", "gdp"]
  filters?: FilterCondition[];
}
```

### Serbian Language Support

```typescript
// src/lib/ai/serbian-nlp.ts
export class SerbianNLP {
  // Handle Serbian cases and declensions
  normalizeWord(word: string): string {
    // "Београду" → "Београд"
    // "Новом Саду" → "Нови Сад"
    // "популације" → "популација"
  }

  // Extract entities from Serbian text
  extractEntities(text: string): Entity[] {
    // "Прикажи незапосленост у Београду"
    // → { measure: "незапосленост", region: "Београд" }
  }
}
```

**Vocabulary Database**

```json
// src/data/ai/serbian-vocabulary.json
{
  "measures": {
    "незапосленост": "unemployment_rate",
    "популација": "population",
    "буџет": "budget",
    "просечна плата": "average_salary"
  },
  "regions": {
    "Београд": "belgrade",
    "Нови Сад": "novi-sad",
    "Ниш": "nis",
    "Војводина": "vojvodina"
  },
  "time_expressions": {
    "ова година": "current_year",
    "прошла година": "previous_year",
    "од 2020": { "since": "2020" }
  }
}
```

---

## AI Insight Generator

### Automatic Trend Detection

```typescript
// src/lib/ai/trend-analyzer.ts
export class TrendAnalyzer {
  analyzeTrend(data: TimeSeriesData): TrendResult {
    return {
      direction: 'increasing' | 'decreasing' | 'stable',
      magnitude: 15.3, // percentage change
      confidence: 0.92,
      significance: 'high',
      period: '2020-2024',
    };
  }

  detectAnomalies(data: number[]): Anomaly[] {
    // Statistical anomaly detection
    // - Z-score analysis
    // - Seasonal decomposition
    // - Change point detection
  }
}
```

**Example Output:**

```json
{
  "trend": "decreasing",
  "change": "-15.2%",
  "insight": "Unemployment in Belgrade has decreased by 15.2% since 2020",
  "anomalies": [
    {
      "date": "2020-04",
      "type": "spike",
      "value": 12.5,
      "expected": 9.2,
      "reason": "COVID-19 pandemic impact"
    }
  ]
}
```

### Statistical Summaries

```typescript
// src/lib/ai/statistics-generator.ts
export class StatisticsGenerator {
  generateSummary(data: number[]): StatisticalSummary {
    return {
      mean: 8.5,
      median: 8.2,
      min: 5.1,
      max: 12.3,
      standardDeviation: 1.8,
      percentiles: {
        p25: 7.1,
        p75: 9.8,
      },
    };
  }

  generateComparison(data1: number[], data2: number[]): Comparison {
    return {
      difference: 2.3,
      percentageDiff: 27,
      statisticalSignificance: 0.95,
      interpretation: 'Region A has significantly higher values',
    };
  }
}
```

### Narrative Generation

```typescript
// src/lib/ai/narrative-generator.ts
export class NarrativeGenerator {
  async generateNarrative(
    insights: Insight[],
    locale: string
  ): Promise<string> {
    // Example (Serbian Cyrillic):
    // "У периоду од 2020. до 2024. године, стопа незапослености
    // у Београду је опала за 15.2%."
    // Example (English):
    // "From 2020 to 2024, Belgrade's unemployment rate
    // decreased by 15.2%."
  }
}
```

---

## Smart Chart Suggestions

### Chart Type Recommendation

```typescript
// src/lib/ai/chart-recommender.ts
export class ChartRecommender {
  recommendChartType(
    dataset: Dataset,
    query: ProcessedQuery,
    dataShape: DataShape
  ): ChartRecommendation {
    const scores = {
      line: this.scoreLineChart(dataShape, query),
      bar: this.scoreBarChart(dataShape, query),
      map: this.scoreMapChart(dataShape, query),
      pie: this.scorePieChart(dataShape, query),
      scatter: this.scoreScatterChart(dataShape, query),
    };

    return {
      primary: this.getTopRecommendation(scores),
      alternatives: this.getAlternatives(scores),
      reasoning: 'Line chart recommended for temporal trend analysis',
    };
  }
}

// Recommendation Logic:
// - Time series → Line/area chart
// - Geographic data → Choropleth map
// - Part-to-whole → Pie/treemap
// - Comparison → Bar/column chart
// - Correlation → Scatter plot
```

### Auto-Configuration

```typescript
// src/lib/ai/auto-configurator.ts
export class AutoConfigurator {
  generateConfig(data: Dataset, query: ProcessedQuery): ChartConfig {
    return {
      chartType: 'line',
      xAxis: this.inferXAxis(data, query),
      yAxis: this.inferYAxis(data, query),
      filters: this.suggestFilters(data, query),
      colors: this.selectColorPalette(data, query),
      annotations: this.generateAnnotations(data, query),
      title: this.generateTitle(query),
    };
  }
}
```

---

## Conversational Interface

### Chat Interface

```typescript
// src/components/ai/ChatInterface.tsx
export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState<ConversationContext>({});

  return (
    <Box>
      <ConversationHistory messages={messages} />
      <QueryInput
        onSubmit={handleQuerySubmit}
        suggestions={getSuggestions(context)}
      />
      <FollowUpSuggestions
        context={context}
        onSelect={handleFollowUp}
      />
    </Box>
  );
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string | ChartVisualization;
  insights?: Insight[];
  timestamp: Date;
}
```

### Context Retention

```typescript
// src/lib/ai/context-manager.ts
export class ContextManager {
  private context: ConversationContext;

  updateContext(newQuery: ProcessedQuery): void {
    // Retain context across queries
    // Example flow:
    // User: "Show unemployment in Belgrade"
    // System: [Shows chart]
    // User: "Compare with Novi Sad"
    // System: [Understands "compare" refers to previous query]
  }
}
```

---

## Technical Architecture

### AI Engine Backends

#### Option 1: OpenAI GPT-4 (Cloud)

```typescript
// src/lib/ai/backends/openai.ts
export class OpenAIBackend implements AIEngine {
  async processQuery(query: ProcessedQuery): Promise<AIResponse> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: this.getSystemPrompt(query.language) },
        { role: 'user', content: query.text },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return this.parseResponse(response);
  }
}
```

**Pros**: Best quality, continuous improvements, no infrastructure  
**Cons**: API costs, data privacy concerns, internet required

#### Option 2: Local LLM (Ollama)

```typescript
// src/lib/ai/backends/ollama.ts
export class OllamaBackend implements AIEngine {
  async processQuery(query: ProcessedQuery): Promise<AIResponse> {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama3-serbian',
        prompt: this.buildPrompt(query),
        stream: false,
      }),
    });

    return this.parseResponse(response);
  }
}
```

**Pros**: Privacy-first, no API costs, offline capable  
**Cons**: Lower quality, infrastructure management

#### Option 3: Hybrid Mode

```typescript
// src/lib/ai/backends/hybrid.ts
export class HybridBackend implements AIEngine {
  async processQuery(query: ProcessedQuery): Promise<AIResponse> {
    const complexity = this.assessComplexity(query);

    if (complexity === 'simple') {
      return this.localBackend.processQuery(query);
    } else {
      return this.cloudBackend.processQuery(query);
    }
  }
}
```
