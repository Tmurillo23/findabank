'use client';

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
