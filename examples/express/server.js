/**
 * Example Express.js server integrating SmashSend SDK
 * This example shows how to integrate the SDK into an Express application
 * for sending transactional emails via API endpoints.
 */

const express = require('express');
const bodyParser = require('body-parser');
const { SmashSend } = require('@smashsend/node');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Configure Express to parse JSON bodies
app.use(bodyParser.json());

// Initialize SmashSend client with your API key
// In production, use environment variables for sensitive data
const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY || 'your-api-key');

// Enable debug mode during development
if (process.env.NODE_ENV !== 'production') {
  smashsend.setDebugMode(true);
}

// Example API endpoint to send a welcome email
app.post('/api/send-welcome', async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Send welcome email
    const result = await smashsend.emails.send({
      from: {
        email: 'welcome@yourcompany.com',
        name: 'Your Company',
      },
      to: {
        email: email,
        name: firstName ? `${firstName} ${lastName || ''}` : undefined,
      },
      subject: 'Welcome to Our Service!',
      text: `Hello ${firstName || 'there'},\n\nWelcome to our service! We're excited to have you on board.`,
      html: `
        <h1>Welcome to Our Service!</h1>
        <p>Hello ${firstName || 'there'},</p>
        <p>We're excited to have you join us! Here's what you can do next:</p>
        <ul>
          <li>Complete your profile</li>
          <li>Explore our features</li>
          <li>Check our documentation</li>
        </ul>
        <p>If you have any questions, feel free to reply to this email.</p>
      `,
      tags: ['welcome', 'onboarding'],
    });

    res.json({
      success: true,
      messageId: result.id,
      status: result.status,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code || 'unknown_error',
    });
  }
});

// API endpoint to add a subscriber to a list
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, firstName, lastName, interests } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Create or update contact
    const contact = await smashsend.contacts.create({
      email,
      firstName,
      lastName,
      custom: {
        interests: Array.isArray(interests) ? interests.join(', ') : interests,
        subscribeDate: new Date().toISOString(),
      },
    });

    res.json({
      success: true,
      contactId: contact.id,
    });
  } catch (error) {
    console.error('Failed to subscribe contact:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code || 'unknown_error',
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`SmashSend example server listening at http://localhost:${port}`);
});
