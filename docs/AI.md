# AI Integration Documentation

> **Status:** No active AI integration.
> **Plan:** Future integration for project summarization.

## 🤖 Models & Configuration

Currently, this project does not integrate live AI models. The roadmap includes plans for a local AI model to summarize project descriptions.

### Future Configuration
- **Provider**: Local (e.g., Ollama) or Cloud API (OpenAI/Anthropic).
- **Env Vars**: TBD (e.g., `AI_API_KEY`).

## 🫰 Cost & Limits

- **Strategy**: Static Generation (SSG).
- **Explanation**: AI operations will be performed at **build time** to generate summaries/metadata. This avoids runtime costs and latency for users.

## 🛡 Policy

- All AI-generated content must be reviewed by a human before publishing.
- No user data is sent to AI endpoints.
