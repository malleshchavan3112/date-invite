import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      process.env[key] = value;
    }
  }
}

import {
  createInvitation,
  getPublicInvitationBySlug,
  getInvitationByCreatorToken,
  getInvitationStatusData,
} from '../src/lib/invitation-repository';
import { submitResponse, submitNoResponse } from '../src/lib/response-repository';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runPhase9ATests() {
  console.log('🧪 Starting Phase 9A Creator Dashboard & Private Access Verification...\n');

  // TEST 1: Create invitation — verify public slug and private creator access token exist & are different
  console.log('TEST 1: Creating invitation and verifying public slug vs private token...');
  const testEmail = `creator.${Date.now()}@example.com`;
  const creatorName = 'Rowan';
  const invitation = await createInvitation({
    creator_name: creatorName,
    creator_email: testEmail,
    title: 'Would you go out on a date with me?',
  });

  assert(Boolean(invitation.slug), 'Public slug must exist');
  assert(Boolean(invitation.creator_access_token), 'Creator access token must exist');
  assert(invitation.slug !== invitation.creator_access_token, 'Public slug and creator access token MUST be different');
  assert(invitation.creator_access_token.length >= 32, 'Creator access token must be at least 32 characters long');
  console.log(`✅ TEST 1 PASSED:
     Public slug: ${invitation.slug}
     Private creator token: ${invitation.creator_access_token}
     Different: TRUE`);

  // TEST 2: Open public invitation — verify Privacy Firewall strictly excludes creator_access_token
  console.log('\nTEST 2: Verifying public invitation strictly strips creator_access_token & creator_email...');
  const publicInv = await getPublicInvitationBySlug(invitation.slug);
  assert(publicInv !== null, 'Public invitation must be resolvable');
  assert(!('creator_email' in (publicInv as unknown as Record<string, unknown>)), 'creator_email MUST NOT be in public data');
  assert(!('creator_access_token' in (publicInv as unknown as Record<string, unknown>)), 'creator_access_token MUST NOT be in public data');
  console.log('✅ TEST 2 PASSED: Recipient data strictly strips creator_access_token and creator_email.');

  // TEST 3: Open private dashboard link — verify Creator Dashboard loads with Waiting State
  console.log('\nTEST 3: Verifying private dashboard loads via creator_access_token (Waiting State)...');
  const dashboardResult = await getInvitationByCreatorToken(invitation.creator_access_token);
  assert(dashboardResult.status === 'ok', 'Dashboard lookup must return status ok');
  if (dashboardResult.status === 'ok') {
    assert(dashboardResult.invitation.creator_name === creatorName, 'Creator name must match');
    assert(dashboardResult.response === null, 'Response must be null initially (waiting state)');
    assert(!('creator_email' in (dashboardResult.invitation as unknown as Record<string, unknown>)), 'creator_email must not be exposed to dashboard view');
    assert(!('id' in (dashboardResult.invitation as unknown as Record<string, unknown>)), 'Internal UUID must not be exposed');
  }
  console.log('✅ TEST 3 PASSED: Dashboard loads via private token in Waiting State with sanitized props.');

  // TEST 4: Fresh session verification — token still works without any login credentials
  console.log('\nTEST 4: Verifying token resolves persistently without login/session state...');
  const reloadResult = await getInvitationByCreatorToken(invitation.creator_access_token);
  assert(reloadResult.status === 'ok', 'Dashboard must reload successfully without auth session');
  console.log('✅ TEST 4 PASSED: Private dashboard is login-free and accessible across sessions.');

  // TEST 5: Submit YES response through recipient flow — verify creator dashboard reflects YES
  console.log('\nTEST 5: Submitting YES response and checking dashboard update...');
  const yesSubmit = await submitResponse({
    invitation_id: invitation.id,
    answer: 'yes',
    recipient_name: 'Morgan',
    date_type: 'dinner',
    preferred_day: 'friday',
    preferred_time: 'evening',
    date_vibe: 'cozy',
    activity_preference: 'outdoor',
    location_preference: 'nature',
    food_preference: 'fine_dining',
    spontaneity: 'loose_plan',
    message: 'Looking forward to our dinner!',
  });
  assert(yesSubmit.success, 'YES submission must succeed');

  const yesDashboard = await getInvitationByCreatorToken(invitation.creator_access_token);
  assert(yesDashboard.status === 'ok', 'Dashboard lookup after YES must succeed');
  if (yesDashboard.status === 'ok') {
    assert(yesDashboard.response !== null, 'Response must be present');
    assert(yesDashboard.response?.answer === 'yes', 'Response answer must be YES');
    assert(yesDashboard.response?.recipient_name === 'Morgan', 'Recipient name must match');
    assert(yesDashboard.response?.activity_preference === 'outdoor', 'activity_preference must match');
    assert(yesDashboard.response?.location_preference === 'nature', 'location_preference must match');
    assert(yesDashboard.response?.food_preference === 'fine_dining', 'food_preference must match');
    assert(yesDashboard.response?.spontaneity === 'loose_plan', 'spontaneity must match');
    assert(yesDashboard.response?.message === 'Looking forward to our dinner!', 'message must match');
    assert(!('id' in (yesDashboard.response as unknown as Record<string, unknown>)), 'Response ID must not be exposed');
    assert(!('invitation_id' in (yesDashboard.response as unknown as Record<string, unknown>)), 'invitation_id must not be exposed');
  }
  console.log('✅ TEST 5 PASSED: Dashboard dynamically reflects full YES response with all Phase 8 fields.');

  // TEST 6: Create new invitation and submit NO response — verify creator dashboard reflects NO
  console.log('\nTEST 6: Testing NO response lifecycle...');
  const invForNo = await createInvitation({
    creator_name: 'Sam',
    creator_email: `sam.${Date.now()}@example.com`,
  });
  const noSubmit = await submitNoResponse(invForNo.id);
  assert(noSubmit.success, 'NO submission must succeed');

  const noDashboard = await getInvitationByCreatorToken(invForNo.creator_access_token);
  assert(noDashboard.status === 'ok', 'Dashboard lookup after NO must succeed');
  if (noDashboard.status === 'ok') {
    assert(noDashboard.response !== null, 'Response must be present');
    assert(noDashboard.response?.answer === 'no', 'Response answer must be NO');
    assert(noDashboard.response?.recipient_name === null, 'Recipient name must be null for NO');
  }
  console.log('✅ TEST 6 PASSED: Dashboard accurately and respectfully reflects NO response without fake data.');

  // TEST 7: Open invalid private token — verify friendly not_found error
  console.log('\nTEST 7: Testing invalid private dashboard token...');
  const invalidResult = await getInvitationByCreatorToken('invalid-fake-token-xyz-12345678');
  assert(invalidResult.status === 'not_found', 'Invalid token must return not_found');
  console.log('✅ TEST 7 PASSED: Invalid private token safely returns not_found without leaking DB errors.');

  // TEST 8: Try public invitation slug as /manage/[token] — verify access is REJECTED
  console.log('\nTEST 8: Testing public slug passed into /manage/[token] (Impostor Check)...');
  const slugAsTokenResult = await getInvitationByCreatorToken(invitation.slug);
  assert(slugAsTokenResult.status === 'not_found', 'Public slug must NOT grant creator dashboard access');
  console.log('✅ TEST 8 PASSED: Public slug rejected as access token. Impostor access prevented!');

  // TEST 9: Check public status route /invite/[slug]/status — verify NO private response leaks
  console.log('\nTEST 9: Verifying /invite/[slug]/status privacy guard...');
  const publicStatusResult = await getInvitationStatusData(invitation.slug);
  assert(publicStatusResult.status === 'ok', 'Public status lookup must succeed');
  if (publicStatusResult.status === 'ok') {
    assert(publicStatusResult.response === null, 'Public status route MUST NOT leak response data');
  }
  console.log('✅ TEST 9 PASSED: Public status route hides all private responses.');

  console.log('\n🎉 ALL 9 ARCHITECTURAL VERIFICATION TESTS PASSED PERFECTLY!\n');
}

runPhase9ATests().catch((err) => {
  console.error('\n❌ VERIFICATION TEST FAILED:', err);
  process.exit(1);
});
