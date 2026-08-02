import { SmashsendCountryCode } from './types';

/**
 * The Forms API covers SMASHSEND's hosted/headless forms and the referral
 * ("viral waitlist") system built on top of them.
 *
 * Two kinds of endpoint live here:
 *
 * - **Public** (`publicKey`): reading a published form, submitting a response,
 *   confirming double opt-in, and the participant's own referral status. These
 *   need no API key — they are the endpoints a browser or your server calls on
 *   behalf of the person filling the form.
 * - **Customer API** (`formId`, API key): entry position, the rewards ledger
 *   and the unmasked leaderboard. These require a workspace API key.
 */

export type FormStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type FormFieldType =
  | 'email'
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'url'
  | 'phone';

export interface FormFieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FormField {
  key: string;
  type: FormFieldType;
  label: string;
  placeholder?: string | null;
  required?: boolean;
  options?: FormFieldOption[];
}

export type FormReferralTaskType = 'VISIT_LINK' | 'TWITTER_FOLLOW' | 'JOIN_NEWSLETTER';

export type FormReferralTaskApproval = 'AUTO' | 'MANUAL';

export type FormReferralTaskProofType = 'NONE' | 'POST_URL' | 'HANDLE';

/** A bonus action a participant can complete for extra points. */
export interface FormReferralTask {
  id: string;
  type: FormReferralTaskType;
  label: string;
  url?: string | null;
  points: number;
  approval: FormReferralTaskApproval;
  proofType: FormReferralTaskProofType;
}

/** Referral settings as exposed publicly (display offsets are never included). */
export interface FormPublicReferralSettings {
  isEnabled: boolean;
  pointsPerReferral: number;
  shareText: string;
  showLeaderboard: boolean;
  leaderboardSize: number;
  tasks: FormReferralTask[];
}

export interface FormConfig {
  version: number;
  fields: FormField[];
  [key: string]: any;
}

/** A published form as returned by the public endpoint. */
export interface SmashsendForm {
  id: string;
  displayName: string | null;
  publicKey: string;
  status: FormStatus;
  config: FormConfig | null;
  /** True when the form needs a password before its questions are returned. */
  passwordProtected?: boolean;
  /** Present only when referrals are enabled on the form. */
  referral?: FormPublicReferralSettings;
}

export interface FormGetOptions {
  /** Password for a password-protected form. Without it, `config` is withheld. */
  password?: string;
}

export interface FormGetResponse {
  form: SmashsendForm;
}

export type FormEntryStatus = 'PENDING' | 'CONFIRMED' | 'UNSUBSCRIBED' | 'BANNED';

export interface FormSubmitOptions {
  /** The respondent's email. The only required field. */
  email: string;
  /** Answers keyed by the form field's `key`. */
  answers?: Record<string, any>;
  /**
   * ISO 3166-1 alpha-2 country for the respondent.
   *
   * SMASHSEND otherwise derives the country from the caller's IP at submit
   * time. When you submit from your own backend that IP is your server, so
   * every respondent would be filed under your datacenter's country — pass
   * this explicitly for server-side submissions.
   */
  countryCode?: SmashsendCountryCode;
  /** Password for a password-protected form. */
  password?: string;
  /** Captcha token, when the form has captcha enabled. */
  captchaToken?: string;
  /** The `?ref=` code from a sharer's invite link, to credit the referral. */
  referralCode?: string;
}

export interface FormSubmitResponse {
  success: boolean;
  entry: {
    id: string;
    /** Opaque id used on participant-facing referral endpoints. */
    publicId: string | null;
    /**
     * `PENDING` when the form uses double opt-in (the participant still has to
     * click the emailed link), `CONFIRMED` otherwise.
     */
    status: FormEntryStatus;
  };
}

export type FormTaskStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';

export interface FormReferralTaskStatus {
  taskId: string;
  status: FormTaskStatus;
}

/**
 * A participant's own referral progress. `position`, `peopleAhead` and
 * `participantTotal` already have the form's display offsets applied; `points`
 * and `referralCount` are always real.
 */
export interface FormReferralStatus {
  entryId: string;
  status: FormEntryStatus;
  referralCode: string;
  shareUrl: string;
  points: number;
  referralCount: number;
  position: number | null;
  peopleAhead: number | null;
  participantTotal: number;
  tasks: FormReferralTaskStatus[];
}

export interface FormReferralStatusResponse {
  referralStatus: FormReferralStatus;
}

export interface FormCompleteTaskOptions {
  /** Proof for a manual task: the post URL or the handle, per `proofType`. */
  proof?: {
    url?: string;
    handle?: string;
  };
}

export interface FormStatusLinkResponse {
  success: boolean;
}

/**
 * Entry position from the customer API. `position` and `participantCount`
 * include the form's display offsets; `points` and `referralCount` are real.
 */
export interface FormEntryPosition {
  position: number | null;
  points: number;
  referralCount: number;
  participantCount: number;
}

export interface FormEntryPositionResponse {
  position: FormEntryPosition;
}

export type FormRewardType = 'REFERRAL' | 'TASK' | 'ADJUSTMENT';

export type FormRewardStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';

/** One row of the append-only points ledger. */
export interface FormReward {
  id: string;
  workspaceId: string;
  formId: string;
  entryId: string;
  entryEmail: string | null;
  type: FormRewardType;
  /** Set for TASK rows: the id of the task inside the form's referral settings. */
  taskId: string | null;
  points: number;
  status: FormRewardStatus;
  proof: { url?: string; handle?: string } | null;
  /** Idempotency key: `ref:{referredEntryId}` or `task:{taskId}`. */
  dedupKey: string;
  metadata: Record<string, any> | null;
  reviewedAt: string | null;
  reviewedByUid: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface FormRewardListOptions {
  limit?: number;
  cursor?: string;
}

export interface FormRewardListResponse {
  rewards: {
    cursor: string | null;
    hasMore: boolean;
    items: FormReward[];
  };
}

export interface FormLeaderboardEntry {
  rank: number;
  /** Present on the guest (public key) branch, e.g. `jo•••@example.com`. */
  maskedEmail?: string;
  /** Present on the customer-API (form id + API key) branch. */
  email?: string;
  firstName?: string | null;
  points: number;
  referralCount: number;
}

export interface FormLeaderboardOptions {
  /** Customer API only; the public branch uses the form's `leaderboardSize`. */
  limit?: number;
}

export interface FormLeaderboardResponse {
  leaderboard: {
    items: FormLeaderboardEntry[];
    [key: string]: any;
  };
}
