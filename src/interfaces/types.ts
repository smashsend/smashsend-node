import type { ReactElement } from 'react';
// Common interfaces
export interface SmashSendClientOptions {
  baseUrl?: string;
  maxRetries?: number;
  timeout?: number;
  fetch?: any;
  apiVersion?: string;
}

export interface SmashSendError {
  code: string;
  message: string;
  requestId?: string;
  statusCode?: number;
  data?: any;
}

// Email interfaces
export interface EmailAddress {
  email: string;
  name?: string;
}

// Transactional emails ────────────────────────────────────────────

/**
 * Send a raw email (without a pre-defined template).
 *
 * You must provide either `html` or `react`:
 * - `html`: Pre-rendered HTML content
 * - `react`: A React element that will be rendered to HTML
 */
export type RawEmailSendOptions = RawEmailSendOptionsBase &
  (
    | { html: string; react?: undefined }
    | { react: ReactElement | string; html?: undefined }
    | { html: string; react: ReactElement | string }
  );

/**
 * Base options for raw email sending (shared fields).
 */
interface RawEmailSendOptionsBase {
  /** Sender address – can be `john@acme.com` or `John Doe <john@acme.com>` */
  from: string;
  /** Optional sender name. If provided, it will be combined with `from` on the backend. */
  fromName?: string;
  /** Recipient address. Only a single email address is allowed. */
  to: string;
  /** Email subject line. */
  subject: string;
  /** Optional preview / pre-header text shown by email clients. */
  previewText?: string;
  /** Optional reply-to address. */
  replyTo?: string;
  /** Optional plain-text body. If omitted Smashsend will auto-generate from HTML. */
  text?: string;
  /** Optional map of contact properties to upsert before sending. */
  contactProperties?: Record<string, any>;
  /** Tracking configuration. */
  settings?: {
    trackClicks?: boolean;
    trackOpens?: boolean;
  };
  /** Group analytics for these emails by a custom identifier. */
  groupBy?: string;
  /** Date when the email should be sent (ISO 8601 string or Date instance). */
  sendAt?: string | Date;
  /** Idempotency key to de-duplicate requests. */
  idempotencyKey?: string;
}

/**
 * Options for sending a stored *Transactional Template*.
 * This maps 1-to-1 with the backend "Templated Email" schema.
 */
export interface TemplatedEmailSendOptions {
  /** Template identifier configured in the Smashsend UI. */
  template: string;
  /** Recipient address. Only a single email address is allowed. */
  to: string;
  /** Key-value pairs used to render the template. */
  variables?: Record<string, any>;
  /** Tracking configuration. */
  settings?: {
    trackClicks?: boolean;
    trackOpens?: boolean;
  };
  /** Date when the email should be sent (ISO 8601 string or Date instance). */
  sendAt?: string | Date;
  /** Idempotency key to de-duplicate requests. */
  idempotencyKey?: string;
}

export type TransactionalEmailSendOptions = RawEmailSendOptions | TemplatedEmailSendOptions;

// ─────────────────────────────────────────────────────────────────

// EmailAttachment is currently unused – keeping for forward-compatibility
export interface EmailAttachment {
  filename: string;
  content: string | Uint8Array;
  contentType?: string;
}

// Backend delivery status values
export enum TransactionalEmailStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}

export interface RawEmailSendResponse {
  /** Unique message identifier. */
  messageId: string;
  /** Delivery status. */
  status: TransactionalEmailStatus;
  /** Recipient address. */
  to: string;
  /** Sender address. */
  from: string;
  /** Subject line. */
  subject: string;
  /** Discriminator – always `raw`. */
  type: 'raw';
  /** Warning returned by backend when the email is accepted with caveats. */
  warning?: string;
  /** Custom analytics group identifier if provided. */
  groupBy?: string;
}

export interface TemplatedEmailSendResponse {
  /** Unique message identifier. */
  messageId: string;
  /** Delivery status. */
  status: TransactionalEmailStatus;
  /** Recipient address. */
  to: string;
  /** Template identifier sent in the request. */
  template: string;
  /** Discriminator – always `templated`. */
  type: 'templated';
  /** Warning returned by backend when the email is accepted with caveats. */
  warning?: string;
}

export type TransactionalEmailSendResponse = RawEmailSendResponse | TemplatedEmailSendResponse;

