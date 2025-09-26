/**
 * Safely converts a date value to ISO string format
 * Returns undefined if the date is invalid
 * 
 * @param dateValue - Any value that might represent a date
 * @returns ISO string if valid, undefined if invalid
 */
export const safeToISOString = (dateValue: any): string | undefined => {
  // Handle null, undefined, and empty string
  if (dateValue === null || dateValue === undefined || dateValue === '') {
    return undefined;
  }
  
  try {
    // Handle Date objects
    if (dateValue instanceof Date) {
      return !isNaN(dateValue.getTime()) ? dateValue.toISOString() : undefined;
    }
    
    // Handle string dates
    if (typeof dateValue === 'string') {
      const parsedDate = new Date(dateValue);
      return !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : undefined;
    }
    
    // Handle numeric timestamps (including 0)
    if (typeof dateValue === 'number' && !isNaN(dateValue) && isFinite(dateValue)) {
      const dateFromTimestamp = new Date(dateValue);
      return !isNaN(dateFromTimestamp.getTime()) ? dateFromTimestamp.toISOString() : undefined;
    }
    
    return undefined;
  } catch (error) {
    return undefined;
  }
};
