import assert from 'node:assert/strict';
import { test } from 'node:test';

import { guideLoginContinuation } from '../src/lib/authRedirects.ts';

// In Node there is no `window`, so the helper falls back to the canonical guide origin.
const ORIGIN = 'https://guide.ahhh-yaotu.com';

test('same-origin path is kept as the redirect', () => {
  assert.equal(
    guideLoginContinuation('/become-guide', '/fallback'),
    `${ORIGIN}/login?redirect=%2Fbecome-guide`
  );
});

test('external URLs are dropped instead of redirected to', () => {
  assert.equal(guideLoginContinuation('https://evil.example/x', '/fallback'), `${ORIGIN}/login`);
  assert.equal(guideLoginContinuation('//evil.example/x', '/fallback'), `${ORIGIN}/login`);
});

test('null or undefined redirect falls back to the given default', () => {
  const expected = `${ORIGIN}/login?redirect=%2Fbecome-guide`;
  assert.equal(guideLoginContinuation(null, '/become-guide'), expected);
  assert.equal(guideLoginContinuation(undefined, '/become-guide'), expected);
});

test('query string and hash are preserved inside the redirect', () => {
  assert.equal(
    guideLoginContinuation('/become-guide?step=2#form', '/fallback'),
    `${ORIGIN}/login?redirect=%2Fbecome-guide%3Fstep%3D2%23form`
  );
});
