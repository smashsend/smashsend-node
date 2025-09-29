/**
 * Example: Delete a contact by email address
 * 
 * This example demonstrates how to delete a contact from your SMASHSEND workspace
 * using their email address instead of their contact ID.
 */

import { SmashSend } from '@smashsend/node';

const smashsend = new SmashSend('your-api-key-here');

async function deleteContactByEmailExample() {
  try {
    // Delete a contact by email address
    const result = await smashsend.contacts.deleteByEmail('user@example.com');
    
    console.log('Contact deleted successfully:');
    console.log('- Contact ID:', result.contact.id);
    console.log('- Email:', result.contact.email);
    console.log('- First Name:', result.contact.firstName);
    console.log('- Last Name:', result.contact.lastName);
    console.log('- Deleted:', result.isDeleted);
    
  } catch (error) {
    if (error.status === 404) {
      console.error('Contact not found with that email address');
    } else {
      console.error('Failed to delete contact:', error.message);
    }
  }
}

// Handle emails with special characters
async function deleteContactWithSpecialCharacters() {
  try {
    // This will properly URL encode the email
    const result = await smashsend.contacts.deleteByEmail('user+test@example.com');
    console.log('Contact with special characters deleted:', result.contact.email);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the examples
deleteContactByEmailExample();
deleteContactWithSpecialCharacters();