/**
 * @deprecated Use `RawEmailSendOptions` or `TemplatedEmailSendOptions` instead.
 */
export type EmailSendOptions = TransactionalEmailSendOptions;

/**
 * @deprecated Use `TransactionalEmailSendResponse` instead.
 */
export type EmailSendResponse = TransactionalEmailSendResponse;

// API Key enums
export enum SmashsendApiKeyRole {
  EDITOR = 'EDITOR', // can view and edit any information in your workspace
  VIEWER = 'VIEWER', // can only view information in your workspace but cant do any CHANGES
}

export enum SmashsendApiKeyStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

// Country code enum (ISO 3166-1 alpha-2)
export enum SmashsendCountryCode {
  AF = 'AF', // Afghanistan
  AL = 'AL', // Albania
  DZ = 'DZ', // Algeria
  AS = 'AS', // American Samoa
  AD = 'AD', // Andorra
  AO = 'AO', // Angola
  AI = 'AI', // Anguilla
  AQ = 'AQ', // Antarctica
  AG = 'AG', // Antigua and Barbuda
  AR = 'AR', // Argentina
  AM = 'AM', // Armenia
  AW = 'AW', // Aruba
  AU = 'AU', // Australia
  AT = 'AT', // Austria
  AZ = 'AZ', // Azerbaijan
  BS = 'BS', // Bahamas
  BH = 'BH', // Bahrain
  BD = 'BD', // Bangladesh
  BB = 'BB', // Barbados
  BY = 'BY', // Belarus
  BE = 'BE', // Belgium
  BZ = 'BZ', // Belize
  BJ = 'BJ', // Benin
  BM = 'BM', // Bermuda
  BT = 'BT', // Bhutan
  BO = 'BO', // Bolivia
  BA = 'BA', // Bosnia and Herzegovina
  BW = 'BW', // Botswana
  BV = 'BV', // Bouvet Island
  BR = 'BR', // Brazil
  IO = 'IO', // British Indian Ocean Territory
  BN = 'BN', // Brunei Darussalam
  BG = 'BG', // Bulgaria
  BF = 'BF', // Burkina Faso
  BI = 'BI', // Burundi
  KH = 'KH', // Cambodia
  CM = 'CM', // Cameroon
  CA = 'CA', // Canada
  CV = 'CV', // Cape Verde
  KY = 'KY', // Cayman Islands
  CF = 'CF', // Central African Republic
  TD = 'TD', // Chad
  CL = 'CL', // Chile
  CN = 'CN', // China
  CX = 'CX', // Christmas Island
  CC = 'CC', // Cocos (Keeling) Islands
  CO = 'CO', // Colombia
  KM = 'KM', // Comoros
  CG = 'CG', // Congo
  CD = 'CD', // Congo, Democratic Republic
  CK = 'CK', // Cook Islands
  CR = 'CR', // Costa Rica
  CI = 'CI', // Cote D'Ivoire
  HR = 'HR', // Croatia
  CU = 'CU', // Cuba
  CY = 'CY', // Cyprus
  CZ = 'CZ', // Czech Republic
  DK = 'DK', // Denmark
  DJ = 'DJ', // Djibouti
  DM = 'DM', // Dominica
  DO = 'DO', // Dominican Republic
  EC = 'EC', // Ecuador
  EG = 'EG', // Egypt
  SV = 'SV', // El Salvador
  GQ = 'GQ', // Equatorial Guinea
  ER = 'ER', // Eritrea
  EE = 'EE', // Estonia
  ET = 'ET', // Ethiopia
  FK = 'FK', // Falkland Islands
  FO = 'FO', // Faroe Islands
  FJ = 'FJ', // Fiji
  FI = 'FI', // Finland
  FR = 'FR', // France
  GF = 'GF', // French Guiana
  PF = 'PF', // French Polynesia
  TF = 'TF', // French Southern Territories
  GA = 'GA', // Gabon
  GM = 'GM', // Gambia
  GE = 'GE', // Georgia
  DE = 'DE', // Germany
  GH = 'GH', // Ghana
  GI = 'GI', // Gibraltar
  GR = 'GR', // Greece
  GL = 'GL', // Greenland
  GD = 'GD', // Grenada
  GP = 'GP', // Guadeloupe
  GU = 'GU', // Guam
  GT = 'GT', // Guatemala
  GN = 'GN', // Guinea
  GW = 'GW', // Guinea-Bissau
  GY = 'GY', // Guyana
  HT = 'HT', // Haiti
  HM = 'HM', // Heard and McDonald Islands
  VA = 'VA', // Holy See (Vatican)
  HN = 'HN', // Honduras
  HK = 'HK', // Hong Kong
  HU = 'HU', // Hungary
  IS = 'IS', // Iceland
  IN = 'IN', // India
  ID = 'ID', // Indonesia
  IR = 'IR', // Iran
  IQ = 'IQ', // Iraq
  IE = 'IE', // Ireland
  IL = 'IL', // Israel
  IT = 'IT', // Italy
  JM = 'JM', // Jamaica
  JP = 'JP', // Japan
  JO = 'JO', // Jordan
  KZ = 'KZ', // Kazakhstan
  KE = 'KE', // Kenya
  KI = 'KI', // Kiribati
  KP = 'KP', // Korea, Democratic People's Republic
  KR = 'KR', // Korea, Republic of
  KW = 'KW', // Kuwait
  KG = 'KG', // Kyrgyzstan
  LA = 'LA', // Lao People's Democratic Republic
  LV = 'LV', // Latvia
  LB = 'LB', // Lebanon
  LS = 'LS', // Lesotho
  LR = 'LR', // Liberia
  LY = 'LY', // Libyan Arab Jamahiriya
  LI = 'LI', // Liechtenstein
  LT = 'LT', // Lithuania
  LU = 'LU', // Luxembourg
  MO = 'MO', // Macao
  MK = 'MK', // Macedonia
  MG = 'MG', // Madagascar
  MW = 'MW', // Malawi
  MY = 'MY', // Malaysia
  MV = 'MV', // Maldives
  ML = 'ML', // Mali
  MT = 'MT', // Malta
  MH = 'MH', // Marshall Islands
  MQ = 'MQ', // Martinique
  MR = 'MR', // Mauritania
  MU = 'MU', // Mauritius
  YT = 'YT', // Mayotte
  MX = 'MX', // Mexico
  FM = 'FM', // Micronesia
  MD = 'MD', // Moldova
  MC = 'MC', // Monaco
  MN = 'MN', // Mongolia
  ME = 'ME', // Montenegro
  MS = 'MS', // Montserrat
  MA = 'MA', // Morocco
  MZ = 'MZ', // Mozambique
  MM = 'MM', // Myanmar
  NA = 'NA', // Namibia
  NR = 'NR', // Nauru
  NP = 'NP', // Nepal
  NL = 'NL', // Netherlands
  AN = 'AN', // Netherlands Antilles
  NC = 'NC', // New Caledonia
  NZ = 'NZ', // New Zealand
  NI = 'NI', // Nicaragua
  NE = 'NE', // Niger
  NG = 'NG', // Nigeria
  NU = 'NU', // Niue
  NF = 'NF', // Norfolk Island
  MP = 'MP', // Northern Mariana Islands
  NO = 'NO', // Norway
  OM = 'OM', // Oman
  PK = 'PK', // Pakistan
  PW = 'PW', // Palau
  PS = 'PS', // Palestinian Territory
  PA = 'PA', // Panama
  PG = 'PG', // Papua New Guinea
  PY = 'PY', // Paraguay
  PE = 'PE', // Peru
  PH = 'PH', // Philippines
  PN = 'PN', // Pitcairn
  PL = 'PL', // Poland
  PT = 'PT', // Portugal
  PR = 'PR', // Puerto Rico
  QA = 'QA', // Qatar
  RE = 'RE', // Reunion
  RO = 'RO', // Romania
  RU = 'RU', // Russian Federation
  RW = 'RW', // Rwanda
  SH = 'SH', // Saint Helena
  KN = 'KN', // Saint Kitts and Nevis
  LC = 'LC', // Saint Lucia
  PM = 'PM', // Saint Pierre and Miquelon
  VC = 'VC', // Saint Vincent and the Grenadines
  WS = 'WS', // Samoa
  SM = 'SM', // San Marino
  ST = 'ST', // Sao Tome and Principe
  SA = 'SA', // Saudi Arabia
  SN = 'SN', // Senegal
  SC = 'SC', // Seychelles
  SL = 'SL', // Sierra Leone
  SG = 'SG', // Singapore
  SK = 'SK', // Slovakia
  SI = 'SI', // Slovenia
  SB = 'SB', // Solomon Islands
  SO = 'SO', // Somalia
  ZA = 'ZA', // South Africa
  GS = 'GS', // South Georgia and South Sandwich Islands
  ES = 'ES', // Spain
  LK = 'LK', // Sri Lanka
  SD = 'SD', // Sudan
  SR = 'SR', // Suriname
  SJ = 'SJ', // Svalbard and Jan Mayen
  SZ = 'SZ', // Swaziland
  SE = 'SE', // Sweden
  CH = 'CH', // Switzerland
  SY = 'SY', // Syrian Arab Republic
  TW = 'TW', // Taiwan
  TJ = 'TJ', // Tajikistan
  TZ = 'TZ', // Tanzania
  TH = 'TH', // Thailand
  TL = 'TL', // Timor-Leste
  TG = 'TG', // Togo
  TK = 'TK', // Tokelau
  TO = 'TO', // Tonga
  TT = 'TT', // Trinidad and Tobago
  TN = 'TN', // Tunisia
  TR = 'TR', // Turkey
  TM = 'TM', // Turkmenistan
  TC = 'TC', // Turks and Caicos Islands
  TV = 'TV', // Tuvalu
  UG = 'UG', // Uganda
  UA = 'UA', // Ukraine
  AE = 'AE', // United Arab Emirates
  GB = 'GB', // United Kingdom
  US = 'US', // United States
  UM = 'UM', // United States Minor Outlying Islands
  UY = 'UY', // Uruguay
  UZ = 'UZ', // Uzbekistan
  VU = 'VU', // Vanuatu
  VE = 'VE', // Venezuela
  VN = 'VN', // Viet Nam
  VG = 'VG', // Virgin Islands, British
  VI = 'VI', // Virgin Islands, U.S.
  WF = 'WF', // Wallis and Futuna
  EH = 'EH', // Western Sahara
  YE = 'YE', // Yemen
  ZM = 'ZM', // Zambia
  ZW = 'ZW', // Zimbabwe
}

