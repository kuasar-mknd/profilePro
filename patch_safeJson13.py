with open("src/utils/security.ts", "r") as f:
    content = f.read()

search_str = """const SAFE_JSON_REGEX = /[<>&'  ]/g;"""
replace_str = """const SAFE_JSON_REGEX = /[<>&'\\u2028\\u2029]/g;"""

if search_str in content:
    content = content.replace(search_str, replace_str)

    # Also fix the map keys
    content = content.replace('  " ": "\\u2028",', '  "\\u2028": "\\u2028",')
    content = content.replace('  " ": "\\u2029",', '  "\\u2029": "\\u2029",')

    with open("src/utils/security.ts", "w") as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find string")
