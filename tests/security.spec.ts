import { expect, test } from "bun:test";
import { safeJson, sanitizeInput, sanitizeUrl, isValidUrl, VIMEO_ID_REGEX, YOUTUBE_ID_REGEX } from "../src/utils/security";

test("safeJson handles undefined or function inputs safely", () => {
  // JSON.stringify returns undefined for functions and undefined itself
  const undefinedOutput = safeJson(undefined);
  const functionOutput = safeJson(() => {});

  expect(undefinedOutput).toBe("null");
  expect(functionOutput).toBe("null");
});

test("safeJson escapes dangerous characters", () => {
  const input = {
    script: "<script>alert(1)</script>",
    ampersand: "Me & You",
    greater: "10 > 5",
    separator: "Line\u2028Break",
  };
  const output = safeJson(input);

  expect(output).toContain("\\u003cscript\\u003ealert(1)\\u003c/script\\u003e");
  expect(output).toContain("Me \\u0026 You");
  expect(output).toContain("10 \\u003e 5");
  expect(output).toContain("Line\\u2028Break");
});

test("sanitizeInput escapes HTML entities", () => {
  const input = '<script>alert("hello")</script>';
  const output = sanitizeInput(input);

  expect(output).toBe(
    "&lt;script&gt;alert&#40;&quot;hello&quot;&#41;&lt;&#x2F;script&gt;",
  );
});

test("sanitizeInput handles other dangerous characters", () => {
  const input = "javascript:alert(1)";
  // ( and ) are escaped, so function call is broken in attribute context if strict
  const output = sanitizeInput(input);
  expect(output).toBe("javascript:alert&#40;1&#41;");
});

test("sanitizeInput strips control characters", () => {
  // CR should be stripped, LF kept
  const input = "Header\r\nInjection";
  const output = sanitizeInput(input);
  expect(output).toBe("Header\nInjection");

  // Vertical Tab (\x0B) should be stripped
  const input2 = "Vertical\x0BTab";
  expect(sanitizeInput(input2)).toBe("VerticalTab");
});

test("sanitizeUrl blocks obfuscated javascript URLs", () => {
  expect(sanitizeUrl("jav%0Aascript:alert(1)")).toBe("");
  expect(sanitizeUrl("javascript&#58;alert(1)")).toBe("");
  expect(sanitizeUrl("javascript&colon;alert(1)")).toBe("");
  expect(sanitizeUrl(" jav&#x0a;ascript:alert(1)")).toBe("");

  expect(isValidUrl("javascript&#58;alert(1)")).toBe(false);
  expect(isValidUrl(" jav&#x0a;ascript:alert(1)")).toBe(false);
});

test("VIMEO_ID_REGEX should correctly match valid Vimeo strings and extract capture groups", () => {
  // standard valid cases
  expect("https://vimeo.com/123456789".match(VIMEO_ID_REGEX)?.[1]).toBe("123456789");
  expect("http://vimeo.com/987654321".match(VIMEO_ID_REGEX)?.[1]).toBe("987654321");
  expect("vimeo.com/112233".match(VIMEO_ID_REGEX)?.[1]).toBe("112233");
  expect("www.vimeo.com/123".match(VIMEO_ID_REGEX)?.[1]).toBe("123");
  expect("https://www.vimeo.com/456".match(VIMEO_ID_REGEX)?.[1]).toBe("456");

  // with hashes
  const matchHash = "https://vimeo.com/123456789/abcdef0123".match(VIMEO_ID_REGEX);
  expect(matchHash?.[1]).toBe("123456789");
  expect(matchHash?.[2]).toBe("abcdef0123");

  const matchHashNoHttp = "vimeo.com/987/xyZ1".match(VIMEO_ID_REGEX);
  expect(matchHashNoHttp?.[1]).toBe("987");
  expect(matchHashNoHttp?.[2]).toBe("xyZ1");
});

test("VIMEO_ID_REGEX should reject invalid strings and not match", () => {
  // completely invalid
  expect("https://notvimeo.com/123456789".match(VIMEO_ID_REGEX)).toBeNull();
  expect("https://youtube.com/watch?v=123".match(VIMEO_ID_REGEX)).toBeNull();
  expect("just a string".match(VIMEO_ID_REGEX)).toBeNull();

  // missing ID
  expect("https://vimeo.com/".match(VIMEO_ID_REGEX)).toBeNull();
  expect("vimeo.com".match(VIMEO_ID_REGEX)).toBeNull();

  // non-numeric ID
  expect("https://vimeo.com/abc".match(VIMEO_ID_REGEX)).toBeNull();

  // trailing slash on ID without hash
  expect("https://vimeo.com/123/".match(VIMEO_ID_REGEX)).toBeNull();

  // too many parts
  expect("https://vimeo.com/123/abc/def".match(VIMEO_ID_REGEX)).toBeNull();

  // subdomains other than www
  expect("https://player.vimeo.com/video/123".match(VIMEO_ID_REGEX)).toBeNull();
});

test("YOUTUBE_ID_REGEX should correctly match valid YouTube strings and extract capture groups", () => {
  // youtu.be/ID
  expect("https://youtu.be/12345678901".match(YOUTUBE_ID_REGEX)?.[1]).toBe("12345678901");
  // v/ID
  expect("https://youtube.com/v/12345678901".match(YOUTUBE_ID_REGEX)?.[1]).toBe("12345678901");
  // u/w/ID
  expect("https://youtube.com/u/w/12345678901".match(YOUTUBE_ID_REGEX)?.[1]).toBe("12345678901");
  // embed/ID
  expect("https://youtube.com/embed/12345678901".match(YOUTUBE_ID_REGEX)?.[1]).toBe("12345678901");
  // watch?v=ID
  expect("https://youtube.com/watch?v=12345678901".match(YOUTUBE_ID_REGEX)?.[1]).toBe("12345678901");
  // &v=ID
  expect("https://youtube.com/watch?abc=1&v=12345678901".match(YOUTUBE_ID_REGEX)?.[1]).toBe("12345678901");

  // with query params or hash after ID
  expect("https://youtu.be/12345678901?t=10s".match(YOUTUBE_ID_REGEX)?.[1]).toBe("12345678901");
  expect("https://youtu.be/12345678901#hash".match(YOUTUBE_ID_REGEX)?.[1]).toBe("12345678901");
  expect("https://youtube.com/watch?v=12345678901&t=10s".match(YOUTUBE_ID_REGEX)?.[1]).toBe("12345678901");
});

test("YOUTUBE_ID_REGEX should reject invalid strings and not match", () => {
  // invalid ID length (less than 11)
  expect("https://youtu.be/1234567890".match(YOUTUBE_ID_REGEX)).toBeNull();

  // invalid ID length (more than 11)
  expect("https://youtu.be/123456789012".match(YOUTUBE_ID_REGEX)).toBeNull();

  // completely invalid format
  expect("https://vimeo.com/123456789".match(YOUTUBE_ID_REGEX)).toBeNull();
  expect("just a string".match(YOUTUBE_ID_REGEX)).toBeNull();

  // missing ID
  expect("https://youtube.com/watch?v=".match(YOUTUBE_ID_REGEX)).toBeNull();
  expect("https://youtu.be/".match(YOUTUBE_ID_REGEX)).toBeNull();
});
