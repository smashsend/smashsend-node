const { SmashSend, SmashsendContactStatus, SmashsendCountryCode } = require('@smashsend/node');

// Create a client instance
const smashsend = new SmashSend('your-api-key');

// Example: Create a contact with standard and custom properties
async function createContact() {
  try {
    const response = await smashsend.contacts.create({
      // Standard properties
      email: 'contact@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: 'https://example.com/avatar.jpg',
      phone: '+1234567890',
      countryCode: SmashsendCountryCode.US,
      status: SmashsendContactStatus.SUBSCRIBED,

      // Custom properties
      customProperties: {
        company: 'Example Inc',
        jobTitle: 'Software Engineer',
        source: 'website',
        leadScore: 85,
      },
    });

    console.log('Contact created successfully:');
    console.log(`ID: ${response.contact.id}`);
    console.log(`Email: ${response.contact.properties.email}`);
    console.log(
      `Name: ${response.contact.properties.firstName} ${response.contact.properties.lastName}`
    );
    console.log(
      `Job: ${response.contact.properties.jobTitle} at ${response.contact.properties.company}`
    );
    console.log(`Status: ${response.contact.properties.status}`);
    console.log(`Country: ${response.contact.properties.countryCode}`);

    return response.contact;
  } catch (error) {
    console.error('Error creating contact:', error.message);
    throw error;
  }
}

// Example: Get a contact by ID
async function getContact(contactId) {
  try {
    const response = await smashsend.contacts.get(contactId);

    // Safe access to properties using optional chaining
    const properties = response.contact.properties || {};

    console.log('Contact details:');
    console.log(`ID: ${response.contact.id}`);
    console.log(`Email: ${properties.email || 'N/A'}`);
    console.log(`Name: ${properties.firstName || ''} ${properties.lastName || ''}`);
    console.log(`Status: ${properties.status || 'N/A'}`);
    console.log(`Country: ${properties.countryCode || 'N/A'}`);

    // Access phone if it exists
    if (properties.phone) {
      console.log(`Phone: ${properties.phone}`);
    }

    // Log all properties
    console.log('All properties:');
    Object.entries(properties).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

    return response.contact;
  } catch (error) {
    console.error('Error fetching contact:', error.message);
    throw error;
  }
}

// Example: Update a contact
async function updateContact(contactId) {
  try {
    const response = await smashsend.contacts.update(contactId, {
      // Update standard properties
      status: SmashsendContactStatus.UNSUBSCRIBED,
      countryCode: SmashsendCountryCode.GB,
      phone: '+1987654321',

      // Update custom properties
      customProperties: {
        leadScore: 95,
        lastActivity: new Date().toISOString(),
      },
    });

    // Safe access to properties
    const properties = response.contact.properties || {};

    console.log('Contact updated successfully:');
    console.log(`ID: ${response.contact.id}`);
    console.log(`Status: ${properties.status || 'N/A'}`);
    console.log(`Country: ${properties.countryCode || 'N/A'}`);
    console.log(`Lead Score: ${properties.leadScore || 'N/A'}`);

    return response.contact;
  } catch (error) {
    console.error('Error updating contact:', error.message);
    throw error;
  }
}

// Example: List contacts
async function listContacts() {
  try {
    const response = await smashsend.contacts.list({ limit: 10 });

    console.log(
      `Found ${response.contacts.length} contacts (total: ${response.pagination.total}):`
    );

    response.contacts.forEach((contact, index) => {
      // Safe access to properties
      const properties = contact.properties || {};
      console.log(
        `${index + 1}. ${properties.firstName || ''} ${properties.lastName || ''} (${properties.email || 'N/A'})`
      );
      console.log(
        `   Status: ${properties.status || 'N/A'} | Country: ${properties.countryCode || 'N/A'}`
      );
    });

    return response;
  } catch (error) {
    console.error('Error listing contacts:', error.message);
    throw error;
  }
}

// Run examples
(async () => {
  try {
    // Create a new contact
    const contact = await createContact();

    // Get contact details
    await getContact(contact.id);

    // Update the contact
    await updateContact(contact.id);

    // List contacts
    await listContacts();
  } catch (error) {
    console.error('Example failed:', error);
  }
})();
