/**
 * DateInvite — Phase 6 Resend + Testmail Integration Test Script
 * 
 * Verifies the complete end-to-end transactional email notification pipeline:
 * 1. Creates invitation in Supabase with Testmail destination
 * 2. Submits YES questionnaire response
 * 3. Confirms response persistence in Supabase
 * 4. Confirms Resend dispatch and emailSent flag
 * 5. Queries Testmail API to verify delivery into inbox
 * 6. Verifies email content (subject, recipient, sender, YES announcement, details, message, public link)
 * 7. Verifies duplicate submission protection blocks second email
 * 8. Verifies privacy firewall (no internal DB UUID leaks, creator_email kept safe)
 */

import fs from 'fs';
import path from 'path';

// ─── 1. Load .env.local ──────────────────────────────────────────────────
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

import { createInvitation, getInvitationById, getPublicInvitationBySlug } from '../src/lib/invitation-repository';
import { submitResponse, getResponseByInvitationId } from '../src/lib/response-repository';

interface TestmailEmail {
  id: string;
  subject: string;
  to: string;
  from: string;
  text: string;
  html: string;
  timestamp: number;
}

interface TestmailResponse {
  result: string;
  message?: string;
  count: number;
  emails: TestmailEmail[];
}

/**
 * Polls the Testmail JSON API for an email received with the specified tag.
 */
async function pollTestmail(
  apiKey: string,
  namespace: string,
  tag: string,
  maxWaitSeconds: number = 30
): Promise<TestmailEmail | null> {
  const url = `https://api.testmail.app/api/json?apikey=${encodeURIComponent(apiKey)}&namespace=${encodeURIComponent(namespace)}&tag=${encodeURIComponent(tag)}`;
  const startTime = Date.now();

  process.stdout.write(`Waiting for email at ${namespace}.${tag}@inbox.testmail.app `);

  while (Date.now() - startTime < maxWaitSeconds * 1000) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data: TestmailResponse = await res.json();
        if (data.result === 'success' && data.count > 0 && data.emails.length > 0) {
          process.stdout.write(' ✅\n');
          return data.emails[0];
        }
      }
    } catch {
      // transient network glitch during polling
    }

    process.stdout.write('.');
    await new Promise((r) => setTimeout(r, 2000));
  }

  process.stdout.write(' ⏱️ (Timeout)\n');
  return null;
}

/**
 * Counts total emails received at a Testmail tag.
 */
