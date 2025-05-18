'use server';

import { getSmashSendClient } from './lib/smashsend';

export async function createContact(data: FormData) {
  try {
    const smashsend = getSmashSendClient();
    const contact = await smashsend.contacts.create({
      email: data.get('email') as string,
      properties: {
        firstName: data.get('firstName') as string,
        lastName: data.get('lastName') as string,
      },
    });

    return { success: true, contact };
  } catch (error) {
    console.error('Error creating contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}
