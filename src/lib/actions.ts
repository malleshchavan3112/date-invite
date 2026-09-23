'use server';

import { createInvitation } from './invitation-repository';
import { submitResponse } from './response-repository';
import type {
  CreateInvitationInput,
  SubmitResponseInput,
  SubmitResponseResult,
} from '@/types';

export interface CreateInvitationActionResult {
  success: boolean;
  slug?: string;
  creator_name?: string;
  error?: string;
}

/**
 * Server Action: Creates a new invitation and registers it in the repository.
 * Strictly returns only public non-sensitive data (slug, creator_name).
 * Creator email is never returned in client action results.
 */
export async function createInvitationAction(
  input: CreateInvitationInput
): Promise<CreateInvitationActionResult> {
  const trimmedName = input.creator_name?.trim();
  const trimmedEmail = input.creator_email?.trim();

  if (!trimmedName || trimmedName.length < 1) {
    return { success: false, error: 'Please enter your name.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    const invitation = await createInvitation({
      creator_name: trimmedName,
      creator_email: trimmedEmail,
      title: input.title,
      intro_text: input.intro_text,
    });

    return {
      success: true,
      slug: invitation.slug,
      creator_name: invitation.creator_name,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create invitation.';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Submits a recipient questionnaire response.
 * Delegates to the isolated response repository and handles duplicate checks & errors gracefully.
 */
export async function submitResponseAction(
  input: SubmitResponseInput
): Promise<SubmitResponseResult> {
  try {
    return await submitResponse(input);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit response.';
    return {
      success: false,
      code: 'UNKNOWN_ERROR',
      error: message,
    };
  }
}

