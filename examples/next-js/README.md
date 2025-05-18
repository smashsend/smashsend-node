# Next.js Integration with SMASHSEND

This directory contains examples of using SMASHSEND with Next.js applications.

## Integration Options

There are two main ways to integrate SMASHSEND with Next.js:

### 1. Using the SDK (Preferred when possible)

Use the `@smashsend/node` SDK directly in your server components, API routes, or server actions. See `api-route.js` and `server-action.tsx` for examples.

**Advantages:**

- Full type safety
- Access to all SDK features
- Built-in error handling and retries

**Potential Challenges:**

- Some Next.js deployment environments may have issues importing the package
- Edge runtime is not supported (as it doesn't allow Node.js APIs)

### 2. Direct API Calls

Make direct HTTP requests to the SMASHSEND API without using the SDK. See `direct-api-implementation.tsx` for an example.

**Advantages:**

- Works in all environments including Edge runtime
- No additional dependencies
- Can be easier to debug

**Disadvantages:**

- No automatic type checking
- No built-in retries and advanced features
- Need to implement error handling manually

## Troubleshooting Common Issues

### Module Import Errors

If you see errors like:

```
Failed to load "@smashsend/package.json" from "@smashsend/node"
```

This usually happens because:

1. **Incorrect Import:** Make sure you're importing using the correct name - the SDK class is named `SMASHSEND` (all caps), not `SmashSend`.

2. **Edge Runtime:** If you're using Edge runtime, switch to direct API calls as shown in `direct-api-implementation.tsx`.

3. **Next.js Configuration:** Add the module to your transpilation configuration in `next.config.js`:

```js
module.exports = {
  transpilePackages: ['@smashsend/node'],
};
```

### API Key Issues

1. Make sure your API key is set in environment variables
2. Check that it's being correctly loaded in your application
3. Verify the key has the necessary permissions

## Best Practices

1. **Initialize the client once** outside request handlers for better performance

2. **Use environment variables** for the API key:

   ```
   SMASHSEND_API_KEY=your_api_key
   ```

3. **Add proper error handling** to gracefully handle API issues

4. **Use the server component pattern** for sensitive operations to keep your API key secure

5. For better DX, create a provider or service that handles the SMASHSEND instance:

   ```typescript
   // lib/smashsend.ts
   import { SMASHSEND } from '@smashsend/node';

   export const getSmashSendClient = () => {
     return new SMASHSEND(process.env.SMASHSEND_API_KEY || '');
   };
   ```
