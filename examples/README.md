# SMASHSEND SDK Examples

This directory contains examples of how to use the SMASHSEND Node.js SDK in different environments and frameworks.

## Examples Overview

### Basic TypeScript Usage

- [`typescript-usage.ts`](./typescript-usage.ts) - Shows how to use the SDK with TypeScript, including sending emails with various options and handling errors.

### Framework Integrations

#### Express.js

- [`express/server.js`](./express/server.js) - Demonstrates integrating the SDK with an Express.js application to create API endpoints for sending emails and managing contacts.

#### Next.js

- [`next-js/api-route.js`](./next-js/api-route.js) - Shows how to use the SDK in a Next.js API route for handling email sending from a Next.js application.

## Running the Examples

### Prerequisites

- Node.js installed (v14.0.0 or higher)
- A SMASHSEND API key

### Setup

1. Install the SMASHSEND SDK:

   ```bash
   npm install @smashsend/node
   ```

2. For framework-specific examples, install the required dependencies:

   **Express.js:**

   ```bash
   npm install express body-parser
   ```

   **Next.js:**

   ```bash
   # This assumes you already have a Next.js project
   npm install @smashsend/node
   ```

3. Set your API key:
   ```bash
   # For development only, use environment variables in production
   export SMASHSEND_API_KEY="your-api-key"
   ```

### Running the Express.js Example

```bash
cd examples/express
node server.js
```

Then you can test the API endpoints using tools like cURL or Postman:

```bash
curl -X POST http://localhost:3000/api/send-welcome \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"John","lastName":"Doe"}'
```

### Testing the Next.js API Route

Place the API route file in your Next.js project's `pages/api` directory and make requests to it from your frontend or test with API testing tools.

## Best Practices

1. **API Key Security**:

   - Never hard-code API keys in your code
   - Use environment variables or secure secret management
   - In production, implement proper access controls

2. **Error Handling**:

   - Always implement proper error handling as shown in the examples
   - Consider implementing retry logic for transient failures

3. **Performance**:

   - Initialize the SMASHSEND client once and reuse the instance
   - For high-volume applications, consider implementing queue systems

4. **Debugging**:
   - Use the debug mode during development: `smashsend.setDebugMode(true)`
   - Disable debug mode in production

## Additional Resources

- [SMASHSEND API Documentation](https://smashsend.com/docs/api)
- [SDK GitHub Repository](https://github.com/smashsend/smashsend-node)
- [npm Package](https://www.npmjs.com/package/@smashsend/node)
