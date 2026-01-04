## 2025-02-18 - Accessible Character Counters
**Learning:** For character limits, visual color changes (yellow/red) are insufficient for screen readers. Using `aria-live="polite"` with a state-based approach (announcing only at thresholds like 10% remaining or limit reached) provides helpful feedback without spamming the user on every keystroke.
**Action:** When implementing input limits, always pair visual indicators with a throttled or state-driven `aria-live` announcer.
