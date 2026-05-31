
'use client';

import { useEffect } from 'react';
import { AppError } from '@/features/AppErrors';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error('Global error caught:', error);
  }, [error]);

  const appError = error instanceof AppError ? error : null;
  const statusCode = appError?.statusCode || 500;
  const message = appError?.message || 'An unexpected error occurred';
  const errorCode = appError?.errorCode || 'ERR_UNKNOWN';

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
              Oops, algo salió mal
            </h1>

            <p className="text-slate-600 text-center mb-4">
              {message}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-slate-100 rounded text-xs text-slate-700 font-mono break-words">
                <p className="font-semibold mb-1">Error Code: {errorCode}</p>
                <p className="mb-2">Status: {statusCode}</p>
                {error.digest && <p>Digest: {error.digest}</p>}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => reset()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded transition-colors"
              >
                Ir al inicio
              </button>
            </div>

            {appError?.isRetryable && (
              <p className="text-xs text-blue-600 text-center mt-4">
                Este error puede ser temporal. Intenta nuevamente.
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

