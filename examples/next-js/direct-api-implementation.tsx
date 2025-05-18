/**
 * Alternative approach using direct API calls instead of the SDK
 * This example shows how to interact with SMASHSEND API directly using fetch
 * which can be useful in environments with module loading restrictions.
 *
 * File: app/actions/newsletter-direct.ts
 */

'use server';

// Base URL and API key
const API_BASE_URL = 'https://api.smashsend.com';
const API_KEY = process.env.SMASHSEND_API_KEY || '';

// Helper to make API requests with proper headers and error handling
async function makeRequest(endpoint: string, method: string, data?: any) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'User-Agent': 'SMASHSEND-Node-Direct/1.0.0',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    // Parse the response JSON
    const responseData = await response.json();

    // Handle error responses
    if (!response.ok) {
      // Create an error object with useful properties
      const error = new Error(responseData.message || 'API request failed');
      (error as any).statusCode = response.status;
      (error as any).code = responseData.code;
      (error as any).requestId = responseData.requestId;
      throw error;
    }

    return responseData;
  } catch (error) {
    console.error(`API Request Error (${endpoint}):`, error);
    throw error;
  }
}

// Example function to create a contact
export async function subscribeToNewsletter(email: string, firstName: string) {
  try {
    // Validate inputs
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    if (!firstName || firstName.trim() === '') {
      return { success: false, message: 'Please provide your first name.' };
    }

    // Create contact via direct API call
    const contact = await makeRequest('/contacts', 'POST', {
      email,
      firstName,
      custom: {
        source: 'Newsletter Signup',
        signupDate: new Date().toISOString(),
      },
    });

    // Return success response
    return {
      success: true,
      contactId: contact.id,
    };
  } catch (error: any) {
    console.error('Error creating contact:', error);

    // Handle specific API errors
    if (error.statusCode === 409) {
      return { success: false, message: 'This email is already subscribed.' };
    }

    return {
      success: false,
      message: error.message || 'Failed to subscribe. Please try again.',
    };
  }
}

// Example function to send an email
export async function sendContactForm(email: string, name: string, message: string) {
  try {
    // Validate inputs
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    if (!message || message.trim() === '') {
      return { success: false, message: 'Please provide a message.' };
    }

    // Send email via direct API call
    const emailResult = await makeRequest('/emails', 'POST', {
      from: {
        email: process.env.FROM_EMAIL || 'contact@example.com',
        name: process.env.FROM_NAME || 'Contact Form',
      },
      to: process.env.CONTACT_EMAIL || 'support@example.com',
      subject: `Contact Form Message from ${name || email}`,
      text: `From: ${name} (${email})\n\n${message}`,
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>From:</strong> ${name} (${email})</p>
        <div style="margin-top: 20px; padding: 10px; border-left: 2px solid #ccc;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      `,
      tags: ['contact-form'],
    });

    return {
      success: true,
      messageId: emailResult.id,
    };
  } catch (error: any) {
    console.error('Error sending email:', error);

    return {
      success: false,
      message: error.message || 'Failed to send your message. Please try again.',
    };
  }
}
