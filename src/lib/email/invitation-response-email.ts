/**
 * DateInvite — Transactional Response Email Template
 * 
 * Generates responsive, email-client-compatible HTML and clean plain-text
 * for notifying the creator of a YES response.
 * 
 * Design Standards:
 * - Brand romantic palette: Terracotta (#E07A5F), warm canvas (#FFFDF9), charcoal (#2D3142), rose highlight (#FDF0ED)
 * - Safe HTML escaping on all dynamic user input (XSS defense)
 * - Modern typography with standard system fonts compatible with all email clients
 * - Clean mobile-responsive layout using table-based architecture for bulletproof rendering
 * - Prominent invitation CTA and clear footer
 */

import type { ResponseEmailData } from '@/types';

export const DATE_TYPE_LABELS: Record<string, string> = {
  coffee: '☕ Coffee',
  dinner: '🍽️ Dinner',
  picnic: '🧺 Picnic',
  movie: '🎬 Movie',
  adventure: '🌆 Adventure',
  surprise: '✨ Surprise',
};

export const DAY_LABELS: Record<string, string> = {
  weekday: '🗓️ Weekday',
  friday: '🥂 Friday',
  saturday: '🌅 Saturday',
  sunday: '☕ Sunday',
  any: '💫 Any day',
};

export const TIME_LABELS: Record<string, string> = {
  morning: '☀️ Morning',
  afternoon: '🌤️ Afternoon',
  evening: '🌆 Evening',
  night: '🌙 Night',
};

export const VIBE_LABELS: Record<string, string> = {
  cozy: '🧸 Cozy',
  romantic: '🌹 Romantic',
  fun: '🎈 Fun',
  fancy: '🍸 Fancy',
  chill: '🌿 Chill',
  spontaneous: '🎲 Spontaneous',
};

/**
 * Escapes unsafe HTML characters to prevent XSS in email clients.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Subject line for YES notification.
 */
export const RESPONSE_EMAIL_SUBJECT = '💌 You got a DateInvite response!';

/**
 * Generates email-client-compatible responsive HTML.
 */
