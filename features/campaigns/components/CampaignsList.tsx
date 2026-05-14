"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/shared/services/supabase/client";
import { getBankCampaigns } from "@/features/campaigns/services";
import type { Campaign } from "@/features/campaigns/types";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared";
import { CampaignForm } from "./CampaignForm";

export function CampaignsList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [bankId, setBankId] = useState<string>("");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError("No estás autenticado");
          setLoading(false);
          return;
        }

        setBankId(user.id);

        const campaignsData = await getBankCampaigns(user.id);
        setCampaigns(campaignsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando campañas");
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);


  const handleCampaignCreated = (newCampaign: Campaign) => {
    setCampaigns([newCampaign, ...campaigns]);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando campañas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex items-start justify-center pt-10">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold"> Mis Campañas</h1>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {showForm ? "Cancelar" : "+ Crear Nueva Campaña"}
            </Button>
          </div>

          {/* Formulario desplegable */}
          {showForm && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-2">
              <CampaignForm bankId={bankId} onCampaignCreated={handleCampaignCreated} />
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Lista de campañas */}
          <div className="space-y-4">
            {campaigns.length === 0 ? (
              <Card>
                <CardContent className="pt-8 text-center">
                  <p className="text-muted-foreground mb-4">No hay campañas aún</p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Crear Primera Campaña
                  </Button>
                </CardContent>
              </Card>
            ) : (
              campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{campaign.nombre}</CardTitle>
                        <CardDescription>{campaign.descripcion}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {campaign.ubicacion}
                        </p>
                        <p className="text-sm text-muted-foreground">
                           {new Date(campaign.fecha).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

