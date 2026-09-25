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

import { createInvitation } from '../src/lib/invitation-repository';
import { submitResponse, submitNoResponse } from '../src/lib/response-repository';
import { checkCreatorStatusAction } from '../src/lib/actions';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runLiveE2ETests() {
  console.log('================================================================');
  console.log('🚀 DATEINVITE LIVE E2E DASHBOARD REFRESH & PERSISTENCE TEST');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // TEST SCENARIO 1: YES Flow
  // -------------------------------------------------------------
  console.log('─── SCENARIO 1: YES Flow — Waiting -> Response Received ───');
  
  // Step 1: Creator creates invitation
  console.log('1. Creating fresh invitation...');
  const creatorEmail = `creator.${Date.now()}@example.com`;
  const invitation1 = await createInvitation({
    creator_name: 'Alex Rivera',
    creator_email: creatorEmail,
    title: 'Would you go on a coffee & stargazing date with me?',
    intro_text: 'I planned something really special for us!',
  });
  console.log(`   Created invitation id: ${invitation1.id}`);
  console.log(`   Public slug: ${invitation1.slug}`);
  console.log(`   Private creator token: ${invitation1.creator_access_token}`);

  // Step 2: Creator opens dashboard using private token
  console.log('\n2. Creator opens dashboard at /manage/[token]...');
  const dashboardState1 = await checkCreatorStatusAction(invitation1.creator_access_token);
  if (dashboardState1.status !== 'ok') {
    throw new Error('Dashboard lookup must return ok');
  }
  assert(dashboardState1.response === null, 'Dashboard must initially be in STATE A (Waiting for response)');
  console.log('   ✅ Confirmed dashboard says: "Waiting for Response" (response === null)');

  // Step 3: Creator leaves dashboard open (live polling active)
  console.log('\n3. Creator dashboard remains open with polling loop active...');
  console.log('   Simulating recipient opening /invite/[slug] in separate session...');

  // Step 4: Recipient completes questionnaire and submits YES
  console.log('4. Recipient submits YES questionnaire answers...');
  const yesSubmission = await submitResponse({
    invitation_id: invitation1.id,
    answer: 'yes',
    recipient_name: 'Taylor Swift',
    date_type: 'dinner',
    preferred_day: 'saturday',
    preferred_time: 'evening',
    date_vibe: 'romantic',
    activity_preference: 'outdoor',
    location_preference: 'nature',
    food_preference: 'fine_dining',
    spontaneity: 'loose_plan',
    message: 'I would love to! Nature & fine dining sounds magical.',
  });
  assert(yesSubmission.success, 'YES submission must succeed');
  console.log('   ✅ Recipient submission succeeded.');

  // Step 5: Creator dashboard poll fires
  console.log('\n5. Next dashboard poll executes checkCreatorStatusAction(token)...');
  await sleep(1000); // Small realistic delay
  const polledDashboard1 = await checkCreatorStatusAction(invitation1.creator_access_token);
  if (polledDashboard1.status !== 'ok') {
    throw new Error('Polled dashboard must return ok');
  }
  assert(polledDashboard1.response !== null, 'Polled dashboard MUST now have response (STATE B)');
  console.log('   ✅ Live Polling Transition Verified: Dashboard updated from Waiting → Response Received!');

  // Step 6: Verify all fields in the received response
  const resp = polledDashboard1.response!;
  assert(resp.answer === 'yes', 'Response answer must be yes');
  assert(resp.recipient_name === 'Taylor Swift', 'Recipient name must match');
  assert(resp.date_type === 'dinner', 'date_type must match');
  assert(resp.preferred_day === 'saturday', 'preferred_day must match');
  assert(resp.preferred_time === 'evening', 'preferred_time must match');
  assert(resp.date_vibe === 'romantic', 'date_vibe must match');
  assert(resp.activity_preference === 'outdoor', 'activity_preference must match');
  assert(resp.location_preference === 'nature', 'location_preference must match');
  assert(resp.food_preference === 'fine_dining', 'food_preference must match');
  assert(resp.spontaneity === 'loose_plan', 'spontaneity must match');
  assert(resp.message === 'I would love to! Nature & fine dining sounds magical.', 'message must match');
  assert(Boolean(resp.submitted_at || resp.created_at), 'Timestamp must exist');
  console.log('   ✅ All Phase 8 fields present and verified:');
  console.log(`      • Answer: ${resp.answer}`);
  console.log(`      • Recipient Name: ${resp.recipient_name}`);
  console.log(`      • Activity Preference: ${resp.activity_preference}`);
  console.log(`      • Location Preference: ${resp.location_preference}`);
  console.log(`      • Food Preference: ${resp.food_preference}`);
  console.log(`      • Spontaneity: ${resp.spontaneity}`);
  console.log(`      • Message: ${resp.message}`);

  // Step 7: Manual refresh test
  console.log('\n7. Creator clicks manual Refresh button...');
  const manualRefresh = await checkCreatorStatusAction(invitation1.creator_access_token);
  if (manualRefresh.status !== 'ok' || manualRefresh.response === null) {
    throw new Error('Manual refresh must return response');
  }
  console.log('   ✅ Manual refresh verified: returns fresh server data without page reload.');

  // Step 8: Close browser and reopen private dashboard URL
  console.log('\n8. Simulating closing browser and reopening private dashboard URL later...');
  const reopenedDashboard = await checkCreatorStatusAction(invitation1.creator_access_token);
  if (reopenedDashboard.status !== 'ok' || reopenedDashboard.response === null) {
    throw new Error('Reopened dashboard must retain response');
  }
  assert(reopenedDashboard.response.recipient_name === 'Taylor Swift', 'Recipient name preserved');
  console.log('   ✅ Persistence verified: response remains permanently attached across sessions.');

  // -------------------------------------------------------------
  // TEST SCENARIO 2: NO Flow
  // -------------------------------------------------------------
  console.log('\n─── SCENARIO 2: Confirmed NO Flow — Waiting -> Truthful NO ───');

  // Step 1: Create another fresh invitation
  console.log('1. Creating fresh invitation for NO test...');
  const invitation2 = await createInvitation({
    creator_name: 'Jordan Lee',
    creator_email: `creator.no.${Date.now()}@example.com`,
    title: 'Wanna hang out this weekend?',
  });
  console.log(`   Public slug: ${invitation2.slug}`);
  console.log(`   Private creator token: ${invitation2.creator_access_token}`);

  // Step 2: Open creator dashboard
  console.log('2. Creator opens dashboard at /manage/[token]...');
  const dashboardState2 = await checkCreatorStatusAction(invitation2.creator_access_token);
  if (dashboardState2.status !== 'ok') {
    throw new Error('Dashboard lookup must return ok');
  }
  assert(dashboardState2.response === null, 'Initial state must be Waiting');
  console.log('   ✅ Initial State: Waiting for Response');

  // Step 3: Recipient submits confirmed NO
  console.log('3. Recipient clicks NO and confirms decline...');
  const noSubmission = await submitNoResponse(invitation2.id);
  assert(noSubmission.success, 'NO submission must succeed');
  console.log('   ✅ Recipient confirmed decline successfully recorded.');

  // Step 4: Dashboard auto-poll fires
  console.log('4. Creator dashboard poll detects response...');
  const polledDashboard2 = await checkCreatorStatusAction(invitation2.creator_access_token);
  if (polledDashboard2.status !== 'ok' || polledDashboard2.response === null) {
    throw new Error('Dashboard lookup must succeed and response must exist');
  }
  assert(polledDashboard2.response.answer === 'no', 'Answer must be NO');
  assert(polledDashboard2.response.activity_preference === null || polledDashboard2.response.activity_preference === undefined, 'No fabricated activity_preference for NO');
  assert(polledDashboard2.response.food_preference === null || polledDashboard2.response.food_preference === undefined, 'No fabricated food_preference for NO');
  console.log('   ✅ Live Polling Transition Verified: Waiting → Confirmed Decline (Truthful NO)!');
  console.log(`      • Answer: ${polledDashboard2.response.answer}`);
  console.log(`      • No fabricated questionnaire fields: Verified.`);

  // Step 5: Persistence check
  console.log('5. Reopening private dashboard link in fresh session...');
  const reopenedDashboard2 = await checkCreatorStatusAction(invitation2.creator_access_token);
  if (reopenedDashboard2.status !== 'ok' || reopenedDashboard2.response === null) {
    throw new Error('NO response persisted check failed');
  }
  assert(reopenedDashboard2.response.answer === 'no', 'NO response persisted');
  console.log('   ✅ Persistence verified: Truthful NO response is permanently stored.');

  console.log('\n================================================================');
  console.log('🎉 ALL END-TO-END LIVE REFRESH & PERSISTENCE TESTS PASSED!');
  console.log('================================================================');
}

runLiveE2ETests().catch((err) => {
  console.error('❌ E2E Test failed:', err);
  process.exit(1);
});
