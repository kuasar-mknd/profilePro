// eslint-disable-next-line no-console
console.log('--- URL Parsing Tests ---');

try {
  // eslint-disable-next-line no-console
  console.log('images/logo.png:', new URL('images/logo.png'));
} catch {
  // eslint-disable-next-line no-console
  console.log('images/logo.png failed to parse');
}

try {
  // eslint-disable-next-line no-console
  console.log('http://:8080:', new URL('http://:8080'));
} catch {
  // eslint-disable-next-line no-console
  console.log('http://:8080 failed to parse');
}

try {
  // eslint-disable-next-line no-console
  console.log('foo:bar:', new URL('foo:bar'));
} catch {
  // eslint-disable-next-line no-console
  console.log('foo:bar failed to parse');
}