// Contact status enum
export enum SmashsendContactStatus {
  SUBSCRIBED = 'SUBSCRIBED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  ARCHIVED = 'ARCHIVED',
  OPT_IN_PENDING = 'OPT_IN_PENDING',
  BANNED = 'BANNED', // e.g: bad email, spam or abuse
}

export enum SmashsendContactSource {
  DASHBOARD = 'DASHBOARD',
  PUBLIC_API = 'PUBLIC_API',
  CSV_IMPORT = 'CSV_IMPORT',
  MAILCHIMP = 'MAILCHIMP',
  SENDGRID = 'SENDGRID',
  TRANSACTIONAL_EMAIL = 'TRANSACTIONAL_EMAIL',
  ZAPIER = 'ZAPIER',
  STRIPE = 'STRIPE',
}

// Contact creation payload (flat + optional customProperties)
export interface ContactCreateOptions {
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  birthday?: Date;
  city?: string;
  countryCode?: SmashsendCountryCode;
  language?: string;
  phone?: string;
  status?: SmashsendContactStatus;
  /**
   * 
   * Override the contact creation timestamp. SMASHSEND will only use this when `overrideCreatedAt: true` 
   * is passed to batch operations. Ignored for regular contact creation.
   * 
   * If an invalid Date is provided, SMASHSEND will silently fall back to the current timestamp.
   * No validation errors are thrown for invalid dates - the contact will still be created successfully.
   * 
   * @example
   * ```typescript
   * // For data migration from legacy systems
   * {
   *   email: 'user@legacy-system.com',
   *   firstName: 'John',
   *   createdAt: new Date('2023-01-15T10:30:00Z') // Historical creation date
   * }
   * ```
   */
  createdAt?: Date;
  // Extra custom properties keyed by apiSlug
  customProperties?: Record<string, any>;
}

