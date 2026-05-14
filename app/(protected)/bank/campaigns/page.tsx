'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/shared/services/supabase/client';
import { CampaignForm, CampaignList, CampaignSender } from '@/features/campaigns/components';
import { getBankCampaigns } from '@/features/campaigns/services';
import { Campaign } from '@/features/campaigns/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared';

export default function CampaignsDashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bankId, setBankId] = useState<string | null>(null);
  const [noBank, setNoBank] = useState(false);

  useEffect(() => {
    if (!noBank) return;

    const timer = setTimeout(() => {
      router.push('/bank/setup');
    }, 8000);

    return () => clearTimeout(timer);
  }, [noBank, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();

        // Obtener usuario autenticado
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        setBankId(user.id);

        // Verificar si el banco está configurado
        const { data: bancoData, error: bancoError } = await supabase
          .from('banco')
          .select('id')
          .eq('id', user.id)
          .single();

        if (bancoError || !bancoData) {
          setNoBank(true);
          setLoading(false);
          return;
        }

        // Obtener campañas del banco
        const bankCampaigns = await getBankCampaigns(user.id);
        setCampaigns(bankCampaigns);
      } catch (err) {
        console.error('Error completo:', err);
        let errorMessage = 'Error desconocido';

        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'object' && err !== null) {
          // Si es un objeto de error de Supabase, extraer el mensaje
          const errorObj = err as any;
          if (errorObj.message) {
            errorMessage = errorObj.message;
          } else if (errorObj.details) {
            errorMessage = errorObj.details;
          } else if (errorObj.hint) {
            errorMessage = errorObj.hint;
          }
        }

        setError(`Error cargando campañas: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleCampaignCreated = async () => {
    if (!bankId) return;
    
    try {
      const updatedCampaigns = await getBankCampaigns(bankId);
      setCampaigns(updatedCampaigns);
    } catch (err) {
      console.error('Error al actualizar campañas:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando campañas...</p>
      </div>
    );
  }

  if (noBank) {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-6">
            <h1 className="text-2xl font-bold text-yellow-900">Tu banco no está configurado</h1>
            <p className="mt-3 text-sm text-yellow-800">
              Para crear campañas necesitas completar la información de tu banco.
            </p>
            <p className="mt-3 text-sm text-yellow-700">
              Te llevaremos a la configuración en 8 segundos o puedes ir ahora mismo.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/bank/setup')}
                className="inline-flex items-center justify-center rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700 transition"
              >
                Ir a configuración del banco
              </button>
              <Link
                href="/bank"
                className="inline-flex items-center justify-center rounded-lg border border-yellow-600 px-4 py-2 text-sm font-semibold text-yellow-700 hover:bg-yellow-100 transition"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Campañas</h1>
        <p className="text-gray-600 mt-2">Crea y envía campañas a donantes cercanos</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {bankId && (
            <CampaignForm
              bankId={bankId}
              onSuccess={handleCampaignCreated}
              onError={(err) => setError(err)}
            />
          )}
          
          <CampaignList
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            onSelectCampaign={setSelectedCampaignId}
          />
        </div>

        <div className="space-y-6">
          <CampaignSender
            campaignId={selectedCampaignId}
            bankId={bankId || undefined}
            onSuccess={() => {
              alert('¡Campaña enviada exitosamente!');
              setSelectedCampaignId(undefined);
            }}
            onError={(err) => setError(err)}
          />

          {selectedCampaignId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Campaña Seleccionada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 break-all">{selectedCampaignId}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
