/**
 * ⚠️ MIGRATION EXAMPLE - Use with extreme caution! ⚠️
 * 
 * This example demonstrates how to use the `overrideCreatedAt` parameter
 * when migrating contacts from legacy systems (like MailChimp, CustomerIO or Hubspot) while preserving
 * their original creation timestamps.
 * 
 * ⚠️ WARNING: Only use this for one-time data migrations. Regular use will
 * corrupt your analytics and reporting data.
 */

import { SmashSend } from '@smashsend/node';

// Initialize the client
const smashsend = new SmashSend('your-api-key');

async function migrateContactsFromLegacySystem() {
  try {
    // Example: Migrating contacts from Jungle or another system
    const legacyContacts = [
      {
        email: 'john@jungle-client.com',
        firstName: 'John',
        lastName: 'Doe',
        // ⚠️ CRITICAL: This is the original creation date from the legacy system
        createdAt: new Date('2023-01-15T10:30:00Z'),
      },
      {
        email: 'jane@jungle-client.com',
        firstName: 'Jane',
        lastName: 'Smith',
        // ⚠️ CRITICAL: This is the original creation date from the legacy system
        createdAt: new Date('2023-02-20T14:45:00Z'),
      },
      {
        email: 'bob@jungle-client.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        // ⚠️ CRITICAL: This is the original creation date from the legacy system
        createdAt: new Date('2023-03-10T09:15:00Z'),
      },
      {
        email: 'invalid@jungle-client.com',
        firstName: 'Invalid',
        lastName: 'Date',
        // ⚠️ NOTE: Invalid dates are silently ignored - contact will use current timestamp
        createdAt: new Date('invalid-date-string'),
      }
    ];

    console.log('🚨 MIGRATION WARNING: About to override created_at timestamps!');
    console.log(`Migrating ${legacyContacts.length} contacts from legacy system...`);

    // ⚠️ THE CRITICAL PART: Set overrideCreatedAt to true
    const result = await smashsend.contacts.createBatch(legacyContacts, {
      overrideCreatedAt: true, // 🚨 ONLY for data migration!
      allowPartialSuccess: true,
      includeFailedContacts: true
    });

    console.log('✅ Migration completed!');
    console.log(`Created: ${result.summary.created}`);
    console.log(`Updated: ${result.summary.updated}`);
    console.log(`Failed: ${result.summary.failed}`);
    console.log(`Total: ${result.summary.total}`);

    // Handle any failures
    if (result.errors && result.errors.length > 0) {
      console.log('❌ Migration errors:');
      result.errors.forEach(error => {
        console.log(`  - ${error.email}: ${error.errors.map(e => e.message).join(', ')}`);
      });
    }

    // NOTE: Invalid createdAt values don't cause failures - they silently fallback to current timestamp
    console.log('📝 Note: Contacts with invalid createdAt dates were created with current timestamp');

    // Verify the contacts were created with correct timestamps
    console.log('\n📋 Verifying migration results...');
    for (const contact of result.contacts) {
      console.log(`✓ ${contact.properties.email}: created at ${contact.createdAt}`);
    }

  } catch (error) {
    console.error('💥 Migration failed:', error);
  }
}

// ❌ WRONG WAY - Don't do this for regular contacts
async function wrongWayExample() {
  const regularContacts = [
    { email: 'new-user@example.com', firstName: 'New', lastName: 'User' }
  ];

  // ❌ DON'T DO THIS - This will mess up your analytics!
  await smashsend.contacts.createBatch(regularContacts, {
    overrideCreatedAt: true // ❌ WRONG - Only for migration!
  });
}

// ✅ RIGHT WAY - Regular contact creation
async function rightWayExample() {
  const regularContacts = [
    { email: 'new-user@example.com', firstName: 'New', lastName: 'User' }
  ];

  // ✅ CORRECT - Let SMASHSEND set the creation timestamp
  await smashsend.contacts.createBatch(regularContacts, {
    allowPartialSuccess: true
    // overrideCreatedAt is omitted (defaults to false)
  });
}

// Run the migration (uncomment only when ready!)
// migrateContactsFromLegacySystem();

export {
  migrateContactsFromLegacySystem,
  wrongWayExample,
  rightWayExample
};
