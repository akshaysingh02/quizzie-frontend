import React from 'react'
import { useLocation } from 'react-router-dom';

export default function ThankYouPage() {
    const { state } = useLocation();
  return (
    <div>
      <h1>{state.message}</h1>
      {state.data && (
        <pre>{JSON.stringify(state.data, null, 2)}</pre>
      )}
    </div>
  );
}
