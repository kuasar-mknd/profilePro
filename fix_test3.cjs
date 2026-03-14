const fs = require('fs');

let filepath = 'src/utils/security.test.ts';
let code = fs.readFileSync(filepath, 'utf8');

code = code.replace(/expect\(sanitizeUrl\("data:text\\\/html,<script>alert\\(1\\)<\\\/script>"\)\)\.toBe\(\n\s*"about:blank",\n\s*\);/g, 'expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");');
code = code.replace(/expect\(sanitizeUrl\("vbscript:msgbox\\(1\\)"\)\)\.toBe\("about:blank"\);/g, 'expect(sanitizeUrl("vbscript:msgbox(1)")).toBe("");');
code = code.replace(/expect\(sanitizeUrl\("\\x01javascript:alert\\(1\\)"\)\)\.toBe\("about:blank"\);/g, 'expect(sanitizeUrl("\\x01javascript:alert(1)")).toBe("");');

fs.writeFileSync(filepath, code);
