/**
 * Example Next.js API Route using SMASHSEND SDK
 *
 * This file demonstrates how to use the SMASHSEND SDK in a Next.js API route
 * for sending emails from your Next.js application.
 *
 * File: /pages/api/send-email.js
 */

import { SMASHSEND } from '@smashsend/node';

// Initialize the SMASHSEND client outside of the handler
// to reuse the instance across requests
const smashsend = new SMASHSEND(process.env.SMASHSEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, message, name } = req.body;

    // Validate required fields
    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send the email using SMASHSEND
    const result = await smashsend.emails.send({
      from: {
        email: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
        name: process.env.FROM_NAME || 'Your Company',
      },
      to: to,
      subject: subject,
      text: message,
      html: `<div>
        <h1>${subject}</h1>
        <p>${message}</p>
        ${name ? `<p>From: ${name}</p>` : ''}
        <hr />
        <p><small>Sent from our website contact form</small></p>
      </div>`,
      tags: ['contact-form', 'website'],
    });

    // Return success response
    return res.status(200).json({
      success: true,
      messageId: result.id,
    });
  } catch (error) {
    console.error('Error sending email:', error);

    // Return appropriate error response
    return res.status(500).json({
      success: false,
      error: error.message,
      code: error.code || 'unknown_error',
    });
  }
}
