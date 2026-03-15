with open("src/utils/security.ts", "r") as f:
    content = f.read()

# We need to completely recreate the map and regex since they are totally botched
import re
new_map = """const SAFE_JSON_MAP: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "'": "\\u0027",
  "\\u2028": "\\u2028",
  "\\u2029": "\\u2029",
};
const SAFE_JSON_REGEX = /[<>&'\\u2028\\u2029]/g;
"""

# Replace the existing code with the proper mapping
import textwrap

old_code = """const SAFE_JSON_MAP: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "'": "\\u0027",
  "\\u2028": "\\u2028",
  "\\u2029": "\\u2029",
};
const SAFE_JSON_REGEX = /[<>&'\\u2028\\u2029]/g;"""

# In the current file it looks like:
# const SAFE_JSON_MAP: Record<string, string> = {
#   "<": "\u003c",
#   ">": "\u003e",
#   "&": "\u0026",
#   "'": "\u0027",
#   "\u2028": "\u2028",
#   "\u2029": "\u2029",
# };
# const SAFE_JSON_REGEX = /[<>&'\u2028\u2029]/g;

content = re.sub(r'const SAFE_JSON_MAP.*?const SAFE_JSON_REGEX = .*?;', new_map, content, flags=re.DOTALL)

with open("src/utils/security.ts", "w") as f:
    f.write(content)
