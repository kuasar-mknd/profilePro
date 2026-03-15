with open("src/utils/security.ts", "r") as f:
    content = f.read()

content = content.replace('"\\\\u2028": "\\\\u2028",', '"\\u2028": "\\u005cu2028",')
content = content.replace('"\\\\u2029": "\\\\u2029",', '"\\u2029": "\\u005cu2029",')
content = content.replace('/[<>&\'\\\\u2028\\\\u2029]/g', '/[<>&\'\\u2028\\u2029]/g')

with open("src/utils/security.ts", "w") as f:
    f.write(content)
