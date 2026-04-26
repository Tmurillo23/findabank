"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/shared/services/supabase/client";
import { fetchDonorData } from "@/features/donors/services/donors";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/shared";
import Link from "next/link";

interface DonorData {
  id: string;
  full_name: string;
  blood_type: string;
  puede_donar_leche: boolean;
  description?: string;
  created_at: string;
}

export default function DonorDashboard() {
  const [donor, setDonor] = useState<DonorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonorDataHandler = async () => {
      try {
        const supabase = createClient();

        // Obtener usuario autenticado
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("No estás autenticado");
          return;
        }

        // Obtener datos del donante
        const data = await fetchDonorData(user.id);

        if (!data) {
          setError("No se encontraron datos del donante");
          return;
        }

        setDonor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDonorDataHandler();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando tu perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold"> Mi Perfil de Donante</h1>
          <p className="mt-2 text-muted-foreground">
            Bienvenido, {donor?.full_name}
          </p>
        </div>

        {/* Grid de contenido */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Información Personal */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre Completo</p>
                <p className="text-lg font-semibold">{donor?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Sangre</p>
                <p className="text-lg font-semibold">{donor?.blood_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Puedo donar leche materna?
                </p>
                <p className="text-lg font-semibold">
                  {donor?.puede_donar_leche ? "Sí" : "No"}
                </p>
              </div>
              {donor?.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descripcin</p>
                  <p className="text-base">{donor.description}</p>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => (window.location.href = "/donor/update-profile")}
              >
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/donor/nearby-banks">
                <Button>Ver Bancos Cercanos</Button>
              </Link>
              <Button variant="outline" className="w-full">
                Ver Campañas
              </Button>
              <Button variant="outline" className="w-full">
                Mi Historial
              </Button>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Donaciones</p>
              </div>
              <div className="text-center border-t pt-4">
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Bancos Visitados</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

