'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { createCampaign } from '../services/campaign-creation';
import { CreateCampaignInput } from '../types';

interface CampaignFormProps {
  bankId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function CampaignForm({ bankId, onSuccess, onError }: CampaignFormProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!nombre.trim()) {
        throw new Error('El nombre de la campaña es requerido');
      }

      const input: CreateCampaignInput = {
        banco_id: bankId,
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
      };

      await createCampaign(input);
      
      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la campaña';
      console.error('Campaign creation error:', err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Campaña</CardTitle>
        <CardDescription>Crea una nueva campaña para enviar a donantes</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Campaña *</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Campaña de donación de sangre O+"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el propósito de la campaña..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              rows={4}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando campaña...' : 'Crear Campaña'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
