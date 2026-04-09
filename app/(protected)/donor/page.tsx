"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/services/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/shared";

interface DonorData {
  id: string;
  full_name: string;
  blood_type: string;
  puede_donar_leche: boolean;
  description?: string;
  location?: string;
  created_at: string;
}

export default function DonorDashboard() {
  const router = useRouter();
  const [donor, setDonor] = useState<DonorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonorData = async () => {
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
        const { data, error: dbError } = await supabase
          .from("donors")
          .select("*")
          .eq("id", user.id)
          .single();

        if (dbError) {
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

    fetchDonorData();
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
          <h1 className="text-4xl font-bold">👤 Mi Perfil de Donante</h1>
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
                  {donor?.puede_donar_leche ? "✅ Sí" : "❌ No"}
                </p>
              </div>
              {donor?.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descripción</p>
                  <p className="text-base">{donor.description}</p>
                </div>
              )}
              {donor?.location && (
                <div>
                  <p className="text-sm text-muted-foreground">Ubicación Registrada</p>
                  <p className="text-sm bg-blue-50 px-3 py-2 rounded">
                    ✓ Ubicación activa
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push("/donor/update-profile")}
              >
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => router.push("/donor/find-banks")}
              >
                🔍 Buscar Bancos
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push("/donor/campaigns")}
              >
                📢 Ver Campañas
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push("/donor/history")}
              >
                📋 Mi Historial
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

          {/* Donabilidad */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Estado de Donación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 font-semibold">🩸 Donación de Sangre</p>
                  <p className="text-xs text-red-600 mt-1">
                    Tipo: <span className="font-semibold">{donor?.blood_type}</span>
                  </p>
                  <p className="text-xs text-red-600 mt-2">
                    Cuéntale a los bancos dónde estás y recibirás notificaciones cuando necesiten tu sangre.
                  </p>
                </div>
                <div className={`p-4 rounded-lg border ${
                  donor?.puede_donar_leche
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-sm font-semibold ${
                    donor?.puede_donar_leche ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {donor?.puede_donar_leche ? '🥛 Donación de Leche' : '🚫 No Puede Donar Leche'}
                  </p>
                  <p className={`text-xs mt-2 ${
                    donor?.puede_donar_leche ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {donor?.puede_donar_leche
                      ? 'Disponible para donar leche materna'
                      : 'No disponible para donar leche materna'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