export function generateResponseEmailHtml(data: ResponseEmailData): string {
  const safeCreatorName = escapeHtml(data.creatorName || 'there');
  const safeRecipientName = escapeHtml(data.recipientName || 'Someone');
  const safeDateType = escapeHtml(DATE_TYPE_LABELS[data.dateType] || data.dateType || 'Not specified');
  const safeDay = escapeHtml(DAY_LABELS[data.preferredDay] || data.preferredDay || 'Not specified');
  const safeTime = escapeHtml(TIME_LABELS[data.preferredTime] || data.preferredTime || 'Not specified');
  const safeVibe = escapeHtml(VIBE_LABELS[data.dateVibe] || data.dateVibe || 'Not specified');
  const safeUrl = escapeHtml(data.invitationUrl);

  const hasMessage = Boolean(data.message && data.message.trim().length > 0);
  const safeMessage = hasMessage ? escapeHtml(data.message!.trim()) : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${RESPONSE_EMAIL_SUBJECT}</title>
  <style>
    /* Reset & responsive rules */
    body {
      margin: 0;
      padding: 0;
      background-color: #FFFDF9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #2D3142;
    }
    table {
      border-collapse: separate;
    }
    @media only screen and (max-width: 600px) {
      .main-container {
        width: 100% !important;
        padding: 16px 12px !important;
      }
      .card-content {
        padding: 24px 20px !important;
      }
      .detail-label {
        width: 100px !important;
      }
    }
  </style>
</head>
<body style="background-color: #FFFDF9; margin: 0; padding: 0;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFDF9;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" class="main-container" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width: 560px; width: 100%; margin: 0 auto;">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <span style="font-size: 26px; font-weight: 700; color: #E07A5F; letter-spacing: -0.5px;">DateInvite 💌</span>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #F4E8E1; box-shadow: 0 4px 18px rgba(224, 122, 95, 0.08); overflow: hidden;">
                <tr>
                  <td class="card-content" style="padding: 36px 32px;">

                    <!-- Greeting & Announcement -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 8px;">
                          <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #2D3142; line-height: 1.3;">
                            Good news, ${safeCreatorName}!
                          </h1>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom: 20px;">
                          <p style="margin: 0; font-size: 15px; color: #6C757D; line-height: 1.4;">
                            Someone responded to your DateInvite.
                          </p>
                        </td>
                      </tr>

                      <!-- YES Celebration Badge -->
                      <tr>
                        <td align="center" style="padding-bottom: 28px;">
                          <div style="display: inline-block; background-color: #FDF0ED; border: 1.5px solid #F9D8D0; border-radius: 9999px; padding: 10px 24px; text-align: center;">
                            <span style="font-size: 18px; font-weight: 700; color: #E07A5F;">
                              🎉 They said YES!
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Response Breakdown Table -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5; border-radius: 14px; border: 1px solid #F0ECE6; margin-bottom: 28px;">
                      <tr>
                        <td style="padding: 20px 24px;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <!-- Recipient -->
                            <tr>
                              <td class="detail-label" style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #8D99AE; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">
                                Recipient
                              </td>
                              <td style="padding: 8px 0; font-size: 15px; font-weight: 600; color: #2D3142;">
                                ${safeRecipientName}
                              </td>
                            </tr>

                            <!-- Date Type -->
                            <tr>
                              <td class="detail-label" style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #8D99AE; text-transform: uppercase; letter-spacing: 0.5px; border-top: 1px solid #EFEAE3;">
                                Date Type
                              </td>
                              <td style="padding: 8px 0; font-size: 15px; font-weight: 500; color: #2D3142; border-top: 1px solid #EFEAE3;">
                                ${safeDateType}
                              </td>
                            </tr>

                            <!-- Preferred Day -->
                            <tr>
                              <td class="detail-label" style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #8D99AE; text-transform: uppercase; letter-spacing: 0.5px; border-top: 1px solid #EFEAE3;">
                                Preferred Day
                              </td>
                              <td style="padding: 8px 0; font-size: 15px; font-weight: 500; color: #2D3142; border-top: 1px solid #EFEAE3;">
                                ${safeDay}
                              </td>
                            </tr>

                            <!-- Preferred Time -->
                            <tr>
                              <td class="detail-label" style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #8D99AE; text-transform: uppercase; letter-spacing: 0.5px; border-top: 1px solid #EFEAE3;">
                                Preferred Time
                              </td>
                              <td style="padding: 8px 0; font-size: 15px; font-weight: 500; color: #2D3142; border-top: 1px solid #EFEAE3;">
                                ${safeTime}
                              </td>
                            </tr>

                            <!-- Vibe -->
                            <tr>
                              <td class="detail-label" style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #8D99AE; text-transform: uppercase; letter-spacing: 0.5px; border-top: 1px solid #EFEAE3;">
                                Vibe
                              </td>
                              <td style="padding: 8px 0; font-size: 15px; font-weight: 500; color: #2D3142; border-top: 1px solid #EFEAE3;">
                                ${safeVibe}
                              </td>
                            </tr>

                            <!-- Message (if provided) -->
                            ${hasMessage ? `
                            <tr>
                              <td class="detail-label" style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #8D99AE; text-transform: uppercase; letter-spacing: 0.5px; border-top: 1px solid #EFEAE3; vertical-align: top;">
                                Message
                              </td>
                              <td style="padding: 8px 0; font-size: 14px; font-style: italic; color: #4A4E69; border-top: 1px solid #EFEAE3; line-height: 1.5;">
                                &ldquo;${safeMessage}&rdquo;
                              </td>
                            </tr>
                            ` : ''}
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 12px;">
                          <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #E07A5F; color: #FFFFFF; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(224, 122, 95, 0.25);">
                            View Invitation
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 28px; padding-bottom: 24px;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #8D99AE;">
                Sent by DateInvite
              </p>
              <p style="margin: 0; font-size: 12px; color: #ADB5BD;">
                A playful invitation experience.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates clean plain-text fallback representation for email clients without HTML support.
 */
export function generateResponseEmailText(data: ResponseEmailData): string {
  const creatorName = data.creatorName || 'there';
  const recipientName = data.recipientName || 'Someone';
  const dateType = DATE_TYPE_LABELS[data.dateType] || data.dateType || 'Not specified';
  const preferredDay = DAY_LABELS[data.preferredDay] || data.preferredDay || 'Not specified';
  const preferredTime = TIME_LABELS[data.preferredTime] || data.preferredTime || 'Not specified';
  const dateVibe = VIBE_LABELS[data.dateVibe] || data.dateVibe || 'Not specified';
  const message = data.message?.trim() || '';

  const lines = [
    'DateInvite 💌',
    '',
    `Good news, ${creatorName}!`,
    '',
    'Someone responded to your DateInvite.',
    '',
    '🎉 They said YES!',
    '',
    `Recipient: ${recipientName}`,
    `Date type: ${dateType}`,
    `Preferred day: ${preferredDay}`,
    `Preferred time: ${preferredTime}`,
    `Vibe: ${dateVibe}`,
  ];

  if (message) {
    lines.push(`Message: "${message}"`);
  }

  lines.push('');
  lines.push(`View Invitation: ${data.invitationUrl}`);
  lines.push('');
  lines.push('---');
  lines.push('Sent by DateInvite');
  lines.push('A playful invitation experience.');

  return lines.join('\n');
}
