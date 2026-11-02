import assert from 'node:assert/strict';
import { test } from 'node:test';

import { shouldHoldGuideForm } from '../src/lib/becomeGuideGate.ts';

const base = {
  authLoading: false,
  hasUser: true,
  isStatePending: false,
  isStateFetching: false,
  isLeavingGuideForm: false,
};

test('holds the form while auth is still loading', () => {
  assert.equal(shouldHoldGuideForm({ ...base, authLoading: true }), true);
});

test('holds the form on the first load of the application state', () => {
  assert.equal(
    shouldHoldGuideForm({ ...base, isStatePending: true, isStateFetching: true }),
    true
  );
});

test('keeps the form mounted during a background refetch', () => {
  // Regression: a background refetch used to unmount GuideForm and drop unsaved input.
  assert.equal(shouldHoldGuideForm({ ...base, isStateFetching: true }), false);
});

test('holds the form when the application is leaving for the status page', () => {
  assert.equal(shouldHoldGuideForm({ ...base, isLeavingGuideForm: true }), true);
});

test('anonymous visitors see the form without waiting for application state', () => {
  // A disabled query reports pending, but there is no state to wait for without a user.
  assert.equal(shouldHoldGuideForm({ ...base, hasUser: false, isStatePending: true }), false);
});