// Custom property type enum
export enum SmashsendPropertyType {
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
}

export enum SmashsendContactPropertyFilterType {
  ALL = 'ALL',
  CUSTOM = 'CUSTOM',
  INTERNAL = 'INTERNAL',
}

// Contact interfaces
export interface Contact {
  id: string;
  createdAt: string;
  updatedAt?: string;
  workspaceId: string;
  properties: {
    avatarUrl?: string;
    birthday?: string;
    city?: string;
    countryCode?: SmashsendCountryCode;
    email: string;
    firstName?: string;
    language?: string;
    lastName?: string;
    phone?: string;
    status?: SmashsendContactStatus;

    // Allow custom properties
    [key: string]: any;
  };
}

// Custom property interfaces
export interface CustomProperty {
  apiSlug: string;
  createdAt: string;
  description?: string;
  displayName: string;
  id: string;
  isInternal: boolean;
  type: SmashsendPropertyType;
  typeConfig: {
    options?: Array<{
      color: string;
      displayName: string;
      id: string;
      value: string;
    }>;
    multiple?: boolean;
  };
  updatedAt?: string;
  workspaceId: string;
}

export interface CustomPropertyCreateOptions {
  displayName: string;
  type: SmashsendPropertyType;
  description?: string;
  typeConfig?: {
    multiple?: boolean;
    options?: string[];
    isRequired?: boolean;
    isDeletable?: boolean;
  };
}

