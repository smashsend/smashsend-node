/**
 * Example Next.js Server Action using SMASHSEND SDK
 * File: app/actions/newsletter.ts
 */

'use server';

import { SmashSend } from '@smashsend/node';

// Initialize SmashSend client (only created once per server)
const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY || '');

export async function subscribeToNewsletter(email: string, firstName: string) {
  try {
    // Validate inputs
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    if (!firstName || firstName.trim() === '') {
      return { success: false, message: 'Please provide your first name.' };
    }

    // Create contact in SMASHSEND
    const contact = await smashsend.contacts.create({
      email: email,
      firstName: firstName,
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

/**
 * Example Next.js Client Component for the newsletter form
 * File: app/components/NewsletterForm.tsx
 */

('use client');

import { useState } from 'react';
import { subscribeToNewsletter } from '../actions/newsletter';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const result = await subscribeToNewsletter(email, firstName);
      if (result.success) {
        setStatus('success');
        setMessage('Thank you for subscribing to our newsletter!');
        setEmail('');
        setFirstName('');
      } else {
        setStatus('error');
        setMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {status === 'success' ? (
        <div className="flex flex-col items-center text-center p-4">
          <div className="h-12 w-12 text-green-500 mb-4">✓</div>
          <h3 className="text-xl font-medium mb-2">Subscription Successful!</h3>
          <p className="text-gray-600 mb-4">{message}</p>
          <button
            onClick={() => setStatus('idle')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Subscribe another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
              disabled={status === 'loading'}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              disabled={status === 'loading'}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center p-3 text-sm bg-red-50 text-red-600 rounded-md">
              <span className="mr-2">⚠️</span>
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
}
