# AI Integration Documentation

> **Status:** No active AI integration.
> **Plan:** Future integration for project summarization.

## 🤖 Models & Configuration

Currently, this project does not integrate live AI models. The roadmap includes plans for a local AI model to summarize project descriptions.

### Future Configuration
- **Provider**: Local (e.g., Ollama) or Cloud API (OpenAI/Anthropic).
- **Env Vars**: TBD (e.g., `AI_API_KEY`).
- **Adapter**: `src/utils/ai-adapter.ts` (to be created).

### Expected JSON Schema
When integrating AI, the expected output format for summaries should be:

```json
{
  "summary": "Short summary of the project...",
  "tags": ["Tag1", "Tag2"],
  "sentiment": "Professional"
}
```

## 🫰 Cost & Limits

- **Strategy**: Build-time Generation + Caching.
- **Explanation**:
  - AI operations run only at **build time**.
  - **Caching**: Results should be cached (e.g., in `.astro/cache` or a local JSON file) to prevent re-generation on every build unless the source content changes.
  - **Rate Limiting**: No runtime rate limits needed as it is not user-facing.

## 🛡 Policy

- All AI-generated content must be reviewed by a human before publishing.
- No user data is sent to AI endpoints.