async function getTestmailEmailCount(
  apiKey: string,
  namespace: string,
  tag: string
): Promise<number> {
  const url = `https://api.testmail.app/api/json?apikey=${encodeURIComponent(apiKey)}&namespace=${encodeURIComponent(namespace)}&tag=${encodeURIComponent(tag)}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data: TestmailResponse = await res.json();
      if (data.result === 'success') {
        return data.count;
      }
    }
  } catch {
    // ignore
  }
  return 0;
}

async function runTestmailIntegration() {
  console.log('🧪 Starting Phase 6: Resend + Testmail End-to-End Integration Verification...\n');

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const testmailApiKey = process.env.TESTMAIL_API_KEY?.trim();
  const testmailNamespace = process.env.TESTMAIL_NAMESPACE?.trim();

  // Validate environment readiness
  if (!resendApiKey || !testmailApiKey || !testmailNamespace) {
    console.warn('⚠️  LIVE EMAIL VERIFICATION SKIPPED — Missing environment variables in .env.local:');
    if (!resendApiKey) console.warn('   - RESEND_API_KEY');
    if (!testmailApiKey) console.warn('   - TESTMAIL_API_KEY');
    if (!testmailNamespace) console.warn('   - TESTMAIL_NAMESPACE');
    console.log('\nTo run live email transmission and inbox inspection:');
    console.log('1. Add your real RESEND_API_KEY to .env.local');
    console.log('2. Add your real TESTMAIL_API_KEY and TESTMAIL_NAMESPACE to .env.local');
    console.log('3. Re-run: npx tsx scripts/test-email.ts\n');
    return;
  }

  const testTag = `di_${Date.now()}`;
  const testCreatorEmail = `${testmailNamespace}.${testTag}@inbox.testmail.app`;
  const creatorName = 'Cameron Test';
  const recipientName = 'Riley Test';

  console.log(`Configuration:`);
  console.log(`  Creator Email (Testmail): ${testCreatorEmail}`);
  console.log(`  Test Tag: ${testTag}`);
  console.log(`  Resend API Key: Present (${resendApiKey.slice(0, 6)}...)`);
  console.log(`  Testmail Namespace: ${testmailNamespace}\n`);

  // ─── Step 1: Create Invitation in Supabase ───
  console.log('Step 1: Creating invitation in Supabase...');
  const invitation = await createInvitation({
    creator_name: creatorName,
    creator_email: testCreatorEmail,
    title: 'Would you go on a romantic dinner with me?',
    intro_text: `${creatorName} would love to take you somewhere lovely.`,
  });

  if (!invitation.id || !invitation.slug) {
    throw new Error('Step 1 FAILED: Invitation creation failed');
  }
  console.log(`✅ Step 1 PASSED: Created invitation id=${invitation.id}, slug=${invitation.slug}`);

  // ─── Step 2: Verify Privacy Firewall on Public Invitation ───
  console.log('\nStep 2: Checking Privacy Firewall before submission...');
  const publicInv = await getPublicInvitationBySlug(invitation.slug);
  if (!publicInv || 'creator_email' in (publicInv as unknown as Record<string, unknown>)) {
    throw new Error('Step 2 FAILED: Privacy Firewall breached! creator_email found in public invitation');
  }
  console.log('✅ Step 2 PASSED: creator_email is strictly hidden from public invitation view.');

  // ─── Step 3: Submit YES Questionnaire Response ───
  console.log('\nStep 3: Submitting YES response to trigger Resend notification...');
  const submitResult = await submitResponse({
    invitation_id: invitation.id,
    answer: 'yes',
    recipient_name: recipientName,
    date_type: 'dinner',
    preferred_day: 'friday',
    preferred_time: 'evening',
    date_vibe: 'romantic',
    message: 'I would love that! Can’t wait for Italian food. 🍝',
  });

  if (!submitResult.success || !submitResult.response) {
    throw new Error(`Step 3 FAILED: Response persistence failed: ${submitResult.error}`);
  }
  console.log(`✅ Step 3 PASSED: Response saved to Supabase (id=${submitResult.response.id})`);
  console.log(`   Email dispatch status: emailSent=${submitResult.emailSent}`);

  if (!submitResult.emailSent) {
    throw new Error('Step 3 FAILED: submitResponse succeeded but Resend email dispatch failed.');
  }

  // ─── Step 4: Verify Response in Supabase ───
  console.log('\nStep 4: Confirming database persistence in Supabase...');
  const persistedResponse = await getResponseByInvitationId(invitation.id);
  if (!persistedResponse || persistedResponse.recipient_name !== recipientName) {
    throw new Error('Step 4 FAILED: Response not properly persisted in Supabase');
  }
  console.log('✅ Step 4 PASSED: Database response record confirmed.');

  // ─── Step 5: Query Testmail Inbox & Inspect Delivered Email ───
  console.log('\nStep 5: Polling Testmail inbox for delivered email...');
  const receivedEmail = await pollTestmail(testmailApiKey, testmailNamespace, testTag, 30);

  if (!receivedEmail) {
    throw new Error('Step 5 FAILED: Email did not arrive in Testmail inbox within timeout.');
  }

  console.log('✅ Step 5 PASSED: Email successfully received in Testmail inbox!');
  console.log(`   Received Subject: "${receivedEmail.subject}"`);
  console.log(`   From: "${receivedEmail.from}"`);
  console.log(`   To: "${receivedEmail.to}"`);

  // ─── Step 6: Verify Email Content ───
  console.log('\nStep 6: Verifying email contents against specifications...');
  const emailHtml = receivedEmail.html || '';
  const emailText = receivedEmail.text || '';
  const combined = emailHtml + '\n' + emailText;

  // Verification assertions
  if (!receivedEmail.subject.includes('💌 You got a DateInvite response!')) {
    throw new Error(`Step 6 FAILED: Subject mismatch (got "${receivedEmail.subject}")`);
  }
  if (!combined.includes(creatorName)) {
    throw new Error(`Step 6 FAILED: Email missing creator name "${creatorName}"`);
  }
  if (!combined.includes(recipientName)) {
    throw new Error(`Step 6 FAILED: Email missing recipient name "${recipientName}"`);
  }
  if (!combined.includes('They said YES!')) {
    throw new Error('Step 6 FAILED: Email missing "They said YES!" announcement');
  }
  if (!combined.includes('Dinner') && !combined.includes('dinner')) {
    throw new Error('Step 6 FAILED: Email missing date type "Dinner"');
  }
  if (!combined.includes('Friday') && !combined.includes('friday')) {
    throw new Error('Step 6 FAILED: Email missing preferred day "Friday"');
  }
  if (!combined.includes('Evening') && !combined.includes('evening')) {
    throw new Error('Step 6 FAILED: Email missing preferred time "Evening"');
  }
  if (!combined.includes('Romantic') && !combined.includes('romantic')) {
    throw new Error('Step 6 FAILED: Email missing date vibe "Romantic"');
  }
  if (!combined.includes('Italian food')) {
    throw new Error('Step 6 FAILED: Email missing personal message');
  }
  if (!combined.includes(invitation.slug)) {
    throw new Error(`Step 6 FAILED: Email CTA missing public invitation slug "${invitation.slug}"`);
  }
  if (combined.includes(invitation.id)) {
    throw new Error('Step 6 FAILED: Security breach! Internal Supabase UUID found in email body');
  }

  console.log('✅ Step 6 PASSED: All email content verified:');
  console.log('   - Subject matches: "💌 You got a DateInvite response!"');
  console.log(`   - Creator greeting present: "${creatorName}"`);
  console.log(`   - Recipient name present: "${recipientName}"`);
  console.log('   - YES acceptance badge present');
  console.log('   - Date choices present (Dinner, Friday, Evening, Romantic)');
  console.log('   - Personal message present');
  console.log(`   - Public slug present in link: "${invitation.slug}"`);
  console.log('   - Internal UUID strictly omitted');

  // ─── Step 7: Duplicate Submission & Duplicate Email Protection ───
  console.log('\nStep 7: Verifying duplicate submission protection...');
  const duplicateResult = await submitResponse({
    invitation_id: invitation.id,
    answer: 'yes',
    recipient_name: 'Impostor',
    date_type: 'coffee',
    preferred_day: 'saturday',
    preferred_time: 'morning',
    date_vibe: 'chill',
  });

  if (duplicateResult.success || duplicateResult.code !== 'ALREADY_SUBMITTED') {
    throw new Error(`Step 7 FAILED: Duplicate submission not rejected! (Code: ${duplicateResult.code})`);
  }

  // Wait 3 seconds and ensure inbox still only contains 1 email
  await new Promise((r) => setTimeout(r, 3000));
  const finalEmailCount = await getTestmailEmailCount(testmailApiKey, testmailNamespace, testTag);
  if (finalEmailCount !== 1) {
    throw new Error(`Step 7 FAILED: Duplicate email was dispatched! Count: ${finalEmailCount}`);
  }
  console.log('✅ Step 7 PASSED: Duplicate response rejected; no duplicate email dispatched.');

  console.log('\n🎉 ALL PHASE 6 RESEND + TESTMAIL INTEGRATION TESTS PASSED PERFECTLY!\n');
}

runTestmailIntegration().catch((err) => {
  console.error('\n❌ INTEGRATION TEST FAILED:', err);
  process.exit(1);
});
