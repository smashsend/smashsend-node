import { SmashSend } from '@smashsend/node';

let smashsendClient: SmashSend;

/**
 * Get a singleton instance of the SmashSend client.
 * This helps prevent multiple client instances in Next.js applications.
 *
 * @param apiKey Optional API key - if not provided, uses environment variable
 * @returns SmashSend client instance
 */
export function getSmashSendClient(apiKey?: string) {
  if (!smashsendClient) {
    const key = apiKey || process.env.SMASHSEND_API_KEY;
    if (!key) {
      throw new Error('SMASHSEND_API_KEY is not defined');
    }
    smashsendClient = new SmashSend(key);
  }
  return smashsendClient;
}

/**
 * Example usage in a server component, API route, or server action:
 *
 * ```typescript
 * import { getSmashSendClient } from 'lib/smashsend';
 *
 * export async function createContact(data) {
 *   const smashsend = getSmashSendClient();
 *   return await smashsend.contacts.create({
 *     email: data.email,
 *     firstName: data.firstName,
 *     lastName: data.lastName,
 *   });
 * }
 * ```
 */
