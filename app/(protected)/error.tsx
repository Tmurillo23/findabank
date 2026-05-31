'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AuthenticationError,
  AuthorizationError,
  AppError,
} from '@/features/AppErrors';

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log to error reporting service
    console.error('Protected route error:', error);

    // Redirect to login if authentication error
    if (error instanceof AuthenticationError) {
      router.push('/auth/login');
    }
  }, [error, router]);

  const appError = error instanceof AppError ? error : null;
  const isAuthError = error instanceof AuthenticationError;
  const isAuthzError = error instanceof AuthorizationError;

  if (isAuthError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Sesión expirada
          </h1>

          <p className="text-slate-600 text-center mb-6">
            Tu sesión ha expirado. Por favor, inicia sesión nuevamente para continuar.
          </p>

          <button
            onClick={() => router.push('/auth/login')}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (isAuthzError) {
    return (
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Acceso denegado
          </h1>

          <p className="text-slate-600 text-center mb-6">
            No tienes permiso para acceder a este recurso.
          </p>

          <button
            onClick={() => router.back()}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  const message = appError?.message || 'Ocurrió un error al cargar esta página';

  return (
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
          Error
        </h1>

        <p className="text-slate-600 text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            Reintentar
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded transition-colors"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

