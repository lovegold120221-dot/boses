/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import React, { useEffect, useState } from 'react';

export interface ExtendedErrorType {
  code?: number;
  message?: string;
  status?: string;
}

export default function ErrorScreen() {
  const { client } = useLiveAPIContext();
  const [error, setError] = useState<{ message?: string } | null>(null);

  useEffect(() => {
    function onError(error: ErrorEvent) {
      console.error(error);
      setError(error);
    }

    client.on('error', onError);

    return () => {
      client.off('error', onError);
    };
  }, [client]);

  const quotaErrorMessage =
    'Gemini Live API in AI Studio has a limited free quota each day. Come back tomorrow to continue.';

  let errorMessage = 'Something went wrong. Please try again.';
  let rawMessage: string | null = error?.message || null;
  let tryAgainOption = true;
  if (error?.message?.includes('RESOURCE_EXHAUSTED')) {
    errorMessage = quotaErrorMessage;
    rawMessage = null;
    tryAgainOption = false;
  }

  if (!error) {
    return <div className="hidden" />;
  }

  return (
    <div className="error-screen">
      <div className="text-[48px]">
        💔
      </div>
      <div
        className="error-message-container text-[22px] leading-[1.2] opacity-50"
      >
        {errorMessage}
      </div>
      {tryAgainOption ? (
        <button
          className="close-button"
          onClick={() => {
            setError(null);
          }}
        >
          Close
        </button>
      ) : null}
      {rawMessage ? (
        <div
          className="error-raw-message-container text-[15px] leading-[1.2] opacity-40"
        >
          {rawMessage}
        </div>
      ) : null}
    </div>
  );
}
