import fs from 'fs';
import path from 'path';

// Load .env.local manually for standalone test script
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

import { createInvitation, getInvitationBySlug, getPublicInvitationBySlug } from '../src/lib/invitation-repository';
import { submitResponse, hasResponseForInvitation, getResponseByInvitationId } from '../src/lib/response-repository';

async function runTests() {
  console.log('🧪 Starting Phase 5 Supabase Integration Tests...\n');

  // Test 1: Create Invitation
  console.log('Test 1: Creating a real invitation in Supabase...');
  const testEmail = 'alex.test.' + Date.now() + '@example.com';
  const invitation = await createInvitation({
    creator_name: 'Alex Test',
    creator_email: testEmail,
    title: 'Would you go on a dinner date with me?',
    intro_text: 'Alex thinks you are amazing!',
  });

  if (!invitation.id || !invitation.slug) {
    throw new Error('Test 1 FAILED: Invitation created without id or slug');
  }
  console.log(`✅ Test 1 PASSED: Created invitation id=${invitation.id}, slug=${invitation.slug}`);

  // Test 2: Privacy Firewall — getPublicInvitationBySlug
  console.log('\nTest 2: Verifying Privacy Firewall (creator_email NEVER in PublicInvitation)...');
  const publicInv = await getPublicInvitationBySlug(invitation.slug);
  if (!publicInv) {
    throw new Error('Test 2 FAILED: Could not fetch public invitation by slug');
  }
  if ('creator_email' in (publicInv as unknown as Record<string, unknown>)) {
    throw new Error('Test 2 FAILED: Privacy Firewall breach! creator_email found in public invitation');
  }
  if (publicInv.creator_name !== 'Alex Test') {
    throw new Error('Test 2 FAILED: Creator name mismatch');
  }
  console.log('✅ Test 2 PASSED: Public invitation retrieved without creator_email. Firewall verified!');

  // Test 3: getInvitationBySlug (server-side only, includes email)
  console.log('\nTest 3: Verifying server-side invitation retrieval...');
  const serverInv = await getInvitationBySlug(invitation.slug);
  if (!serverInv || serverInv.creator_email !== testEmail) {
    throw new Error('Test 3 FAILED: Server-side invitation retrieval failed');
  }
  console.log('✅ Test 3 PASSED: Server-side invitation contains creator_email for notifications.');

  // Test 4: Submit Questionnaire Response
  console.log('\nTest 4: Submitting questionnaire response...');
  const submitResult = await submitResponse({
    invitation_id: invitation.id,
    answer: 'yes',
    recipient_name: 'Taylor',
    date_type: 'dinner',
    preferred_day: 'friday',
    preferred_time: 'evening',
    date_vibe: 'cozy',
    message: 'Can’t wait! Let’s pick a nice Italian place.',
  });

  if (!submitResult.success || !submitResult.response) {
    throw new Error(`Test 4 FAILED: Response submission failed: ${submitResult.error}`);
  }
  console.log(`✅ Test 4 PASSED: Response stored with id=${submitResult.response.id}`);

  // Test 5: Verify response existence
  console.log('\nTest 5: Checking response existence...');
  const hasResp = await hasResponseForInvitation(invitation.id);
  const fetchedResp = await getResponseByInvitationId(invitation.id);
  if (!hasResp || !fetchedResp || fetchedResp.recipient_name !== 'Taylor') {
    throw new Error('Test 5 FAILED: Response verification failed');
  }
  console.log('✅ Test 5 PASSED: Response exists and details match.');

  // Test 6: Duplicate Submission Protection
  console.log('\nTest 6: Testing duplicate submission protection...');
  const duplicateResult = await submitResponse({
    invitation_id: invitation.id,
    answer: 'yes',
    recipient_name: 'Taylor Second Attempt',
    date_type: 'coffee',
    preferred_day: 'saturday',
    preferred_time: 'morning',
    date_vibe: 'chill',
  });

  if (duplicateResult.success || duplicateResult.code !== 'ALREADY_SUBMITTED') {
    throw new Error(`Test 6 FAILED: Duplicate submission was not rejected! Code=${duplicateResult.code}`);
  }
  console.log('✅ Test 6 PASSED: Duplicate submission correctly rejected with code ALREADY_SUBMITTED.');

  // Test 7: Non-existent invitation rejection
  console.log('\nTest 7: Testing non-existent invitation submission...');
  const fakeId = '00000000-0000-0000-0000-000000000000';
  const invalidResult = await submitResponse({
    invitation_id: fakeId,
    answer: 'yes',
    recipient_name: 'Ghost',
    date_type: 'movie',
    preferred_day: 'sunday',
    preferred_time: 'night',
    date_vibe: 'fun',
  });

  if (invalidResult.success || invalidResult.code !== 'INVITATION_NOT_FOUND') {
    throw new Error(`Test 7 FAILED: Non-existent invitation not rejected properly! Code=${invalidResult.code}`);
  }
  console.log('✅ Test 7 PASSED: Non-existent invitation rejected with code INVITATION_NOT_FOUND.');

  console.log('\n🎉 ALL 7 SUPABASE INTEGRATION TESTS PASSED PERFECTLY!\n');
}

runTests().catch((err) => {
  console.error('\n❌ TEST RUNNER FAILED:', err);
  process.exit(1);
});
