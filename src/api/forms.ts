import { HttpClient } from '../utils/http-client';
import {
  FormCompleteTaskOptions,
  FormEntryPositionResponse,
  FormGetOptions,
  FormGetResponse,
  FormLeaderboardOptions,
  FormLeaderboardResponse,
  FormReferralStatusResponse,
  FormReferralTaskStatus,
  FormRewardListOptions,
  FormRewardListResponse,
  FormStatusLinkResponse,
  FormSubmitOptions,
  FormSubmitResponse,
} from '../interfaces/forms';

export class Forms {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get a published form by its public key.
   *
   * Public endpoint — safe to call from a browser. Only PUBLISHED forms are
   * returned. For a password-protected form the questions (`config`) are only
   * included when the correct password is supplied.
   *
   * @param publicKey The form's public key (the `/f/{publicKey}` segment)
   * @param options Optional password for protected forms
   *
   * @example
   * ```typescript
   * const { form } = await smashsend.forms.get('pk_abc123');
   *
   * form.config?.fields.forEach(field => {
   *   console.log(`${field.key}: ${field.label}`);
   * });
   * ```
   */
  async get(publicKey: string, options?: FormGetOptions): Promise<FormGetResponse> {
    return await this.httpClient.get<FormGetResponse>(`/forms/${publicKey}`, {
      params: options?.password ? { password: options.password } : undefined,
    });
  }

  /**
   * Submit a response to a form.
   *
   * Public endpoint. Submissions are deduplicated per (form, email): sending
   * the same email twice returns the existing entry rather than creating a
   * second one.
   *
   * Pass `countryCode` when you submit from your own backend — SMASHSEND
   * otherwise derives the country from the caller's IP, which server-side is
   * your datacenter and not the respondent.
   *
   * @param publicKey The form's public key
   * @param options The response to record
   *
   * @example
   * ```typescript
   * import { SmashsendCountryCode } from '@smashsend/node';
   *
   * const { entry } = await smashsend.forms.submit('pk_abc123', {
   *   email: 'jane@example.com',
   *   answers: { firstName: 'Jane', company: 'Acme' },
   *   countryCode: SmashsendCountryCode.ES,
   *   referralCode: req.query.ref,
   * });
   *
   * // PENDING means the form uses double opt-in and we emailed a confirm link.
   * if (entry.status === 'PENDING') {
   *   console.log('Ask them to check their inbox');
   * }
   * ```
   */
  async submit(publicKey: string, options: FormSubmitOptions): Promise<FormSubmitResponse> {
    return await this.httpClient.post<FormSubmitResponse>(`/forms/${publicKey}/submit`, options);
  }

  /**
   * Get a participant's own referral progress (position, points, share link,
   * task states).
   *
   * Public endpoint, keyed by the entry's `publicId` — the value returned by
   * {@link submit}. Position and participant totals include the form's display
   * offsets; points and referral counts are always real.
   *
   * @param publicKey The form's public key
   * @param publicId The entry's public id
   *
   * @example
   * ```typescript
   * const { referralStatus } = await smashsend.forms.getReferralStatus(
   *   'pk_abc123',
   *   entry.publicId!
   * );
   *
   * console.log(`#${referralStatus.position} — share ${referralStatus.shareUrl}`);
   * ```
   */
  async getReferralStatus(
    publicKey: string,
    publicId: string
  ): Promise<FormReferralStatusResponse> {
    return await this.httpClient.get<FormReferralStatusResponse>(
      `/forms/${publicKey}/entries/${publicId}/referral-status`
    );
  }

  /**
   * Mark a referral task as completed by a participant.
   *
   * Public endpoint. AUTO tasks award their points immediately; MANUAL tasks
   * land as PENDING with the supplied proof until someone approves them in the
   * dashboard.
   *
   * @param publicKey The form's public key
   * @param publicId The entry's public id
   * @param taskId The task id from the form's referral settings
   * @param options Proof for manual tasks (post URL or handle)
   *
   * @example
   * ```typescript
   * const { task } = await smashsend.forms.completeTask(
   *   'pk_abc123',
   *   entry.publicId!,
   *   'task_follow_x',
   *   { proof: { handle: '@jane' } }
   * );
   *
   * console.log(`${task.status} (+${task.pointsAwarded} points)`);
   * ```
   */
  async completeTask(
    publicKey: string,
    publicId: string,
    taskId: string,
    options?: FormCompleteTaskOptions
  ): Promise<{ task: FormReferralTaskStatus & { pointsAwarded: number } }> {
    return await this.httpClient.post<{
      task: FormReferralTaskStatus & { pointsAwarded: number };
    }>(`/forms/${publicKey}/entries/${publicId}/tasks/${taskId}/complete`, options ?? {});
  }

