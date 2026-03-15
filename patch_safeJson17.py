import re

with open("src/utils/security.ts", "r") as f:
    content = f.read()

new_map = """const SAFE_JSON_MAP: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "'": "\\u0027",
  "\\u2028": "\\u2028",
  "\\u2029": "\\u2029",
};
const SAFE_JSON_REGEX = /[<>&'\\u2028\\u2029]/g;"""

content = content[:content.find('const SAFE_JSON_MAP: Record<string, string> = {')] + new_map + content[content.find('export function safeJson(value: any): string {'):]

with open("src/utils/security.ts", "w") as f:
    f.write(content)
