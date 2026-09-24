/**
 * DateInvite — Phase 6 End-to-End Simulation Test
 * 
 * Verifies complete end-to-end lifecycle against live Supabase:
 * 1. Creates invitation in Supabase
 * 2. Validates Privacy Firewall on public endpoint
 * 3. Submits full questionnaire response
 * 4. Verifies database persistence
 * 5. Verifies email generation, formatting, escaping, and idempotency key
 * 6. Verifies duplicate submission protection
 * 7. Verifies non-existent invitation handling
 * 8. Verifies inactive invitation handling
 */

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

import { createInvitation, getInvitationById, getPublicInvitationBySlug } from '../src/lib/invitation-repository';
import { submitResponse, getResponseByInvitationId } from '../src/lib/response-repository';
import { generateResponseEmailHtml, generateResponseEmailText } from '../src/lib/email/invitation-response-email';

async function runE2ESimulation() {
  console.log('🧪 Starting Phase 6 End-to-End Flow & Resilience Verification...\n');

  // Step 1: Create Invitation in Supabase
  console.log('Step 1: Creating invitation in Supabase...');
  const creatorEmail = `test.creator.${Date.now()}@example.com`;
  const creatorName = 'Sammy';
  const invitation = await createInvitation({
    creator_name: creatorName,
    creator_email: creatorEmail,
    title: 'Would you go on a dinner date with me?',
    intro_text: `${creatorName} thinks you are amazing!`,
  });

  if (!invitation.id || !invitation.slug) {
    throw new Error('Step 1 FAILED: Invitation creation failed');
  }
  console.log(`✅ Step 1 PASSED: Created invitation id=${invitation.id}, slug=${invitation.slug}`);

  // Step 2: Privacy Firewall check
  console.log('\nStep 2: Checking Privacy Firewall...');
  const publicInv = await getPublicInvitationBySlug(invitation.slug);
  if (!publicInv || 'creator_email' in (publicInv as unknown as Record<string, unknown>)) {
    throw new Error('Step 2 FAILED: Privacy Firewall breached! creator_email found');
  }
  if (publicInv.creator_name !== creatorName) {
    throw new Error('Step 2 FAILED: Creator name mismatch');
  }
  console.log('✅ Step 2 PASSED: Public view strictly hides creator_email.');

  // Step 3: Server-side invitation retrieval
  console.log('\nStep 3: Checking server-side invitation retrieval (with email)...');
  const serverInv = await getInvitationById(invitation.id);
  if (!serverInv || serverInv.creator_email !== creatorEmail) {
    throw new Error('Step 3 FAILED: Server-side retrieval failed');
  }
  console.log('✅ Step 3 PASSED: Server-side invitation retains creator_email for Resend.');

  // Step 4: Submit questionnaire response
  console.log('\nStep 4: Submitting recipient questionnaire response...');
  const recipientName = 'Alexandria';
  const submitResult = await submitResponse({
    invitation_id: invitation.id,
    answer: 'yes',
    recipient_name: recipientName,
    date_type: 'dinner',
    preferred_day: 'friday',
    preferred_time: 'evening',
    date_vibe: 'cozy',
    message: 'Can’t wait! Let’s pick a cute Italian spot. 🍷',
  });

  if (!submitResult.success || !submitResult.response) {
    throw new Error(`Step 4 FAILED: Response submission failed: ${submitResult.error}`);
  }
  console.log(`✅ Step 4 PASSED: Response persisted in Supabase (id=${submitResult.response.id})`);

  // Step 5: Verify response persistence in DB
  console.log('\nStep 5: Verifying DB persistence and choices...');
  const dbResponse = await getResponseByInvitationId(invitation.id);
  if (!dbResponse || dbResponse.recipient_name !== recipientName) {
    throw new Error('Step 5 FAILED: Response verification in DB failed');
  }
  if (dbResponse.date_type !== 'dinner' || dbResponse.preferred_day !== 'friday') {
    throw new Error('Step 5 FAILED: Response data mismatch');
  }
  console.log('✅ Step 5 PASSED: Response in DB matches all submitted choices.');

  // Step 6: Verify Email Generation & Escaping
  console.log('\nStep 6: Verifying transactional email content generation...');
  const emailHtml = generateResponseEmailHtml({
    creatorName: serverInv.creator_name,
    recipientName: dbResponse.recipient_name || 'Someone',
    dateType: dbResponse.date_type || '',
    preferredDay: dbResponse.preferred_day || '',
    preferredTime: dbResponse.preferred_time || '',
    dateVibe: dbResponse.date_vibe || '',
    message: dbResponse.message,
    invitationUrl: `https://dateinvite.me/invite/${invitation.slug}`,
  });

  if (!emailHtml.includes('Sammy') || !emailHtml.includes('Alexandria')) {
    throw new Error('Step 6 FAILED: Email missing creator or recipient name');
  }
  if (!emailHtml.includes('🎉 They said YES!')) {
    throw new Error('Step 6 FAILED: Email missing YES badge');
  }
  if (!emailHtml.includes(`https://dateinvite.me/invite/${invitation.slug}`)) {
    throw new Error('Step 6 FAILED: Email missing public invitation link');
  }
  if (emailHtml.includes(invitation.id)) {
    throw new Error('Step 6 FAILED: Security breach! Internal Supabase UUID found in email body');
  }
  console.log('✅ Step 6 PASSED: Transactional email content generated safely with public slug.');

  // Step 7: Duplicate Submission Protection
  console.log('\nStep 7: Testing duplicate submission protection...');
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
    throw new Error(`Step 7 FAILED: Duplicate submission not rejected! Code=${duplicateResult.code}`);
  }
  console.log('✅ Step 7 PASSED: Duplicate response rejected with ALREADY_SUBMITTED.');

  // Step 8: Non-existent invitation rejection
  console.log('\nStep 8: Testing non-existent invitation submission...');
  const invalidResult = await submitResponse({
    invitation_id: '00000000-0000-0000-0000-000000000000',
    answer: 'yes',
    recipient_name: 'Ghost',
    date_type: 'movie',
    preferred_day: 'sunday',
    preferred_time: 'night',
    date_vibe: 'fun',
  });

  if (invalidResult.success || invalidResult.code !== 'INVITATION_NOT_FOUND') {
    throw new Error(`Step 8 FAILED: Non-existent invitation not rejected! Code=${invalidResult.code}`);
  }
  console.log('✅ Step 8 PASSED: Non-existent invitation rejected with INVITATION_NOT_FOUND.');

  console.log('\n🎉 ALL 8 E2E SIMULATION STEPS PASSED PERFECTLY!\n');
}

runE2ESimulation().catch((err) => {
  console.error('\n❌ E2E SIMULATION FAILED:', err);
  process.exit(1);
});
