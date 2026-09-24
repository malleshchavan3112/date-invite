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

// ─── Phase 8: New preference types ─────────────────────────────────────────

export type ActivityPreference =
  | 'outdoor'
  | 'indoor'
  | 'active'
  | 'relaxed'
  | 'cultural'
  | 'surprise_me';

export type LocationPreference =
  | 'city_center'
  | 'neighborhood'
  | 'nature'
  | 'waterfront'
  | 'anywhere';

export type FoodPreference =
  | 'no_preference'
  | 'vegetarian'
  | 'vegan'
  | 'seafood'
  | 'street_food'
  | 'fine_dining'
  | 'no_food';

export type SpontaneityLevel =
  | 'full_plan'
  | 'loose_plan'
  | 'go_with_flow'
  | 'surprise_me';

export interface QuestionnaireData {
  name: string;
  dateType: DateType | null;
  preferredDay: PreferredDay | null;
  preferredTime: PreferredTime | null;
  dateVibe: DateVibe | null;
  message: string;
  // Phase 8
  activityPreference: ActivityPreference | null;
  locationPreference: LocationPreference | null;
  foodPreference: FoodPreference | null;
  spontaneity: SpontaneityLevel | null;
}

export const EMPTY_QUESTIONNAIRE: QuestionnaireData = {
  name: '',
  dateType: null,
  preferredDay: null,
  preferredTime: null,
  dateVibe: null,
  message: '',
  // Phase 8
  activityPreference: null,
  locationPreference: null,
  foodPreference: null,
  spontaneity: null,
};

/**
 * Phase 3+8: Flattened questionnaire answers format (client → server)
 */
export interface QuestionnaireAnswers {
  recipient_name: string;
  date_type: string;
  preferred_day: string;
  preferred_time: string;
  date_vibe: string;
  message: string;
  // Phase 8
  activity_preference: string;
  location_preference: string;
  food_preference: string;
  spontaneity: string;
}

export const INITIAL_QUESTIONNAIRE_ANSWERS: QuestionnaireAnswers = {
  recipient_name: '',
  date_type: '',
  preferred_day: '',
  preferred_time: '',
  date_vibe: '',
  message: '',
  // Phase 8
  activity_preference: '',
  location_preference: '',
  food_preference: '',
  spontaneity: '',
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
  // Phase 8
  activity_preference: ActivityPreference | null;
  location_preference: LocationPreference | null;
  food_preference: FoodPreference | null;
  spontaneity: SpontaneityLevel | null;
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
  // Phase 8
  activity_preference?: string;
  location_preference?: string;
  food_preference?: string;
  spontaneity?: string;
  forceError?: boolean;
}

export interface SubmitResponseResult {
  success: boolean;
  response?: Response;
  emailSent?: boolean;
  code?: SubmissionErrorCode;
  error?: string;
}

// ─── Email Notification ───────────────────────────────────────────────────

export interface SendInvitationResponsePayload {
  creatorEmail: string;
  creatorName: string;
  invitationSlug: string;
  responseId: string;
  recipientName: string;
  answer: 'yes' | 'no';
  dateType: DateType | null;
  preferredDay: PreferredDay | null;
  preferredTime: PreferredTime | null;
  dateVibe: DateVibe | null;
  message?: string | null;
  // Phase 8
  activityPreference?: ActivityPreference | null;
  locationPreference?: LocationPreference | null;
  foodPreference?: FoodPreference | null;
  spontaneity?: SpontaneityLevel | null;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ResponseEmailData {
  creatorName: string;
  recipientName: string;
  dateType: string;
  preferredDay: string;
  preferredTime: string;
  dateVibe: string;
  message?: string | null;
  invitationUrl: string;
  // Phase 8
  activityPreference?: string | null;
  locationPreference?: string | null;
  foodPreference?: string | null;
  spontaneity?: string | null;
}

// ─── App State ───────────────────────────────────────────────────────────

/**
 * Represents the current step in the invitation flow.
 * Aligned with screen IDs P01–P16 (D007).
 */
export type InvitationStep =
  | 'loading'           // P01
  | 'landing'           // P02
  | 'question'          // P03
  | 'playful-no'        // P04
  | 'no-completion'     // P05
  | 'name'              // P06
  | 'date-type'         // P07
  | 'activity'          // P08 NEW
  | 'location'          // P09 NEW
  | 'preferred-day'     // P10
  | 'preferred-time'    // P11
  | 'food'              // P12 NEW
  | 'spontaneity'       // P13 NEW
  | 'date-vibe'         // P14 (kept)
  | 'message'           // P15
  | 'review'            // P16
  | 'submitting'        // P17
  | 'success'           // P18
  | 'invalid'           // P19
  | 'error';            // P20

export interface InvitationState {
  step: InvitationStep;
  invitation: Invitation | null;
  questionnaire: QuestionnaireData;
  submittedResponseId: string | null;
}

