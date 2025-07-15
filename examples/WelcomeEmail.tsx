import * as React from 'react';

export default function Welcome({ firstName, product }: { firstName: string; product: string }) {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.4 }}>
      <h1>Welcome, {firstName}!</h1>
      <p>
        Thanks for trying <strong>{product}</strong>. We’re thrilled to have you on board.
      </p>
    </div>
  );
}
