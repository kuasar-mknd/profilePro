try {
  // eslint-disable-next-line no-console
  console.log('images/logo.png:', new URL('images/logo.png'));
} catch (_e) {
  // eslint-disable-next-line no-console
  console.log('images/logo.png failed to parse');
}

try {
  // eslint-disable-next-line no-console
  console.log('http://:8080:', new URL('http://:8080'));
} catch (_e) {
  // eslint-disable-next-line no-console
  console.log('http://:8080 failed to parse');
}

try {
  // eslint-disable-next-line no-console
  console.log('foo:bar:', new URL('foo:bar'));
} catch (_e) {
  // eslint-disable-next-line no-console
  console.log('foo:bar failed to parse');
}
