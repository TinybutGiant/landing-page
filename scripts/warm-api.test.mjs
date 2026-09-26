import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { afterEach, test } from 'node:test';

import { resetWarmApiForTests, warmApi } from '../src/lib/warmApi.ts';

afterEach(() => resetWarmApiForTests());

function recordingFetcher(result = Promise.resolve(new Response(null))) {
  const calls = [];
  const fetcher = (url, init) => {
    calls.push({ url, init });
    return result;
  };
  return { calls, fetcher };
}

test('sends one no-cors, credential-free GET to the API /healthz', () => {
  const { calls, fetcher } = recordingFetcher();
  warmApi('https://api.ahhh-yaotu.com', fetcher, 1_000_000);
  assert.deepEqual(calls, [
    {
      url: 'https://api.ahhh-yaotu.com/healthz',
      init: { mode: 'no-cors', cache: 'no-store', credentials: 'omit' },
    },
  ]);
});

test('uses a same-origin /healthz in development (empty API base)', () => {
  const { calls, fetcher } = recordingFetcher();
  warmApi('', fetcher, 1_000_000);
  assert.equal(calls[0].url, '/healthz');
});

test('pings at most once every five minutes across form pages', () => {
  const { calls, fetcher } = recordingFetcher();
  warmApi('', fetcher, 1_000_000);
  warmApi('', fetcher, 1_000_000 + 60_000);
  assert.equal(calls.length, 1);
  warmApi('', fetcher, 1_000_000 + 5 * 60_000);
  assert.equal(calls.length, 2);
});

test('a failed ping never surfaces', async () => {
  const { fetcher } = recordingFetcher(Promise.reject(new TypeError('Failed to fetch')));
  assert.doesNotThrow(() => warmApi('', fetcher, 1_000_000));
  await new Promise((resolve) => setImmediate(resolve));
});

test('signup, become-guide, and early-access pages warm the API', () => {
  for (const file of [
    'src/pages/SignupPage.tsx',
    'src/pages/BecomeGuidePage.tsx',
    'src/pages/EarlyAccessPage.tsx',
  ]) {
    assert.match(readFileSync(file, 'utf8'), /useWarmApi\(API_BASE\);/, file);
  }
});
