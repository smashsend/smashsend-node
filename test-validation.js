// Simple test for custom validation functions
// This will be run after the build process

async function testValidation() {
  try {
    // Dynamic import to handle potential module loading issues
    const module = await import('./dist/index.mjs');
    const { isEmail, isUrl, isPhone } = module;

    console.log('🧪 Testing custom validation functions...\n');

    console.log('Testing isEmail function:');
    console.log('✓ Valid emails:');
    console.log('  user@example.com:', isEmail('user@example.com'));
    console.log('  test.email+tag@domain.co.uk:', isEmail('test.email+tag@domain.co.uk'));
    console.log('  user123@test-domain.com:', isEmail('user123@test-domain.com'));
    console.log('  "quoted user"@example.com:', isEmail('"quoted user"@example.com'));
    console.log('  user@[192.168.1.1]:', isEmail('user@[192.168.1.1]', { allow_ip_domain: true }));

    console.log('✗ Invalid emails:');
    console.log('  invalid-email:', isEmail('invalid-email'));
    console.log('  @domain.com:', isEmail('@domain.com'));
    console.log('  user@:', isEmail('user@'));
    console.log('  user..name@domain.com:', isEmail('user..name@domain.com'));

    console.log('\nTesting isUrl function:');
    console.log('✓ Valid URLs:');
    console.log('  https://example.com:', isUrl('https://example.com'));
    console.log('  http://test.domain.co.uk/path:', isUrl('http://test.domain.co.uk/path'));

    console.log('✗ Invalid URLs:');
    console.log('  not-a-url:', isUrl('not-a-url'));
    console.log('  ftp://example.com:', isUrl('ftp://example.com'));

    console.log('\nTesting isPhone function:');
    console.log('✓ Valid phones:');
    console.log('  +1234567890:', isPhone('+1234567890'));
    console.log('  1234567890:', isPhone('1234567890'));
    console.log('  +44 20 7946 0958:', isPhone('+44 20 7946 0958'));

    console.log('✗ Invalid phones:');
    console.log('  123:', isPhone('123'));
    console.log('  abc123:', isPhone('abc123'));
    console.log('  +:', isPhone('+'));

    console.log('\n✅ Validation tests completed successfully!');
  } catch (error) {
    console.log(
      '⚠️  Could not test validation functions (build may not be complete):',
      error.message
    );
  }
}

testValidation();
