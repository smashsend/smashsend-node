import { SmashSend, SmashsendPropertyType } from '@smashsend/node';

// Create a client instance
const smashsend = new SmashSend('your-api-key');

// Example: Create different types of contact properties
async function createContactProperties() {
  try {
    // 1. Create a single-select property (dropdown)
    const industryProperty = await smashsend.contacts.createProperty({
      displayName: 'Industry',
      type: SmashsendPropertyType.SELECT,
      description: 'The industry the contact works in',
      typeConfig: {
        multiple: false,
        options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Other'],
      },
    });
    console.log('Created industry property:', industryProperty.id);

    // 2. Create a multi-select property (checkboxes)
    const interestsProperty = await smashsend.contacts.createProperty({
      displayName: 'Interests',
      type: SmashsendPropertyType.MULTI_SELECT,
      description: 'Topics the contact is interested in',
      typeConfig: {
        multiple: true,
        options: ['Marketing', 'Sales', 'Product Updates', 'Events', 'Blog Posts'],
      },
    });
    console.log('Created interests property:', interestsProperty.id);

    // 3. Create a string property (short text)
    const companyProperty = await smashsend.contacts.createProperty({
      displayName: 'Company',
      type: SmashsendPropertyType.STRING,
      description: 'Company name (max 255 characters)',
      typeConfig: {},
    });
    console.log('Created company property:', companyProperty.id);

    // 4. Create a number property
    const leadScoreProperty = await smashsend.contacts.createProperty({
      displayName: 'Lead Score',
      type: SmashsendPropertyType.NUMBER,
      description: 'Lead score from 0 to 100',
      typeConfig: {},
    });
    console.log('Created lead score property:', leadScoreProperty.id);

    // 5. Create a date property
    const lastPurchaseProperty = await smashsend.contacts.createProperty({
      displayName: 'Last Purchase Date',
      type: SmashsendPropertyType.DATE,
      description: 'Date of last purchase',
      typeConfig: {},
    });
    console.log('Created last purchase date property:', lastPurchaseProperty.id);

    // 6. Create a boolean property
    const isCustomerProperty = await smashsend.contacts.createProperty({
      displayName: 'Is Customer',
      type: SmashsendPropertyType.BOOLEAN,
      description: 'Whether the contact is a paying customer',
      typeConfig: {},
    });
    console.log('Created is customer property:', isCustomerProperty.id);
  } catch (error: any) {
    console.error('Error creating contact properties:', error.message);
    throw error;
  }
}

// Example: Use custom properties when creating/updating contacts
async function createContactWithCustomProperties() {
  try {
    const contact = await smashsend.contacts.create({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      customProperties: {
        // For text fields like email, URL, phone - use STRING type
        company: 'ACME Corp',
        website: 'https://acme.com', // STRING type (not URL)
        workPhone: '+1-555-123-4567', // STRING type (not PHONE)
        personalEmail: 'john@gmail.com', // STRING type (not EMAIL)

        // For longer text, still use STRING (backend will handle up to 255 chars)
        bio: 'Senior developer with 10 years experience',

        // For whole numbers, use NUMBER type
        employeeCount: 150, // NUMBER type (not INTEGER)

        // Other standard types
        leadScore: 85.5, // NUMBER type
        isCustomer: true, // BOOLEAN type
        lastContactDate: '2024-03-15', // DATE type

        // For select fields (if configured)
        industry: 'Technology', // SELECT type
        interests: ['Marketing', 'Sales'], // MULTI_SELECT type
      },
    });

    console.log('Contact created with custom properties:', contact.id);
  } catch (error: any) {
    console.error('Error creating contact:', error.message);
    throw error;
  }
}

// Important notes about property types:
console.log(`
IMPORTANT: Property Type Mapping

The backend only supports these types:
- SELECT: Single choice dropdown
- MULTI_SELECT: Multiple choice selection  
- STRING: Text up to 255 characters
- NUMBER: Decimal numbers
- DATE: Date values
- BOOLEAN: True/False values

Common misconceptions:
- There is NO 'TEXT' type - use STRING
- There is NO 'INTEGER' type - use NUMBER
- There is NO 'EMAIL' type - use STRING
- There is NO 'URL' type - use STRING  
- There is NO 'PHONE' type - use STRING

The backend will validate and store these as appropriate.
`);

// Run examples
(async () => {
  try {
    await createContactProperties();
    await createContactWithCustomProperties();
  } catch (error) {
    console.error('Example failed:', error);
  }
})();
