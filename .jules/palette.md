## 2024-05-25 - [Harmonizing Focus and Hover Animations]
**Learning:** For interactive elements like buttons and cards, solely relying on focus rings creates a disjointed experience compared to the rich animations (scaling, lifting) seen on hover.
**Action:** Always mirror hover transforms (e.g., `hover:scale-110`) with corresponding focus-visible transforms (e.g., `focus-visible:scale-110`) to ensure keyboard users receive the same level of tactile feedback and delight.
