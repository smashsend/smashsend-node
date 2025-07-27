import { HttpClient } from '../utils/http-client';

export type EmailIdentityStatus = "VERIFIED" | "PENDING" | "FAILED";

export interface EmailIdentity {
  email: string;
  status: EmailIdentityStatus;
}

export interface DomainIdentity {
  domain: string;
  status: EmailIdentityStatus;
}

export interface VerifiedEmailIdentities {
  emails: EmailIdentity[];
  domains: DomainIdentity[];
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
   * Each email and domain includes status information (VERIFIED, PENDING, FAILED).
   * Currently only VERIFIED identities are returned, but this structure supports
   * future expansion to include pending or failed identities.
   *
   * @returns Object containing arrays of email and domain identities with status
   *
   * @example
   * ```ts
   * const identities = await smashsend.domains.getVerifiedIdentities();
   * console.log(identities.emails); // [{ email: 'workspace@mail.smashemail.com', status: 'VERIFIED' }]
   * console.log(identities.domains); // [{ domain: 'mail.smashemail.com', status: 'VERIFIED' }]
   * ```
   */
  async getVerifiedIdentities(): Promise<VerifiedEmailIdentities> {
    const response = await this.httpClient.get<{ identities: VerifiedEmailIdentities }>(
      '/identities'
    );
    return response.identities;
  }
}
