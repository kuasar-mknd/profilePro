const fs = require('fs');
const content = fs.readFileSync('.jules/palette.md', 'utf8');

const newEntry = `
## ${new Date().toISOString().split('T')[0]} - Global Keyboard Shortcuts
**Learning:** When implementing global keyboard shortcuts (e.g., "T" for Back to Top), it is critical to explicitly check that modifier keys (\`e.ctrlKey\`, \`e.metaKey\`, \`e.altKey\`) are false. Failing to do so can intercept standard browser navigation commands (like Cmd+T to open a new tab), causing a severe UX regression.
**Action:** Always include \`!e.ctrlKey && !e.metaKey && !e.altKey\` in global keydown event listeners, and ensure inputs (\`INPUT\`, \`TEXTAREA\`, \`SELECT\`, \`isContentEditable\`) are ignored.
`;

if (!content.includes('Global Keyboard Shortcuts')) {
  fs.writeFileSync('.jules/palette.md', content + '\n' + newEntry);
}
