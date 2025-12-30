# AI Integration Documentation

> **Status:** No active AI integration.
> **Plan:** Future integration for project summarization.

## 🤖 Models & Configuration

Currently, this project does not integrate live AI models. The roadmap includes plans for a local AI model to summarize project descriptions.

### Future Configuration
- **Provider**: Local (e.g., Ollama) or Cloud API (OpenAI/Anthropic).
- **Env Vars**: TBD (e.g., `AI_API_KEY`, `AI_MODEL_NAME`).
- **Location**: Configuration would reside in `src/config.mjs` or a dedicated service adapter.

## 📋 Data Schemas

If AI integration is added, the expected JSON schema for a project summary might look like:

```json
{
  "summary": "Short text summary of the project...",
  "keywords": ["tag1", "tag2"],
  "sentiment": "positive"
}
```

## 🫰 Cost & Limits

- **Strategy**: Static Generation (SSG).
- **Explanation**: AI operations will be performed at **build time** to generate summaries/metadata. This avoids runtime costs and latency for users.
- **Caching**: Results should be cached (e.g., in `.astro/cache` or a separate JSON file) to prevent re-generation on every build unless content changes.
- **Rate Limits**: If using a paid API, build scripts should implement rate limiting to stay within tier quotas.

## 🛡 Policy

- All AI-generated content must be reviewed by a human before publishing.
- No user data is sent to AI endpoints.
