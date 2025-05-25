// Utilities copied from validator.js to avoid external dependencies

/**
 * Assert that input is a string
 */
function assertString(input: any): void {
  const isString = typeof input === 'string' || input instanceof String;
  if (!isString) {
    let invalidType: string = typeof input;
    if (input === null) invalidType = 'null';
    else if (invalidType === 'object') invalidType = input.constructor.name;
    throw new Error(`Expected a string but received a ${invalidType}`);
  }
}

/**
 * Merge options with defaults
 */
function merge(obj: any, defaults: any): any {
  for (const key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}

/**
 * Check if string byte length is within range
 */
function isByteLength(str: string, options: { min?: number; max?: number } = {}): boolean {
  assertString(str);
  const len = encodeURI(str).split(/%..|./).length - 1;
  return len >= (options.min || 0) && (typeof options.max === 'undefined' || len <= options.max);
}

/**
 * Check if domain is in host list
 */
function checkHost(host: string, hostList: string[]): boolean {
  return hostList.includes(host);
}

/**
 * Check if string is a valid IP address
 */
function isIP(str: string, version?: 4 | 6): boolean {
  assertString(str);
  const versionStr = String(version);
  if (!version) {
    return isIP(str, 4) || isIP(str, 6);
  }

  if (versionStr === '4') {
    const ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const parts = str.match(ipv4Maybe);
    return parts ? parts.slice(1).every((part) => parseInt(part, 10) <= 255) : false;
  }

  if (versionStr === '6') {
    const ipv6 = /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i;
    return ipv6.test(str);
  }

  return false;
}

/**
 * Check if string is a Fully Qualified Domain Name
 */
function isFQDN(str: string, options: any = {}): boolean {
  assertString(str);

  const defaults = {
    require_tld: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_numeric_tld: false,
    allow_wildcard: false,
    ignore_max_length: false,
  };

  options = merge(options, defaults);

  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }

  if (options.allow_wildcard === true && str.indexOf('*.') === 0) {
    str = str.substring(2);
  }

  const parts = str.split('.');
  const tld = parts[parts.length - 1];

  if (options.require_tld) {
    if (parts.length < 2) return false;
    if (
      !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(
        tld
      )
    ) {
      return false;
    }
    if (/\s/.test(tld)) return false;
  }

  if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
    return false;
  }

  return parts.every((part) => {
    if (part.length > 63 && !options.ignore_max_length) return false;
    if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) return false;
    if (/[\uff01-\uff5e]/.test(part)) return false;
    if (/^-|-$/.test(part)) return false;
    if (!options.allow_underscores && /_/.test(part)) return false;
    return true;
  });
}

// Email validation implementation from validator.js
const default_email_options = {
  allow_display_name: false,
  allow_underscores: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
  blacklisted_chars: '',
  ignore_max_length: false,
  host_blacklist: [],
  host_whitelist: [],
  allow_ip_domain: false,
};

const splitNameAddress = /^([^\x00-\x1F\x7F-\x9F\cX]+)</i;
const emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
const gmailUserPart = /^[a-z\d]+$/;
const quotedEmailUser =
  /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
const emailUserUtf8Part =
  /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
const quotedEmailUserUtf8 =
  /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
const defaultMaxEmailLength = 254;

/**
 * Validate display name according to RFC2822
 */
