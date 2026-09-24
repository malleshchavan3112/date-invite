/**
 * DateInvite — Resend Client Provider (Server-Side Only)
 * 
 * Guarantees:
 * - Server-only execution. RESEND_API_KEY is NEVER exposed to client bundles.
 * - Singleton Resend instance initialized lazily.
 * - Safe fallback / graceful degradation when RESEND_API_KEY is not configured.
 */

import { Resend } from 'resend';

let resendInstance: Resend | null = null;

/**
 * Returns a configured Resend client instance.
 * Returns null if RESEND_API_KEY is not set or running on the client.
 */
export function getResendClient(): Resend | null {
  if (typeof window !== 'undefined') {
    console.error('[DateInvite] Attempted to access Resend client on the browser client! Bypassing for security.');
    return null;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    return null;
  }

  if (!resendInstance) {
    resendInstance = new Resend(apiKey.trim());
  }

  return resendInstance;
}

/**
 * Resolves the configured sender email address.
 * Defaults to DateInvite with onboarding@resend.dev for development,
 * or the custom verified sender set in RESEND_FROM_EMAIL.
 */
export function getSenderEmail(): string {
  const configuredSender = process.env.RESEND_FROM_EMAIL?.trim();
  if (configuredSender && configuredSender.length > 0) {
    return configuredSender;
  }

  // Resend default verified sender for testing
  return 'DateInvite <onboarding@resend.dev>';
}

/**
 * Resolves the public application base URL for links in emails.
 */
export function getAppBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configuredUrl && configuredUrl.length > 0) {
    return configuredUrl.replace(/\/+$/, '');
  }

  return 'https://dateinvite.me';
}
