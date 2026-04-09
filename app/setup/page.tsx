'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSetupDatabase = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error desconocido');
      }

      setResult(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Configuración de Base de Datos</CardTitle>
          <CardDescription>
            Configura las tablas necesarias para que FindABank funcione correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Configuración Requerida</h3>
            <p className="text-yellow-700 text-sm mb-3">
              Para que las campañas funcionen, necesitas configurar la base de datos.
              Asegúrate de tener la <code className="bg-yellow-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> en tu archivo <code className="bg-yellow-100 px-1 rounded">.env.local</code>.
            </p>
            <p className="text-yellow-700 text-sm">
              Obtén la clave desde: <a href="https://app.supabase.com/project/_/settings/api" target="_blank" rel="noopener noreferrer" className="underline">Supabase Settings → API</a>
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">¿Qué se va a crear?</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Tabla <code className="bg-gray-100 px-1 rounded">campaigns</code> con campos necesarios</li>
              <li>Índices para mejor rendimiento</li>
              <li>Políticas de seguridad (RLS)</li>
              <li>Triggers automáticos para timestamps</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
              <p className="font-semibold">✅ Configuración exitosa!</p>
              <p>{result.message}</p>
              {result.tables_created && (
                <p className="text-sm mt-2">Tablas creadas: {result.tables_created.join(', ')}</p>
              )}
              <div className="mt-4">
                <a
                  href="/bank/campaigns"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Ir a Gestión de Campañas →
                </a>
              </div>
            </div>
          )}

          <Button
            onClick={handleSetupDatabase}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Configurando base de datos...' : 'Configurar Base de Datos'}
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>O configura manualmente ejecutando el SQL en el editor de Supabase</p>
            <p>Archivo: <code className="bg-gray-100 px-1 rounded">supabase_setup.sql</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}