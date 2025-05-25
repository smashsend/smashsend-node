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

export interface EmailSendOptions {
  from: string | EmailAddress;
  to: string | EmailAddress | Array<string | EmailAddress>;
  cc?: string | EmailAddress | Array<string | EmailAddress>;
  bcc?: string | EmailAddress | Array<string | EmailAddress>;
  replyTo?: string | EmailAddress;
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  tags?: string[];
  templateId?: string;
  templateData?: Record<string, any>;
  headers?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface EmailAttachment {
  filename: string;
  content: string | Uint8Array;
  contentType?: string;
}

export interface EmailSendResponse {
  id: string;
  from: string;
  to: string[];
  created: string;
  statusCode: number;
  message: string;
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

// Contact interfaces
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
  customProperties?: Record<string, any>;
}

// Backend Contact type - matches exactly what the backend returns
export interface Contact {
  id: string;
  createdAt: string;
  updatedAt?: string;
  workspaceId?: string;
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

// Webhook interfaces
export interface WebhookCreateOptions {
  url: string;
  events: string[];
  description?: string;
  enabled?: boolean;
  secret?: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  description?: string;
  enabled: boolean;
  createdAt: string;
}

// API Key interfaces
export interface ApiKeyValidationResponse {
  status: string;
  displayName: string;
  role: string;
}

export interface ApiKeyInfo {
  id: string;
  name: string;
  permissions: string[];
  createdAt: string;
  lastUsedAt?: string;
  accountId: string;
}

export interface ApiKeyCreateOptions {
  displayName: string;
  role: string;
}

export interface ApiKeyUpdateOptions {
  displayName?: string;
  role?: string;
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
