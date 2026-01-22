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

## 🫰 Cost Control & Rate Limiting

### Strategy
**Static Generation (SSG)** is the primary cost-control mechanism. By performing AI operations only at **build time**, we eliminate per-request costs and latency for end users.

### Caching
To prevent redundant API calls during builds:
1.  **Content Hashing**: Compute a hash of the source content (e.g., MDX file).
2.  **Persistent Storage**: Check a local JSON cache (e.g., `.astro/ai-cache.json`) for existing results associated with that hash.
3.  **Skip**: Only call the AI API if the content has changed or the cache is missing.

### Rate Limiting
When using paid cloud APIs (OpenAI, Anthropic):
- **Concurrency**: Use libraries like `p-limit` to restrict concurrent requests during the build process (e.g., max 5 parallel requests).
- **Backoff**: Implement exponential backoff for `429 Too Many Requests` errors.

## 🛡 Policy

- All AI-generated content must be reviewed by a human before publishing.
- No user data is sent to AI endpoints.