  /**
   * Email a participant their personal referral link.
   *
   * Public endpoint — the "already signed up?" flow. Always resolves the same
   * way whether or not the email is on the list, so it can't be used to probe
   * membership.
   *
   * @param publicKey The form's public key
   * @param email The participant's email
   *
   * @example
   * ```typescript
   * await smashsend.forms.sendStatusLink('pk_abc123', 'jane@example.com');
   * ```
   */
  async sendStatusLink(publicKey: string, email: string): Promise<FormStatusLinkResponse> {
    return await this.httpClient.post<FormStatusLinkResponse>(`/forms/${publicKey}/status-link`, {
      email,
    });
  }

  /**
   * Get a form's leaderboard.
   *
   * Dual-mode: called with the form's **public key** it returns the masked
   * public leaderboard (as the hosted page shows it). Called with the form's
   * **id** and a workspace API key it returns real emails and true ranks.
   *
   * @param formIdOrPublicKey The form id (API key) or public key (guest)
   * @param options `limit` applies to the customer-API branch only
   *
   * @example
   * ```typescript
   * const { leaderboard } = await smashsend.forms.getLeaderboard('frm_abc123', {
   *   limit: 25,
   * });
   *
   * leaderboard.items.forEach(row => {
   *   console.log(`#${row.rank} ${row.email ?? row.maskedEmail}: ${row.points}`);
   * });
   * ```
   */
  async getLeaderboard(
    formIdOrPublicKey: string,
    options?: FormLeaderboardOptions
  ): Promise<FormLeaderboardResponse> {
    return await this.httpClient.get<FormLeaderboardResponse>(
      `/forms/${formIdOrPublicKey}/leaderboard`,
      { params: options }
    );
  }

  /**
   * Get one entry's leaderboard position, looked up by entry id **or** email.
   *
   * Customer API — requires a workspace API key.
   *
   * @param formId The form id
   * @param entryIdOrEmail The entry id or the participant's email
   *
   * @example
   * ```typescript
   * const { position } = await smashsend.forms.getEntryPosition(
   *   'frm_abc123',
   *   'jane@example.com'
   * );
   *
   * console.log(`#${position.position} of ${position.participantCount}`);
   * ```
   */
  async getEntryPosition(
    formId: string,
    entryIdOrEmail: string
  ): Promise<FormEntryPositionResponse> {
    return await this.httpClient.get<FormEntryPositionResponse>(
      `/forms/${formId}/entries/${encodeURIComponent(entryIdOrEmail)}/position`
    );
  }

  /**
   * List the points ledger for one entry — every referral credit, task
   * completion and manual adjustment, with its review status.
   *
   * Customer API — requires a workspace API key.
   *
   * @param formId The form id
   * @param entryId The entry id
   * @param params Pagination parameters
   *
   * @example
   * ```typescript
   * const { rewards } = await smashsend.forms.listEntryRewards('frm_abc', 'fen_123');
   *
   * rewards.items.forEach(reward => {
   *   console.log(`${reward.type} +${reward.points} (${reward.status})`);
   * });
   *
   * if (rewards.hasMore) {
   *   const next = await smashsend.forms.listEntryRewards('frm_abc', 'fen_123', {
   *     cursor: rewards.cursor!,
   *   });
   * }
   * ```
   */
  async listEntryRewards(
    formId: string,
    entryId: string,
    params?: FormRewardListOptions
  ): Promise<FormRewardListResponse> {
    return await this.httpClient.get<FormRewardListResponse>(
      `/forms/${formId}/entries/${entryId}/rewards`,
      { params }
    );
  }
}
