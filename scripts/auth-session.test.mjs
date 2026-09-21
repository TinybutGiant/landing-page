import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

import { logout, restoreAuthSession } from '../src/lib/auth.ts';

const AUTH_KEYS = ['yaotu_token', 'yaotu_user', 'yaotu_user_id'];
const DRAFT_KEY = 'yaotu_guide_application_anonymous_draft_v1';

class MemoryStorage {
  #values = new Map();

  getItem(key) {
    return this.#values.get(key) ?? null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }

  removeItem(key) {
    this.#values.delete(key);
  }
}

const cachedUser = {
  id: 11,
  username: 'old-user',
  email: 'old@example.com',
  fullName: 'Old User',
  isGuide: true,
  role: 'guide',
  readReceiptsEnabled: true,
  joinedDate: '2025-01-01',
};

const serverUser = {
  ...cachedUser,
  id: 27,
  username: 'current-user',
  email: 'current@example.com',
  fullName: 'Current User',
  isGuide: false,
  role: 'traveler',
  token: 'valid-token',
};

function seedIdentity(token = 'stored-token') {
  localStorage.setItem('yaotu_token', token);
  localStorage.setItem('yaotu_user', JSON.stringify(cachedUser));
  localStorage.setItem('yaotu_user_id', String(cachedUser.id));
}

function assertIdentityCleared() {
  for (const key of AUTH_KEYS) assert.equal(localStorage.getItem(key), null);
}

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
  localStorage.setItem(DRAFT_KEY, 'preserve-me');
});

test('stale cached user without a token is not restored', async () => {
  localStorage.setItem('yaotu_user', JSON.stringify(cachedUser));
  localStorage.setItem('yaotu_user_id', String(cachedUser.id));
  let validationCalled = false;

  const user = await restoreAuthSession(async () => {
    validationCalled = true;
    return serverUser;
  });

  assert.equal(user, null);
  assert.equal(validationCalled, false);
  assertIdentityCleared();
  assert.equal(localStorage.getItem(DRAFT_KEY), 'preserve-me');
});

test('invalid token clears only stale auth identity', async () => {
  seedIdentity('expired-token');

  const user = await restoreAuthSession(async () => {
    throw new Error('401');
  });

  assert.equal(user, null);
  assertIdentityCleared();
  assert.equal(localStorage.getItem(DRAFT_KEY), 'preserve-me');
});

test('valid token restores current authorization fields from the server', async () => {
  seedIdentity('valid-token');

  const user = await restoreAuthSession(async (token) => {
    assert.equal(token, 'valid-token');
    return serverUser;
  });

  assert.equal(user?.id, 27);
  assert.equal(user?.isGuide, false);
});

test('server user identity replaces a mismatched cached user', async () => {
  seedIdentity('valid-token');

  await restoreAuthSession(async () => serverUser);

  assert.equal(localStorage.getItem('yaotu_user_id'), '27');
  assert.equal(JSON.parse(localStorage.getItem('yaotu_user')).id, 27);
});

test('session stays unresolved while server validation is pending', async () => {
  seedIdentity('valid-token');
  let resolveValidation;
  const validation = new Promise((resolve) => {
    resolveValidation = resolve;
  });
  let settled = false;

  const restoring = restoreAuthSession(() => validation).then((user) => {
    settled = true;
    return user;
  });
  await Promise.resolve();

  assert.equal(settled, false);
  resolveValidation(serverUser);
  assert.equal((await restoring)?.id, 27);
});

test('logout cannot be undone by in-flight validation', async () => {
  seedIdentity('valid-token');
  let resolveValidation;
  const validation = new Promise((resolve) => {
    resolveValidation = resolve;
  });
  const restoring = restoreAuthSession(() => validation);

  logout();
  resolveValidation(serverUser);

  assert.equal(await restoring, null);
  assertIdentityCleared();
  assert.equal(localStorage.getItem(DRAFT_KEY), 'preserve-me');
});

test('logout stays logged out after startup restoration runs again', async () => {
  seedIdentity();
  logout();
  let validationCalled = false;

  const user = await restoreAuthSession(async () => {
    validationCalled = true;
    return serverUser;
  });

  assert.equal(user, null);
  assert.equal(validationCalled, false);
  assertIdentityCleared();
});

test('auth cleanup never deletes the anonymous guide draft', async () => {
  seedIdentity('expired-token');

  await restoreAuthSession(async () => {
    throw new Error('expired');
  });
  logout();

  assert.equal(localStorage.getItem(DRAFT_KEY), 'preserve-me');
});
