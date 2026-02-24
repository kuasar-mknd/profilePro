try {
  console.log('images/logo.png:', new URL('images/logo.png'));
} catch (e) {
  console.log('images/logo.png failed to parse');
}

try {
  console.log('http://:8080:', new URL('http://:8080'));
} catch (e) {
  console.log('http://:8080 failed to parse');
}

try {
  console.log('foo:bar:', new URL('foo:bar'));
} catch (e) {
  console.log('foo:bar failed to parse');
}
