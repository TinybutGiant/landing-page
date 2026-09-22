import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import {
  getApprovedGuideLoginPath,
  resolveApplicantContinuation,
} from '../src/lib/applicantContinuation.ts';

const applicantState = (applicationStatus) => ({
  hasApplication: true,
  applicationStatus,
  isGuide: true,
  role: 'guide',
  hasGuideProfile: true,
});

test('an existing guide with a server draft continues the draft', () => {
  assert.equal(
    resolveApplicantContinuation(applicantState('drafted')),
    'continue_server_draft'
  );
});

test('an existing guide asked for more information continues required changes', () => {
  assert.equal(
    resolveApplicantContinuation(applicantState('needs_more_info')),
    'continue_required_changes'
  );
});

for (const status of ['pending', 'approved', 'rejected']) {
  test(`an existing guide with ${status} application state stays on local status`, () => {
    assert.equal(resolveApplicantContinuation(applicantState(status)), 'view_status');
  });
}

test('an unknown existing application fails closed to local status', () => {
  assert.equal(resolveApplicantContinuation(applicantState('unexpected')), 'view_status');
  assert.equal(
    resolveApplicantContinuation({ hasApplication: true, isGuide: true }),
    'view_status'
  );
});

test('no application starts the applicant flow even when stale guide fields are present', () => {
  assert.equal(
    resolveApplicantContinuation({
      hasApplication: false,
      isGuide: true,
      role: 'guide',
      hasGuideProfile: true,
    }),
    'start_application'
  );
});

test('approved dashboard access goes through an explicitly encoded main-site login path', () => {
  assert.equal(getApprovedGuideLoginPath(), '/login?redirect=%2Fguide-dashboard');
});

test('the applicant entry page has no main-site dashboard navigation producer', async () => {
  const source = await readFile(
    new URL('../src/pages/BecomeGuidePage.tsx', import.meta.url),
    'utf8'
  );

  assert.doesNotMatch(source, /guide_home/);
  assert.doesNotMatch(source, /guide-dashboard/);
  assert.doesNotMatch(source, /onNavigateToGuideHome/);
  assert.doesNotMatch(source, /getMarketplaceUrl/);
});
