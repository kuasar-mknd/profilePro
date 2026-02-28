## 2025-05-27 - [Localization of Third-Party Scripts]

**Learning:** Third-party scripts (like Website Carbon Badge) often inject English content dynamically, creating a jarring experience on a localized site (French).
**Action:** When integrating third-party widgets, always check if they allow localization options or require manual DOM manipulation (post-render) to translate their content. In this case, I manually translated the text nodes injected by the script.
