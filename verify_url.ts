function isValidUrl(url: string): boolean {
  return /^(https?:\/\/|\/)/i.test(url);
}
console.log("//evil.com:", isValidUrl("//evil.com"));
console.log("/valid/path:", isValidUrl("/valid/path"));
