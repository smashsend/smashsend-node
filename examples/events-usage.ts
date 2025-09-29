/**
 * SMASHSEND Events API Examples
 * 
 * This example demonstrates how to use the new events.send() and events.sendBatch() methods
 * to track user events and trigger automations in your SMASHSEND workspace.
 */

import { SmashSend } from '@smashsend/node';

const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY!);

async function sendSingleEvent() {
  try {
    const response = await smashsend.events.send({
      event: 'user.signup',
      identify: {
        email: 'user@example.com',
        traits: {
          firstName: 'John',
          lastName: 'Doe',
          plan: 'premium',
          signupSource: 'website'
        }
      },
      properties: {
        campaign: 'summer-sale',
        referrer: 'google',
        utm_source: 'social'
      }
    });

    console.log(`✅ Event sent successfully with ID: ${response.messageId}`);
  } catch (error) {
    console.error('❌ Failed to send event:', error);
  }
}

async function sendBatchEvents() {
  const events = [
    {
      event: 'page.view',
      identify: { 
        email: 'user1@example.com',
        traits: { firstName: 'Alice' }
      },
      properties: { 
        page: '/pricing',
        duration: 45000 
      }
    },
    {
      event: 'button.click',
      identify: { 
        email: 'user2@example.com',
        traits: { firstName: 'Bob' }
      },
      properties: { 
        button: 'signup',
        location: 'header'
      }
    },
    {
      event: 'purchase.completed',
      identify: { 
        email: 'user3@example.com',
        traits: { firstName: 'Carol' }
      },
      properties: { 
        orderId: 'order_123',
        amount: 99.99,
        currency: 'USD'
      }
    }
  ];

  try {
    const result = await smashsend.events.sendBatch(events);
    
    console.log(`📊 Batch results:`);
    console.log(`  ✅ Accepted: ${result.accepted}`);
    console.log(`  ❌ Failed: ${result.failed}`);
    console.log(`  🔄 Duplicated: ${result.duplicated}`);

    // Handle failed events
    if (result.errors?.length > 0) {
      console.log('\n⚠️  Failed events:');
      result.errors.forEach(error => {
        console.log(`  Event ${error.index}:`, error.errors.map(e => e.message).join(', '));
      });
    }

    // Show successful events
    if (result.events?.length > 0) {
      console.log('\n✅ Successful events:');
      result.events.forEach(event => {
        console.log(`  Index ${event.index}: ${event.messageId} (${event.status})`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to send batch events:', error);
  }
}

async function sendEventWithCustomDeduplication() {
  try {
    const response = await smashsend.events.send({
      event: 'order.created',
      identify: {
        email: 'customer@example.com',
        traits: {
          customerId: 'cust_12345'
        }
      },
      properties: {
        orderId: 'order_67890',
        amount: 149.99
      },
      // Custom messageId prevents duplicate processing if this exact event is sent again
      messageId: 'order_67890_created'
    });

    console.log(`✅ Order event sent with ID: ${response.messageId}`);
  } catch (error) {
    console.error('❌ Failed to send order event:', error);
  }
}

// Run examples
async function main() {
  console.log('🚀 SMASHSEND Events API Examples\n');
  
  console.log('1. Sending single event...');
  await sendSingleEvent();
  
  console.log('\n2. Sending batch events...');
  await sendBatchEvents();
  
  console.log('\n3. Sending event with custom deduplication...');
  await sendEventWithCustomDeduplication();
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  sendSingleEvent,
  sendBatchEvents,
  sendEventWithCustomDeduplication
};
