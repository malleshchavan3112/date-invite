/**
 * DateInvite — Core Types
 * D008: Next.js 14 + TypeScript (strict)
 * D012–D018: Two-Sided Invitation Model (Creator & Recipient)
 */

// ─── Invitation ────────────────────────────────────────────────────────────

export interface Invitation {
  id: string;
  slug: string;
  creator_name: string;
  creator_email: string;
  title: string;
  intro_text: string;
  active: boolean;
  created_at: string;
}

/**
 * Public invitation representation provided to the recipient client.
 * D016: creator_email is strictly stripped to preserve privacy.
 */
export type PublicInvitation = Omit<Invitation, 'creator_email'>;

export interface CreateInvitationInput {
  creator_name: string;
  creator_email: string;
  title?: string;
  intro_text?: string;
}

// ─── Questionnaire ────────────────────────────────────────────────────────

export type DateType =
  | 'coffee'
  | 'dinner'
  | 'picnic'
  | 'adventure'
  | 'movie'
  | 'surprise';

export type PreferredDay =
  | 'weekday'
  | 'friday'
  | 'saturday'
  | 'sunday'
  | 'any';

export type PreferredTime =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night';

export type DateVibe =
  | 'cozy'
  | 'romantic'
  | 'fun'
  | 'fancy'
  | 'chill'
  | 'spontaneous';

export interface QuestionnaireData {
  name: string;
  dateType: DateType | null;
  preferredDay: PreferredDay | null;
  preferredTime: PreferredTime | null;
  dateVibe: DateVibe | null;
  message: string;
}

export const EMPTY_QUESTIONNAIRE: QuestionnaireData = {
  name: '',
  dateType: null,
  preferredDay: null,
  preferredTime: null,
  dateVibe: null,
  message: '',
};

/**
 * Phase 3: Flattened questionnaire answers format
 */
export interface QuestionnaireAnswers {
  recipient_name: string;
  date_type: string;
  preferred_day: string;
  preferred_time: string;
  date_vibe: string;
  message: string;
}

export const INITIAL_QUESTIONNAIRE_ANSWERS: QuestionnaireAnswers = {
  recipient_name: '',
  date_type: '',
  preferred_day: '',
  preferred_time: '',
  date_vibe: '',
  message: '',
};

// ─── Response ─────────────────────────────────────────────────────────────

export type AnswerType = 'yes' | 'no';

export interface Response {
  id: string;
  invitation_id: string;
  answer: AnswerType;
  recipient_name: string | null;
  date_type: DateType | null;
  preferred_day: PreferredDay | null;
  preferred_time: PreferredTime | null;
  date_vibe: DateVibe | null;
  message: string | null;
  created_at: string;
  submitted_at: string;
}

export type SubmissionErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVITATION_NOT_FOUND'
  | 'INVITATION_INACTIVE'
  | 'ALREADY_SUBMITTED'
  | 'UNKNOWN_ERROR';

export interface SubmitResponseInput {
  invitation_id: string;
  answer: 'yes';
  recipient_name: string;
  date_type: string;
  preferred_day: string;
  preferred_time: string;
  date_vibe: string;
  message?: string;
  forceError?: boolean;
}

export interface SubmitResponseResult {
  success: boolean;
  response?: Response;
  code?: SubmissionErrorCode;
  error?: string;
}

// ─── App State ───────────────────────────────────────────────────────────

/**
 * Represents the current step in the invitation flow.
 * Aligned with screen IDs P01–P16 (D007).
 */
export type InvitationStep =
  | 'loading'       // P01
  | 'landing'       // P02
  | 'question'      // P03
  | 'playful-no'    // P04
  | 'no-completion' // P05
  | 'name'          // P06
  | 'date-type'     // P07
  | 'preferred-day' // P08
  | 'preferred-time'// P09
  | 'date-vibe'     // P10
  | 'message'       // P11
  | 'review'        // P12
  | 'submitting'    // P13
  | 'success'       // P14
  | 'invalid'       // P15
  | 'error';        // P16

export interface InvitationState {
  step: InvitationStep;
  invitation: Invitation | null;
  questionnaire: QuestionnaireData;
  submittedResponseId: string | null;
}

