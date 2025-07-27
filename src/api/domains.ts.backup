import { HttpClient } from '../utils/http-client';

export interface VerifiedEmailIdentities {
  emails: string[];
  domains: string[];
}

export class Domains {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get all verified email identities for the current workspace.
   * This includes:
   * - Default workspace email (e.g., workspace-slug@mail.smashemail.com)
   * - Verified custom domains (as domain wildcards)
   * - Specific email aliases from verified domains
   *
   * @returns Object containing arrays of verified emails and domains
   *
   * @example
   * ```ts
   * const identities = await smashsend.domains.getVerifiedIdentities();
   * console.log(identities.emails); // ['workspace@mail.smashemail.com', 'support@mydomain.com']
   * console.log(identities.domains); // ['mail.smashemail.com', 'mydomain.com']
   * ```
   */
  async getVerifiedIdentities(): Promise<VerifiedEmailIdentities> {
    const response = await this.httpClient.get<{ identities: VerifiedEmailIdentities }>(
      '/identities'
    );
    return response.identities;
  }
}
