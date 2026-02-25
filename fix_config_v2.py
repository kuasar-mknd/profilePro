import re

with open('astro.config.mjs', 'r') as f:
    content = f.read()

# Uncomment compress integration
content = content.replace('// compress({}),', 'compress({ CSS: true, HTML: { "html-minifier-terser": { removeAttributeQuotes: false } }, Image: false, JavaScript: true, SVG: true }),')

with open('astro.config.mjs', 'w') as f:
    f.write(content)
