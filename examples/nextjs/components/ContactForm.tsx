'use client';

import { useState } from 'react';
import { createContact } from '../actions';

export default function ContactForm() {
  const [formState, setFormState] = useState<{
    submitting: boolean;
    error?: string;
    success?: boolean;
  }>({
    submitting: false,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState({ submitting: true });

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createContact(formData);

      if (result.success) {
        setFormState({
          submitting: false,
          success: true,
        });
        e.currentTarget.reset();
      } else {
        setFormState({
          submitting: false,
          error: result.error,
        });
      }
    } catch (error) {
      setFormState({
        submitting: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Subscribe to our newsletter</h2>

      {formState.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Thanks for subscribing!</div>
      )}

      {formState.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{formState.error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={formState.submitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        >
          {formState.submitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}
