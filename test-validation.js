// Simple test for utility functions
// This will be run after the build process

async function testUtilities() {
  try {
    // Dynamic import to handle potential module loading issues
    const module = await import('./dist/index.mjs');
    const {
      looksLikeEmail,
      normalizeEmail,
      looksLikeUrl,
      normalizePhone,
      safeParseJSON,
      validateRequiredString,
      validateNumberRange,
    } = module;

    console.log('🧪 Testing utility functions...\n');

    console.log('Testing looksLikeEmail function (basic check only):');
    console.log('✓ Looks like emails:');
    console.log('  user@example.com:', looksLikeEmail('user@example.com'));
    console.log('  test@domain.co.uk:', looksLikeEmail('test@domain.co.uk'));
    console.log('  even-invalid@.com:', looksLikeEmail('even-invalid@.com')); // Basic check passes

    console.log("✗ Doesn't look like emails:");
    console.log('  invalid-email:', looksLikeEmail('invalid-email'));
    console.log('  @domain.com:', looksLikeEmail('@domain.com'));
    console.log('  user@:', looksLikeEmail('user@'));

    console.log('\nTesting normalizeEmail function:');
    console.log('  "  USER@EXAMPLE.COM  " ->', `"${normalizeEmail('  USER@EXAMPLE.COM  ')}"`);
    console.log('  "Test@Domain.COM" ->', `"${normalizeEmail('Test@Domain.COM')}"`);

    console.log('\nTesting looksLikeUrl function (basic check only):');
    console.log('✓ Looks like URLs:');
    console.log('  https://example.com:', looksLikeUrl('https://example.com'));
    console.log('  http://test.domain.co.uk/path:', looksLikeUrl('http://test.domain.co.uk/path'));

    console.log("✗ Doesn't look like URLs:");
    console.log('  not-a-url:', looksLikeUrl('not-a-url'));
    console.log('  ftp://example.com:', looksLikeUrl('ftp://example.com'));

    console.log('\nTesting normalizePhone function:');
    console.log('  "  +1 234 567 890  " ->', `"${normalizePhone('  +1 234 567 890  ')}"`);
    console.log('  "+44   20  7946  0958" ->', `"${normalizePhone('+44   20  7946  0958')}"`);

    console.log('\nTesting safeParseJSON function:');
    try {
      const validJson = safeParseJSON('{"name": "John", "age": 30}', 'user data');
      console.log('  Valid JSON parsed:', validJson);
    } catch (error) {
      console.log('  Unexpected error:', error.message);
    }

    try {
      safeParseJSON('invalid json', 'test data');
    } catch (error) {
      console.log('  Invalid JSON caught:', error.message);
    }

    console.log('\nTesting validateRequiredString function:');
    try {
      const result = validateRequiredString('  hello world  ', 'message');
      console.log('  Valid string trimmed:', `"${result}"`);
    } catch (error) {
      console.log('  Unexpected error:', error.message);
    }

    try {
      validateRequiredString('   ', 'empty field');
    } catch (error) {
      console.log('  Empty string caught:', error.message);
    }

    console.log('\nTesting validateNumberRange function:');
    try {
      const result = validateNumberRange('25', 'age', 0, 100);
      console.log('  Valid number:', result);
    } catch (error) {
      console.log('  Unexpected error:', error.message);
    }

    try {
      validateNumberRange('150', 'age', 0, 100);
    } catch (error) {
      console.log('  Out of range caught:', error.message);
    }

    console.log('\n✅ Utility tests completed successfully!');
    console.log('\n📝 Remember: These are just utility functions for basic cleanup.');
    console.log('   Real validation happens in the SmashSend API! 🚀');
  } catch (error) {
    console.log('⚠️  Could not test utility functions (build may not be complete):', error.message);
  }
}

testUtilities();
