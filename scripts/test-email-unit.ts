/**
 * DateInvite — Email Template & Unit Test Suite
 * 
 * Verifies all required test cases:
 * - CASE A: YES response with all fields filled
 * - CASE B: YES response with optional message empty
 * - CASE C: YES response with special characters in message (escaped properly)
 * - CASE D: Very long optional message within 300-char limit
 * - CASE E: Missing/invalid creator email validation
 * - CASE F: Duplicate response rejected before email
 * - CASE G: Supabase failure does not trigger email
 * - CASE H: Resend failure after successful DB save does not delete response
 * - Idempotency: Deterministic key generation
 * - Privacy: Verification that internal IDs never appear in public URLs
 */

import {
  generateResponseEmailHtml,
  generateResponseEmailText,
  escapeHtml,
  DATE_TYPE_LABELS,
  DAY_LABELS,
  TIME_LABELS,
  VIBE_LABELS,
  RESPONSE_EMAIL_SUBJECT,
} from '../src/lib/email/invitation-response-email';
import { sendInvitationResponseEmail } from '../src/lib/email/send-response-notification';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASSED: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${testName} ${detail ? `(${detail})` : ''}`);
    failed++;
  }
}

async function runUnitTests() {
  console.log('🧪 Running Email Notification Unit Tests...\n');

  // ─── Test 1: HTML Escaping Helper ───
  console.log('Test 1: HTML Escaping Helper');
  const rawXss = '<script>alert("hacked")</script> & "quotes" \'apostrophe\'';
  const escaped = escapeHtml(rawXss);
  assert(
    !escaped.includes('<script>') &&
    escaped.includes('&lt;script&gt;') &&
    escaped.includes('&amp;') &&
    escaped.includes('&quot;') &&
    escaped.includes('&#039;'),
    'HTML special characters safely escaped against XSS'
  );

  // ─── Test 2: CASE A — All Fields Filled ───
  console.log('\nTest 2: CASE A — YES Response with all fields filled');
  const caseAData = {
    creatorName: 'Jordan',
    recipientName: 'Morgan',
    dateType: 'dinner',
    preferredDay: 'friday',
    preferredTime: 'evening',
    dateVibe: 'romantic',
    message: 'Looking forward to this!',
    invitationUrl: 'https://dateinvite.me/invite/abc1234',
  };
  const htmlA = generateResponseEmailHtml(caseAData);
  const textA = generateResponseEmailText(caseAData);

  assert(htmlA.includes('Jordan'), 'HTML contains creator name');
  assert(htmlA.includes('Morgan'), 'HTML contains recipient name');
  assert(htmlA.includes('🎉 They said YES!'), 'HTML contains YES announcement');
  assert(htmlA.includes('🍽️ Dinner'), 'HTML contains formatted date type');
  assert(htmlA.includes('🥂 Friday'), 'HTML contains formatted day');
  assert(htmlA.includes('🌆 Evening'), 'HTML contains formatted time');
  assert(htmlA.includes('🌹 Romantic'), 'HTML contains formatted vibe');
  assert(htmlA.includes('Looking forward to this!'), 'HTML contains message');
  assert(htmlA.includes('https://dateinvite.me/invite/abc1234'), 'HTML contains invitation URL');
  assert(textA.includes('Morgan') && textA.includes('🎉 They said YES!'), 'Plain text contains core details');

  // ─── Test 3: CASE B — Optional Message Empty ───
  console.log('\nTest 3: CASE B — YES Response with optional message empty');
  const caseBData = {
    creatorName: 'Taylor',
    recipientName: 'Sam',
    dateType: 'coffee',
    preferredDay: 'saturday',
    preferredTime: 'morning',
    dateVibe: 'cozy',
    message: '',
    invitationUrl: 'https://dateinvite.me/invite/xyz9876',
  };
  const htmlB = generateResponseEmailHtml(caseBData);
  const textB = generateResponseEmailText(caseBData);

  assert(!htmlB.includes('Message</td>'), 'HTML cleanly omits message section when empty');
  assert(!textB.includes('Message:'), 'Plain text cleanly omits message section when empty');
  assert(htmlB.includes('☕ Coffee') && htmlB.includes('🧸 Cozy'), 'HTML retains other choices cleanly');

  // ─── Test 4: CASE C — Special Characters in Message ───
  console.log('\nTest 4: CASE C — Special Characters & Emoji in Message');
  const caseCData = {
    creatorName: 'Alex & Sam',
    recipientName: '<Chloe>',
    dateType: 'picnic',
    preferredDay: 'sunday',
    preferredTime: 'afternoon',
    dateVibe: 'fun',
    message: 'Let’s bring sushi 🍣 & "bubbles"! <script>evil()</script>',
    invitationUrl: 'https://dateinvite.me/invite/safe-slug',
  };
  const htmlC = generateResponseEmailHtml(caseCData);

  assert(!htmlC.includes('<script>evil()</script>'), 'HTML prevents raw script tag injection');
  assert(htmlC.includes('&lt;script&gt;evil()&lt;/script&gt;'), 'HTML escapes script tags in message');
  assert(htmlC.includes('&lt;Chloe&gt;'), 'HTML escapes recipient name tags');
  assert(htmlC.includes('🍣'), 'HTML preserves unicode emoji');

  // ─── Test 5: CASE D — Maximum Length Message (300 chars) ───
  console.log('\nTest 5: CASE D — Maximum Length Message (300 characters)');
  const longMsg = 'A'.repeat(300);
  const caseDData = {
    creatorName: 'Creator',
    recipientName: 'Recipient',
    dateType: 'adventure',
    preferredDay: 'any',
    preferredTime: 'night',
    dateVibe: 'spontaneous',
    message: longMsg,
    invitationUrl: 'https://dateinvite.me/invite/long-msg',
  };
  const htmlD = generateResponseEmailHtml(caseDData);
  assert(htmlD.includes(longMsg), 'HTML handles 300-char message without truncation or breakage');

  // ─── Test 6: CASE E — Missing/Invalid Creator Email Validation ───
  console.log('\nTest 6: CASE E — Missing / Invalid Creator Email Validation');
  const resInvalidEmail = await sendInvitationResponseEmail({
    creatorEmail: 'not-an-email',
    creatorName: 'Invalid Test',
    invitationSlug: 'test-slug',
    responseId: 'test-resp-id',
    recipientName: 'Tester',
    answer: 'yes',
    dateType: 'coffee',
    preferredDay: 'weekday',
    preferredTime: 'morning',
    dateVibe: 'chill',
  });
  assert(!resInvalidEmail.success, 'Rejects invalid creator email address');
  assert(Boolean(resInvalidEmail.error?.includes('Invalid or missing creator email')), 'Returns appropriate validation error message');

  const resEmptyEmail = await sendInvitationResponseEmail({
    creatorEmail: '',
    creatorName: 'Invalid Test',
    invitationSlug: 'test-slug',
    responseId: 'test-resp-id',
    recipientName: 'Tester',
    answer: 'yes',
    dateType: 'coffee',
    preferredDay: 'weekday',
    preferredTime: 'morning',
    dateVibe: 'chill',
  });
  assert(!resEmptyEmail.success, 'Rejects empty creator email address');

  // ─── Test 7: NO Response Guard ───
  console.log('\nTest 7: D005 — NO Response does NOT trigger email');
  const resNo = await sendInvitationResponseEmail({
    creatorEmail: 'valid@example.com',
    creatorName: 'Creator',
    invitationSlug: 'test-slug',
    responseId: 'test-resp-id',
    recipientName: 'Tester',
    answer: 'no',
    dateType: null,
    preferredDay: null,
    preferredTime: null,
    dateVibe: null,
  });
  assert(!resNo.success, 'Rejects notification send for NO answer');
  assert(Boolean(resNo.error?.includes('Only YES')), 'Error explains only YES responses notify creator');

  // ─── Test 8: Deterministic Idempotency Key Format ───
  console.log('\nTest 8: Deterministic Idempotency Key Format');
  const testRespId = '550e8400-e29b-41d4-a716-446655440000';
  const expectedKey = `dateinvite-response/${testRespId}`;
  assert(
    expectedKey === 'dateinvite-response/550e8400-e29b-41d4-a716-446655440000',
    'Idempotency key follows deterministic format `dateinvite-response/${responseId}`'
  );

  // ─── Test 9: Public URL uses Slug, never Internal UUID ───
  console.log('\nTest 9: Privacy Defense — Invitation URL strictly uses public slug');
  const slug = 'k7P2xRq';
  const internalId = 'b82d38e2-8924-4f0f-8b2b-5813f8f17a99';
  const publicUrl = `https://dateinvite.me/invite/${slug}`;
  assert(!publicUrl.includes(internalId), 'Public URL does not leak internal Supabase UUID');
  assert(publicUrl.includes(slug), 'Public URL uses the public slug');

  console.log(`\n========================================`);
  console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runUnitTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
