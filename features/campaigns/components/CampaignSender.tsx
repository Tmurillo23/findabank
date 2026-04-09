'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { UserType, SendCampaignInput } from '../types';
import { sendCampaign } from '../services/campaign-creation';

interface CampaignSenderProps {
  campaignId?: string;
  bankId?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

type SendMethod = 'by-type' | 'manual-emails';

export function CampaignSender({ campaignId, bankId, onSuccess, onError }: CampaignSenderProps) {
  const [sendMethod, setSendMethod] = useState<SendMethod>('by-type');
  const [userType, setUserType] = useState<UserType>('donors');
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // Debug: mostrar estado inicial
  useEffect(() => {
    console.log('CampaignSender initialized:', { campaignId, sendMethod, userType });
  }, [campaignId, sendMethod, userType]);

  const handleSend = async () => {
    if (!campaignId) {
      setError('Por favor selecciona una campaña primero');
      return;
    }

    let emailList: string[] | undefined = undefined;

    // Si es por emails manuales, validar
    if (sendMethod === 'manual-emails') {
      emailList = emails
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e.length > 0);

      if (emailList.length === 0) {
        setError('Por favor ingresa al menos un email');
        return;
      }

      // Validación básica de emails
      const invalidEmails = emailList.filter((e) => !e.includes('@'));
      if (invalidEmails.length > 0) {
        setError(`Emails inválidos: ${invalidEmails.join(', ')}`);
        return;
      }
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const input: SendCampaignInput = {
        campaign_id: campaignId,
        user_type: userType,
        radius_km: 0,
        emails: emailList, // undefined si es por tipo, array si es manual
      };

      const response = await sendCampaign(input);
      setResult(response);
      if (sendMethod === 'manual-emails') {
        setEmails(''); // Limpiar después de enviar
      }
      onSuccess?.(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar la campaña';
      console.error('Campaign send error:', err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Campaña</CardTitle>
        <CardDescription>Elige cómo enviar la campaña</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Método de envío */}
        <div className="space-y-3">
          <Label>¿Cómo deseas enviar?</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="by-type"
                checked={sendMethod === 'by-type'}
                onChange={(e) => setSendMethod(e.target.value as SendMethod)}
                disabled={loading}
              />
              <div>
                <p className="font-medium">Por tipo de usuario</p>
                <p className="text-sm text-gray-500">Envía a todos los donantes o bancos</p>
              </div>
            </label>

            <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="manual-emails"
                checked={sendMethod === 'manual-emails'}
                onChange={(e) => setSendMethod(e.target.value as SendMethod)}
                disabled={loading}
              />
              <div>
                <p className="font-medium">Emails específicos</p>
                <p className="text-sm text-gray-500">Ingresa emails manualmente</p>
              </div>
            </label>
          </div>
        </div>

        {/* Opción 1: Por tipo */}
        {sendMethod === 'by-type' && (
          <div className="space-y-2 p-3 bg-blue-50 rounded-md">
            <Label>Tipo de Usuario</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="donors"
                  checked={userType === 'donors'}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  disabled={loading}
                />
                <span>Donantes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="banks"
                  checked={userType === 'banks'}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  disabled={loading}
                />
                <span>Bancos</span>
              </label>
            </div>
          </div>
        )}

        {/* Opción 2: Emails manuales */}
        {sendMethod === 'manual-emails' && (
          <div className="space-y-2 p-3 bg-green-50 rounded-md">
            <Label htmlFor="emails">Destinatarios</Label>
            <textarea
              id="emails"
              placeholder="juan@gmail.com, maria@gmail.com, carlos@gmail.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              disabled={loading || !campaignId}
              className="w-full px-3 py-2 border border-input rounded-md bg-white text-sm font-mono resize-none"
              rows={5}
            />
            <p className="text-xs text-gray-500">
              Separa los emails con comas. Se validarán automáticamente.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        {result && (
          <div
            className={`px-4 py-3 rounded text-sm ${
              result.success
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            }`}
          >
            <p className="font-semibold">Resultado del envío:</p>
            <p>Enviados: {result.sentCount}</p>
            {result.failedCount > 0 && <p>No enviados: {result.failedCount}</p>}
            {result.errors && (
              <div className="mt-2 text-xs space-y-1">
                {result.errors.map((err: string, idx: number) => (
                  <p key={idx}>• {err}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <Button onClick={handleSend} disabled={loading || !campaignId} className="w-full">
          {loading ? 'Enviando campaña...' : 'Enviar Campaña'}
        </Button>
      </CardContent>
    </Card>
  );
}