export interface CustomPropertyUpdateOptions {
  displayName?: string;
  description?: string;
}

export interface CustomPropertyListResponse {
  items: CustomProperty[];
  hasMore: boolean;
}

// Batch Contacts interfaces ────────────────────────────────────────────

export interface BatchError {
  code: string;
  message: string;
  retryable?: boolean;
  retryAfter?: number;
}

export interface BatchContactError {
  index: number;
  email: string;
  errors: BatchError[];
}

export interface BatchFailedContact {
  index: number;
  contact: ContactCreateOptions;
  errors: BatchError[];
}

export interface BatchContactsSummary {
  created: number;
  updated: number;
  failed: number;
  total: number;
  processingTime: number;
  eventsProcessed?: boolean;
  eventsError?: string;
}

export interface BatchContactsOptions {
  allowPartialSuccess?: boolean;
  includeFailedContacts?: boolean;
  /**
   * ⚠️ MIGRATION USE ONLY ⚠️
   * 
   * Allow overriding the created_at timestamp during contact import/migration.
   * 
   * When set to `true`, SMASHSEND will use the `createdAt` field from each contact 
   * instead of the current timestamp. This is designed ONLY for data migration 
   * scenarios where you need to preserve historical creation dates.
   * 
   * ⚠️ WARNING: Avoid using this parameter unless you're migrating data from 
   * another system. Incorrect usage can corrupt your analytics and reporting.
   * 
   * Invalid timestamps are silently ignored and fallback to current timestamp.
   * No validation errors are thrown - contacts will always be created successfully.
   * 
   * @default false
   * @example
   * ```typescript
   * // ❌ DON'T do this for regular contact creation
   * await smashsend.contacts.createBatch(contacts, { overrideCreatedAt: true });
   * 
   * // ✅ ONLY use for data migration scenarios
   * const migrationContacts = [
   *   { 
   *     email: 'user@legacy-system.com', 
   *     firstName: 'John',
   *     createdAt: new Date('2023-01-15T10:30:00Z') // Historical date
   *   }
   * ];
   * await smashsend.contacts.createBatch(migrationContacts, { 
   *   overrideCreatedAt: true // Only for migration!
   * });
   * ```
   */
  overrideCreatedAt?: boolean;
}

export interface BatchContactsResponse {
  /**
   * Request ID that SMASHSEND assigns to the request.
   */
  requestId: string;
  /**
   *  successful created/updated contacts. 
   * 
   * If allowPartialSuccess query param is true, SMASHSEND will create
   * valid contacts and report errors for invalid ones.
   */
  contacts: Contact[];
  summary: BatchContactsSummary;
  errors?: BatchContactError[];
  /**
   * Failed contacts.
   * 
   * If includeFailedContacts query param is true, this will be included in the response.
   */
  failedContacts?: BatchFailedContact[];
}

// Webhook interfaces
export interface WebhookCreateOptions {
  url: string;
  events: SmashsendWebhookEvent[];
  token?: string; // Changed from 'secret' to match backend
}

export interface WebhookUpdateOptions {
  url?: string;
  token?: string;
  events?: SmashsendWebhookEvent[];
  status?: SmashsendWebhookStatus;
}

