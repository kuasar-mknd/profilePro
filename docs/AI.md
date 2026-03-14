# AI Integration Documentation

> **Status:** No active AI integration.
> **Plan:** Future integration for project summarization.

## 🤖 Models & Configuration

Currently, this project does not integrate live AI models, as it is a fully static Astro SSG portfolio. The roadmap includes plans for an AI adapter script used strictly at build time to summarize markdown project descriptions.

### Configuration Strategy

If implemented, the AI adapter will require the following:

- **Provider**: Local AI (e.g., Ollama) or Cloud API (OpenAI/Anthropic).
- **Location**: The logic will reside in a build script or Astro integration (`src/utils/ai.ts`), not a live Hono backend.
- **Environment Variables**:
  - `AI_API_KEY`: The secret key to access the LLM provider.
  - `AI_MODEL_NAME`: The model version to use (e.g., `gpt-4o-mini`, `llama3`).
  - *These variables must be added to `src/env.d.ts` and `.env.example` before use.*

## 📋 Data Schemas (Expected)

If AI integration is added, the expected JSON schema for a project summary might look like:

```json
{
  "summary": "Short text summary of the project...",
  "keywords": ["tag1", "tag2"],
  "sentiment": "positive"
}
```

*(Note: This project currently has no active AI or adapter implementation. The schema above is strictly aspirational and serves as a placeholder for future iterations.)*

## 🫰 Cost-Control Guidance & Limits

- **Static Generation Strategy**: Since this is an Astro SSG project without a Hono backend, AI model execution is restricted strictly to **build time** (e.g., inside `getStaticPaths` or an integration script). There are **no runtime AI costs** and no serverless latency for users.
- **Caching**: AI responses *must* be heavily cached locally (e.g., in `.astro/cache` or a `src/data/ai-cache.json` flat file). This ensures the model is not re-queried during redundant CI builds unless the source Markdown actually changes.
- **Rate Limit Management**: The build script adapter must implement a queue or concurrency limiter (like `p-limit`) to prevent exceeding API rate limits when statically generating metadata for many projects simultaneously.

## 🛡 Policy

- All AI-generated content must be reviewed by a human before publishing.
- No user data is sent to AI endpoints.
