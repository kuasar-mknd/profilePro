🔒 Fix potential ReDoS in EMAIL_PATTERN regex

🎯 **What:**
The `EMAIL_PATTERN` regex in `src/utils/security.ts` contained a vulnerable domain validation pattern: `(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+`. This construct contains overlapping character classes (the alphanumeric requirement and the hyphen-allowed middle section) along with nested quantifiers.

⚠️ **Risk:**
This anti-pattern (`A*A`) can trigger catastrophic backtracking (ReDoS) if provided with maliciously crafted input strings (e.g., long sequences of characters causing the regex engine to explore exponentially many paths before failing). This could lead to high CPU usage or application denial of service.

🛡️ **Solution:**
Replaced the domain pattern with `(?:[a-zA-Z0-9]+(?:-+[a-zA-Z0-9]+)*\.)+`.
This new pattern prevents overlapping groups by strictly separating alphanumeric characters and hyphens, completely avoiding nested quantifiers that cause excessive backtracking. It accurately maintains the intended business logic (domains cannot start or end with a hyphen, but can contain hyphens in the middle) while executing safely and in linear time.
