import re

with open('astro.config.mjs', 'r') as f:
    content = f.read()

# Comment out compress integration
content = re.sub(r'compress\(\{.*?\}\),', '// compress({}),', content, flags=re.DOTALL)

with open('astro.config.mjs', 'w') as f:
    f.write(content)
