import { SMASHSEND, SMASHSENDError } from '@smashsend/node';

// Create a client instance
const smashsend = new SMASHSEND('your-api-key', {
  maxRetries: 3,
  timeout: 60000,
});

// Example: Send an email
async function sendEmail() {
  try {
    const email = await smashsend.emails.send({
      from: {
        email: 'sender@example.com',
        name: 'Sender Name',
      },
      to: [
        {
          email: 'recipient1@example.com',
          name: 'Recipient 1',
        },
        'recipient2@example.com',
      ],
      subject: 'Hello from SMASHSEND',
      text: 'This is a test email from the SMASHSEND Node.js SDK.',
      html: '<p>This is a test email from the <strong>SMASHSEND Node.js SDK</strong>.</p>',
      attachments: [
        {
          filename: 'attachment.txt',
          content: 'SGVsbG8gV29ybGQh', // Base64 encoded content
          contentType: 'text/plain',
        },
      ],
      tags: ['example', 'test'],
    });

    console.log('Email sent successfully!');
    console.log('Email ID:', email.id);
    console.log('Status:', email.statusCode);
  } catch (error) {
    if (error instanceof SMASHSENDError) {
      console.error(`Error: ${error.message}`);
      console.error(`Status Code: ${error.statusCode}`);
      console.error(`Error Code: ${error.code}`);
      console.error(`Request ID: ${error.requestId}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Example: Manage contacts with error handling
async function manageContacts() {
  try {
    // Create a contact
    const contact = await smashsend.contacts.create({
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      custom: {
        company: 'SMASHSEND',
        role: 'Developer',
      },
      tags: ['developer', 'node-sdk'],
    });
    console.log('Contact created:', contact.id);

    // Update the contact
    const updatedContact = await smashsend.contacts.update(contact.id, {
      firstName: 'Jonathan',
      custom: {
        ...contact.custom,
        department: 'Engineering',
      },
    });
    console.log('Contact updated:', updatedContact.firstName);

    // Add contact to a list
    await smashsend.contacts.addToList(contact.id, 'list-123');
    console.log('Contact added to list');

    // Add tags to contact
    await smashsend.contacts.addTags(contact.id, ['vip', 'early-adopter']);
    console.log('Tags added to contact');
  } catch (error) {
    if (error instanceof SMASHSENDError) {
      console.error(`Error: ${error.message}`);
      console.error(`Status Code: ${error.statusCode}`);
      console.error(`Error Code: ${error.code}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Run examples
(async () => {
  await sendEmail();
  await manageContacts();
})();