export interface Webhook {
  id: string;
  url: string;
  events: SmashsendWebhookEvent[];
  displayName: string; // Added to match backend
  status: SmashsendWebhookStatus; // Changed from 'enabled: boolean' to match backend
  token: string; // Changed from 'secret' to match backend
  createdAt: string;
  updatedAt?: string; // Added to match backend
  workspaceId: string; // Added to match backend
}

// Webhook enums
export enum SmashsendWebhookStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  BANNED = 'BANNED', // phishing, spam, etc.
}

export enum SmashsendWebhookEvent {
  // Contacts
  CONTACT_CREATED = 'CONTACT_CREATED',
  CONTACT_DELETED = 'CONTACT_DELETED',
  CONTACT_PROPERTY_UPDATED = 'CONTACT_PROPERTY_UPDATED',
  CONTACT_RESUBSCRIBED = 'CONTACT_RESUBSCRIBED',
  CONTACT_TAG_ADDED = 'CONTACT_TAG_ADDED',
  CONTACT_TAG_REMOVED = 'CONTACT_TAG_REMOVED',
  CONTACT_UNSUBSCRIBED = 'CONTACT_UNSUBSCRIBED',
  CONTACT_UPDATED = 'CONTACT_UPDATED',

  // Workspace
  WORKSPACE_BANNED = 'WORKSPACE_BANNED',
  WORKSPACE_SENDING_EMAILS_PAUSED = 'WORKSPACE_SENDING_EMAILS_PAUSED',
  WORKSPACE_TEAM_MEMBER_JOINED = 'WORKSPACE_TEAM_MEMBER_JOINED',

  // Testing events
  TESTING_CONNECTION = 'TESTING_CONNECTION',
}

// API Key interfaces
export interface ApiKeyValidationResponse {
  status: string;
  displayName: string;
  role: string;
}

export interface ApiKeyInfo {
  createdAt: string;
  displayName: string;
  id: string;
  role: SmashsendApiKeyRole;
  secretKey?: string;
  status: SmashsendApiKeyStatus;
  updatedAt?: string;
  workspaceId: string;
}

export interface ApiKeyCreateOptions {
  displayName: string;
  role: SmashsendApiKeyRole;
}

export interface ApiKeyUpdateOptions {
  displayName?: string;
  role?: SmashsendApiKeyRole;
}

export interface ApiKeyListOptions {
  startAt?: Date;
  sort?: 'createdAt.desc' | 'createdAt.asc';
  limit?: number;
}

export interface ApiKeyListResponse {
  apiKeys: {
    items: ApiKeyInfo[];
    hasMore: boolean;
    startAt?: Date;
  };
}

export interface ApiKeyDeleteResponse {
  apiKey: ApiKeyInfo;
  isDeleted: boolean;
}

// Transactional Email Templates ────────────────────────────────────────────

/**
 * Status of a transactional email
 */
export type TransactionalStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'PAUSED';

/**
 * Transactional email information
 */
export interface Transactional {
  /** Transactional ID */
  id: string;
  /** Transactional name (used as identifier in API calls) */
  name: string;
  /** Display name/title of the transactional */
  displayName: string;
  /** Email subject line */
  subject: string;
  /** Transactional status */
  status: TransactionalStatus;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt?: string;
  /** Template variables */
  variables?: Record<string, { id: string; defaultValue: string }>;
  /** HTML body content */
  bodyHtml?: string;
  /** Text body content */
  bodyText?: string;
  /** From email address */
  fromEmail?: string;
  /** From name */
  fromName?: string;
  /** Reply-to information */
  replyTo?: Array<{ email: string; name?: string }>;
  /** Preview text */
  previewText?: string;
}

/**
 * Parameters for listing transactional emails
 */
export interface ListTransactionalOptions {
  /** Maximum number of transactionals to return (1-100, default: 15) */
  limit?: number;
  /** Cursor for pagination */
  cursor?: string;
  /** Sort order */
  sort?: 'createdAt.desc' | 'createdAt.asc';
  /** Filter by transactional status */
  status?: TransactionalStatus;
}

/**
 * Response from listing transactional emails
 */
export interface ListTransactionalResponse {
  /** Pagination cursor for next page */
  cursor: string | null;
  /** Whether there are more transactionals available */
  hasMore: boolean;
  /** Array of transactional objects */
  items: Transactional[];
}
