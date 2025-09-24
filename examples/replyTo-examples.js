/**
 * Examples demonstrating dynamic replyTo functionality
 * 
 * This feature allows you to dynamically override reply-to addresses
 * when sending transactional emails, with fallback to template settings.
 */

const { SmashSend } = require('../dist/index.js');

const smashsend = new SmashSend({
  apiKey: process.env.SMASHSEND_API_KEY || 'your-api-key-here'
});

async function demonstrateReplyToFeatures() {
  try {
    console.log('🚀 Testing dynamic replyTo functionality...\n');

    // Example 1: Raw email with single replyTo
    console.log('1. Raw email with single replyTo:');
    const rawEmailSingle = await smashsend.emails.send({
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Test with Single Reply-To',
      html: '<h1>Hello!</h1><p>This email has a single reply-to address.</p>',
      replyTo: 'support@example.com' // Single email string
    });
    console.log('✅ Sent:', rawEmailSingle.messageId);

    // Example 2: Raw email with multiple replyTo addresses
    console.log('\n2. Raw email with multiple replyTo addresses:');
    const rawEmailMultiple = await smashsend.emails.send({
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Test with Multiple Reply-To',
      html: '<h1>Hello!</h1><p>This email has multiple reply-to addresses.</p>',
      replyTo: ['support@example.com', 'sales@example.com'] // Array of emails
    });
    console.log('✅ Sent:', rawEmailMultiple.messageId);

    // Example 3: Templated email without replyTo (uses template default)
    console.log('\n3. Templated email using template default replyTo:');
    const templatedDefault = await smashsend.emails.sendWithTemplate({
      template: 'welcome-email',
      to: 'recipient@example.com',
      variables: { name: 'John Doe' }
      // No replyTo specified - will use template's configured replyTo
    });
    console.log('✅ Sent:', templatedDefault.messageId);

    // Example 4: Templated email with dynamic single replyTo override
    console.log('\n4. Templated email with dynamic single replyTo override:');
    const templatedSingle = await smashsend.emails.sendWithTemplate({
      template: 'welcome-email',
      to: 'recipient@example.com',
      variables: { name: 'Jane Doe' },
      replyTo: 'custom-support@example.com' // Overrides template's replyTo
    });
    console.log('✅ Sent:', templatedSingle.messageId);

    // Example 5: Templated email with dynamic multiple replyTo override
    console.log('\n5. Templated email with dynamic multiple replyTo override:');
    const templatedMultiple = await smashsend.emails.sendWithTemplate({
      template: 'support-ticket',
      to: 'recipient@example.com',
      variables: { 
        ticketId: 'TICKET-12345',
        priority: 'High'
      },
      replyTo: ['urgent@example.com', 'escalation@example.com'] // Multiple overrides
    });
    console.log('✅ Sent:', templatedMultiple.messageId);

    console.log('\n🎉 All examples completed successfully!');
    console.log('\n📖 How it works:');
    console.log('   • For raw emails: replyTo is always used if provided');
    console.log('   • For templated emails: replyTo overrides template settings');
    console.log('   • If no replyTo provided: falls back to template configuration');
    console.log('   • Supports both single email strings and arrays of emails');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.data) {
      console.error('   Additional info:', error.data);
    }
    
    if (error.message.includes('api-key-here')) {
      console.log('\n💡 Tip: Set your SMASHSEND_API_KEY environment variable');
      console.log('   export SMASHSEND_API_KEY="your-actual-api-key"');
    }
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  demonstrateReplyToFeatures();
}

module.exports = { demonstrateReplyToFeatures };
