# AI Integration Documentation

> **Status:** No active AI integration.
> **Plan:** Future integration for project summarization.

## 🤖 Models & Configuration

Currently, this project does not integrate live AI models. The roadmap includes plans for a local AI model to summarize project descriptions.

### Future Configuration
- **Provider**: Local (e.g., Ollama) or Cloud API (OpenAI/Anthropic).
- **Env Vars**: TBD (e.g., `AI_API_KEY`).
- **Models**: Small language models like `llama3` or `mistral` optimized for summarization.

## 📄 JSON Schemas (Planned)

When the AI adapter is implemented, it will be expected to return structured data for project metadata.

**Expected Schema for Project Summary:**

```json
{
  "type": "object",
  "properties": {
    "summary": {
      "type": "string",
      "description": "A concise 2-sentence summary of the project."
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Suggested tags based on content."
    },
    "sentiment": {
      "type": "string",
      "enum": ["positive", "neutral", "inspiring"]
    }
  }
}
```

## 🫰 Cost & Limits

- **Strategy**: Static Generation (SSG).
- **Explanation**: AI operations will be performed at **build time** to generate summaries/metadata. This avoids runtime costs and latency for users.
- **Caching**: Results will be cached (e.g., in `.astro/cache`) to prevent re-generating summaries for unchanged content.
- **Rate Limits**: If using a paid API, the build script will implement concurrency limits (e.g., `p-limit`) to stay within tier quotas.

## 🛡 Policy

- All AI-generated content must be reviewed by a human before publishing.
- No user data is sent to AI endpoints.
