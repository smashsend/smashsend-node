import { SmashSend } from '../dist';
import Welcome from './WelcomeEmail';

(async () => {
  // Ensure you set SMASHSEND_API_KEY in env vars
  const apiKey = process.env.SMASHSEND_API_KEY;
  if (!apiKey) {
    console.error('Missing SMASHSEND_API_KEY env variable');
    process.exit(1);
  }

  const smashsend = new SmashSend(apiKey);

  const res = await smashsend.emails.send({
    from: 'Me <me@acme.com>',
    to: 'recipient@example.com',
    subject: 'Hello React email',
    react: Welcome({ firstName: 'John', product: 'MyApp' }),
  });

  console.log('Email response:', res);
})();