function validateDisplayName(display_name: string): boolean {
  const display_name_without_quotes = display_name.replace(/^"(.+)"$/, '$1');
  if (!display_name_without_quotes.trim()) {
    return false;
  }

  const contains_illegal = /[\.";<>]/.test(display_name_without_quotes);
  if (contains_illegal) {
    if (display_name_without_quotes === display_name) {
      return false;
    }

    const all_start_with_back_slash =
      display_name_without_quotes.split('"').length ===
      display_name_without_quotes.split('\\"').length;
    if (!all_start_with_back_slash) {
      return false;
    }
  }

  return true;
}

/**
 * Validate email format using validator.js implementation
 * This is a comprehensive email validator that follows RFC standards
 * @param str - Email address to validate
 * @param options - Validation options
 * @returns boolean indicating if email is valid
 */
export function isEmail(str: string, options: any = {}): boolean {
  assertString(str);
  options = merge(options, default_email_options);

  if (options.require_display_name || options.allow_display_name) {
    const display_email = str.match(splitNameAddress);
    if (display_email) {
      let display_name = display_email[1];
      str = str.replace(display_name, '').replace(/(^<|>$)/g, '');

      if (display_name.endsWith(' ')) {
        display_name = display_name.slice(0, -1);
      }

      if (!validateDisplayName(display_name)) {
        return false;
      }
    } else if (options.require_display_name) {
      return false;
    }
  }

  if (!options.ignore_max_length && str.length > defaultMaxEmailLength) {
    return false;
  }

  const parts = str.split('@');
  const domain = parts.pop()!;
  const lower_domain = domain.toLowerCase();

  if (options.host_blacklist.length > 0 && checkHost(lower_domain, options.host_blacklist)) {
    return false;
  }

  if (options.host_whitelist.length > 0 && !checkHost(lower_domain, options.host_whitelist)) {
    return false;
  }

  let user = parts.join('@');

  if (
    options.domain_specific_validation &&
    (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com')
  ) {
    user = user.toLowerCase();
    const username = user.split('+')[0];

    if (!isByteLength(username.replace(/\./g, ''), { min: 6, max: 30 })) {
      return false;
    }

    const user_parts = username.split('.');
    for (let i = 0; i < user_parts.length; i++) {
      if (!gmailUserPart.test(user_parts[i])) {
        return false;
      }
    }
  }

  if (
    options.ignore_max_length === false &&
    (!isByteLength(user, { max: 64 }) || !isByteLength(domain, { max: 254 }))
  ) {
    return false;
  }

  if (
    !isFQDN(domain, {
      require_tld: options.require_tld,
      ignore_max_length: options.ignore_max_length,
      allow_underscores: options.allow_underscores,
    })
  ) {
    if (!options.allow_ip_domain) {
      return false;
    }

    if (!isIP(domain)) {
      if (!domain.startsWith('[') || !domain.endsWith(']')) {
        return false;
      }

      const noBracketdomain = domain.slice(1, -1);

      if (noBracketdomain.length === 0 || !isIP(noBracketdomain)) {
        return false;
      }
    }
  }

  if (options.blacklisted_chars) {
    if (user.search(new RegExp(`[${options.blacklisted_chars}]+`, 'g')) !== -1) return false;
  }

  if (user[0] === '"' && user[user.length - 1] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part
      ? quotedEmailUserUtf8.test(user)
      : quotedEmailUser.test(user);
  }

  const pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;

  const user_parts = user.split('.');
  for (let i = 0; i < user_parts.length; i++) {
    if (!pattern.test(user_parts[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Validate email format (alias for isEmail for backward compatibility)
 * @param email - Email address to validate
 * @returns boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  try {
    return isEmail(email);
  } catch {
    return false;
  }
};

/**
 * Safely parse JSON with validation
 * @param jsonString - JSON string to parse
 * @param fieldName - Name of the field for error messages
 * @returns Parsed JSON object
 * @throws Error if JSON is invalid
 */
export const safeParseJSON = (jsonString: string, fieldName: string): any => {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error(`${fieldName} must be a valid JSON object`);
    }
    return parsed;
  } catch (error) {
    throw new Error(
      `Invalid JSON format in ${fieldName}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

/**
 * Validate and normalize email address
 * @param email - Email to validate and normalize
 * @param fieldName - Field name for error messages (default: "email")
 * @returns Normalized email address (trimmed and lowercase)
 * @throws Error if email is invalid
 */
export const validateAndNormalizeEmail = (email: string, fieldName: string = 'email'): string => {
  const trimmed = email.trim();
  if (!trimmed) {
    throw new Error(`${fieldName} is required and cannot be empty.`);
  }

  if (!isEmail(trimmed)) {
    throw new Error(`Invalid ${fieldName} format: ${email}. Please provide a valid email address.`);
  }

  return trimmed.toLowerCase();
};

/**
 * Validate that a string field is not empty
 * @param value - Value to validate
 * @param fieldName - Field name for error messages
 * @returns Trimmed value
 * @throws Error if value is empty
 */
export const validateRequiredString = (value: string | undefined, fieldName: string): string => {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`${fieldName} is required and cannot be empty.`);
  }
  return trimmed;
};

/**
 * Validate numeric range
 * @param value - Value to validate
 * @param fieldName - Field name for error messages
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Validated number
 * @throws Error if value is out of range
 */
export const validateNumberRange = (
  value: any,
  fieldName: string,
  min: number,
  max: number
): number => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a valid number.`);
  }
  if (num < min || num > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}.`);
  }
  return num;
};

/**
 * Validate URL format using built-in URL constructor
 * @param url - URL to validate
 * @returns boolean indicating if URL is valid
 */
export const isUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate URL format (with optional error throwing)
 * @param url - URL to validate
 * @param fieldName - Field name for error messages
 * @returns boolean indicating if URL is valid
 */
export const validateUrl = (url: string, fieldName?: string): boolean => {
  const isValid = isUrl(url);

  if (!isValid && fieldName) {
    throw new Error(`Invalid ${fieldName} format: ${url}. Please provide a valid URL.`);
  }

  return isValid;
};

/**
 * Validate phone number format using a basic pattern
 * @param phone - Phone number to validate
 * @returns boolean indicating if phone is valid
 */
export const isPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  const cleaned = phone.replace(/[^\d+]/g, '');
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;

  return phoneRegex.test(cleaned);
};

/**
 * Validate phone number format (with optional error throwing)
 * @param phone - Phone number to validate
 * @param fieldName - Field name for error messages
 * @returns boolean indicating if phone is valid
 */
export const validatePhone = (phone: string, fieldName?: string): boolean => {
  const isValid = isPhone(phone);

  if (!isValid && fieldName) {
    throw new Error(`Invalid ${fieldName} format: ${phone}. Please provide a valid phone number.`);
  }

  return isValid;
};
