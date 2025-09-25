const { SmashSend } = require('../dist/index.js');

const smashsend = new SmashSend({
  apiKey: process.env.SMASHSEND_API_KEY || 'your-api-key-here'
});

async function batchContactsExample() {
  console.log('🚀 SMASHSEND Batch Contacts Example\n');

  // Sample contacts data
  const contacts = [
    {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      customProperties: {
        company: 'Acme Corp',
        role: 'Developer'
      }
    },
    {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      city: 'San Francisco',
      customProperties: {
        company: 'Tech Startup',
        role: 'Designer'
      }
    },
    {
      email: 'invalid-email', // This will fail
      firstName: 'Invalid',
      lastName: 'User'
    },
    {
      email: 'bob.wilson@example.com',
      firstName: 'Bob',
      lastName: 'Wilson',
      city: 'Austin',
      customProperties: {
        company: 'Remote Co',
        role: 'Manager'
      }
    }
  ];

  try {
    console.log('📦 Creating batch of contacts...');
    
    // Basic batch creation with partial success
    const result = await smashsend.contacts.createBatch(contacts, {
      allowPartialSuccess: true,
      includeFailedContacts: true // Include failed contacts for easy retry
    });

    console.log('\n✅ Batch operation completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Created: ${result.summary.created}`);
    console.log(`   • Updated: ${result.summary.updated}`);
    console.log(`   • Failed: ${result.summary.failed}`);
    console.log(`   • Total: ${result.summary.total}`);
    console.log(`   • Processing Time: ${result.summary.processingTime}ms`);
    console.log(`   • Request ID: ${result.requestId}`);

    // Show successful contacts
    if (result.contacts.length > 0) {
      console.log('\n✅ Successfully created/updated contacts:');
      result.contacts.forEach((contact, index) => {
        console.log(`   ${index + 1}. ${contact.properties.email} (${contact.id})`);
      });
    }

    // Show errors
    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => {
        console.log(`   • Index ${error.index} (${error.email}):`);
        error.errors.forEach(err => {
          console.log(`     - ${err.code}: ${err.message}`);
          if (err.retryable) {
            console.log(`       → Retryable after ${err.retryAfter}s`);
          }
        });
      });
    }

    // Demonstrate retry functionality
    if (result.failedContacts && result.failedContacts.length > 0) {
      console.log('\n🔄 Retry Example:');
      
      const retryableContacts = result.failedContacts
        .filter(fc => fc.errors.some(e => e.retryable))
        .map(fc => fc.contact);

      if (retryableContacts.length > 0) {
        console.log(`Found ${retryableContacts.length} retryable contacts`);
        console.log('In a real scenario, you would retry these contacts after a delay');
        
        // Example retry (commented out to avoid actual retry in demo)
        // console.log('Retrying failed contacts...');
        // const retryResult = await smashsend.contacts.createBatch(retryableContacts);
        // console.log(`Retry result: ${retryResult.summary.created} created, ${retryResult.summary.failed} failed`);
      } else {
        console.log('No retryable contacts found');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.data) {
      console.error('Error details:', error.data);
    }
  }
}

// Performance example with larger batch
async function performanceExample() {
  console.log('\n\n🚀 Performance Example - Large Batch\n');

  // Generate 100 contacts
  const largeContactsBatch = Array.from({ length: 100 }, (_, i) => ({
    email: `user${i + 1}@example.com`,
    firstName: `User`,
    lastName: `${i + 1}`,
    customProperties: {
      batchNumber: '1',
      userIndex: i + 1
    }
  }));

  try {
    const startTime = Date.now();
    
    // Use default settings for optimal performance (no failedContacts)
    const result = await smashsend.contacts.createBatch(largeContactsBatch, {
      allowPartialSuccess: true,
      includeFailedContacts: false // Optimize response size
    });

    const clientTime = Date.now() - startTime;

    console.log(`📊 Performance Results:`);
    console.log(`   • Contacts processed: ${result.summary.total}`);
    console.log(`   • Server processing: ${result.summary.processingTime}ms`);
    console.log(`   • Total round-trip: ${clientTime}ms`);
    console.log(`   • Success rate: ${((result.summary.created + result.summary.updated) / result.summary.total * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Performance test error:', error.message);
  }
}

// Run examples
if (require.main === module) {
  batchContactsExample()
    .then(() => performanceExample())
    .then(() => console.log('\n🎉 All examples completed!'))
    .catch(console.error);
}

module.exports = { batchContactsExample, performanceExample };
