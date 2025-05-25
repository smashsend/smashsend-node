import validator from 'validator';

/**
 * Validate email format using validator.js (much more robust than custom regex)
 * @param email - Email address to validate
 * @returns boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
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

  if (!validateEmail(trimmed)) {
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
 * Validate URL format
 * @param url - URL to validate
 * @param fieldName - Field name for error messages
 * @returns boolean indicating if URL is valid
 */
export const validateUrl = (url: string, fieldName?: string): boolean => {
  const isValid = validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
  });

  if (!isValid && fieldName) {
    throw new Error(`Invalid ${fieldName} format: ${url}. Please provide a valid URL.`);
  }

  return isValid;
};

/**
 * Validate phone number format
 * @param phone - Phone number to validate
 * @param fieldName - Field name for error messages
 * @returns boolean indicating if phone is valid
 */
export const validatePhone = (phone: string, fieldName?: string): boolean => {
  const isValid = validator.isMobilePhone(phone, 'any', { strictMode: false });

  if (!isValid && fieldName) {
    throw new Error(`Invalid ${fieldName} format: ${phone}. Please provide a valid phone number.`);
  }

  return isValid;
};
