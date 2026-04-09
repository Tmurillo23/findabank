'use client';

import { Campaign } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

interface CampaignListProps {
  campaigns: Campaign[];
  selectedCampaignId?: string;
  onSelectCampaign?: (campaignId: string) => void;
}

export function CampaignList({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
}: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campañas</CardTitle>
          <CardDescription>No hay campañas creadas aún</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campañas ({campaigns.length})</CardTitle>
        <CardDescription>Selecciona una campaña para enviarla</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => onSelectCampaign?.(campaign.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedCampaignId === campaign.id
                  ? 'bg-blue-50 border-blue-300'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{campaign.nombre}</h3>
                  {campaign.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">{campaign.descripcion}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Creada el {new Date(campaign.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
