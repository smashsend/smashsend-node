import { SmashSend, ContactCreateOptions, BatchContactsResponse } from '../src';

const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY || 'your-api-key-here');

async function batchContactsExample(): Promise<void> {
  console.log('🚀 SMASHSEND Batch Contacts TypeScript Example\n');

  // Strongly typed contacts data
  const contacts: ContactCreateOptions[] = [
    {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      customProperties: {
        company: 'Acme Corp',
        role: 'Developer',
        experience: 5
      }
    },
    {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      city: 'San Francisco',
      customProperties: {
        company: 'Tech Startup',
        role: 'Designer',
        experience: 3
      }
    },
    {
      email: 'invalid-email', // This will fail
      firstName: 'Invalid',
      lastName: 'User'
    }
  ];

  try {
    console.log('📦 Creating batch of contacts...');
    
    // Fully typed batch operation with all beautiful options
    const result: BatchContactsResponse = await smashsend.contacts.createBatch(contacts, {
      allowPartialSuccess: true,
      includeFailedContacts: true
    });

    console.log('\n✅ Batch operation completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Created: ${result.summary.created}`);
    console.log(`   • Updated: ${result.summary.updated}`);
    console.log(`   • Failed: ${result.summary.failed}`);
    console.log(`   • Total: ${result.summary.total}`);
    console.log(`   • Processing Time: ${result.summary.processingTime}ms`);
    console.log(`   • Request ID: ${result.requestId}`);

    // Type-safe error handling
    if (result.errors?.length) {
      console.log('\n❌ Errors with full type safety:');
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

    // Type-safe retry logic
    if (result.failedContacts?.length) {
      console.log('\n🔄 Type-safe retry logic:');
      
      const retryableContacts = result.failedContacts
        .filter(fc => fc.errors.some(e => e.retryable))
        .map(fc => fc.contact);

      if (retryableContacts.length > 0) {
        console.log(`Found ${retryableContacts.length} retryable contacts`);
        
        // Type-safe retry (all types are preserved!)
        // const retryResult = await smashsend.contacts.createBatch(retryableContacts);
      }
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.data) {
      console.error('Error details:', error.data);
    }
  }
}

// Advanced retry pattern with exponential backoff
async function advancedRetryPattern(contacts: ContactCreateOptions[]): Promise<BatchContactsResponse> {
  const maxRetries = 3;
  let attempt = 0;
  let remainingContacts = [...contacts];

  while (attempt < maxRetries && remainingContacts.length > 0) {
    attempt++;
    console.log(`\n🔄 Attempt ${attempt}/${maxRetries} with ${remainingContacts.length} contacts`);

    const result = await smashsend.contacts.createBatch(remainingContacts, {
      allowPartialSuccess: true,
      includeFailedContacts: true
    });

    console.log(`   ✅ Created: ${result.summary.created}, Failed: ${result.summary.failed}`);

    // Get retryable contacts for next attempt
    if (result.failedContacts?.length && attempt < maxRetries) {
      remainingContacts = result.failedContacts
        .filter(fc => fc.errors.some(e => e.retryable))
        .map(fc => fc.contact);

      if (remainingContacts.length > 0) {
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
        console.log(`   ⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } else {
      remainingContacts = [];
    }

    // If this was the last attempt or no retryable contacts, return final result
    if (attempt === maxRetries || remainingContacts.length === 0) {
      return result;
    }
  }

  throw new Error('Retry pattern failed to complete');
}

// Performance monitoring wrapper
async function monitoredBatchOperation(contacts: ContactCreateOptions[]): Promise<BatchContactsResponse> {
  const startTime = performance.now();
  
  console.log(`🚀 Starting monitored batch operation with ${contacts.length} contacts`);
  
  const result = await smashsend.contacts.createBatch(contacts, {
    allowPartialSuccess: true,
    includeFailedContacts: false // Optimize for performance
  });

  const endTime = performance.now();
  const totalTime = endTime - startTime;

  console.log(`📊 Performance Metrics:`);
  console.log(`   • Client time: ${totalTime.toFixed(2)}ms`);
  console.log(`   • Server time: ${result.summary.processingTime}ms`);
  console.log(`   • Network overhead: ${(totalTime - result.summary.processingTime).toFixed(2)}ms`);
  console.log(`   • Throughput: ${(contacts.length / totalTime * 1000).toFixed(2)} contacts/second`);

  return result;
}

// Run examples
async function main() {
  await batchContactsExample();
  
  console.log('\n🎯 Advanced Examples:');
  
  // Example with advanced retry pattern
  const testContacts: ContactCreateOptions[] = [
    { email: 'test1@example.com', firstName: 'Test1' },
    { email: 'test2@example.com', firstName: 'Test2' }
  ];
  
  try {
    await advancedRetryPattern(testContacts);
    console.log('✅ Advanced retry pattern completed');
  } catch (error) {
    console.log('❌ Advanced retry pattern failed:', (error as Error).message);
  }
  
  console.log('\n🎉 All TypeScript examples completed!');
}

if (require.main === module) {
  main().catch(console.error);
}

export { batchContactsExample, advancedRetryPattern, monitoredBatchOperation };
