"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/services/supabase/client";
import { BloodStockEditor, MilkStockEditor } from "@/features/banks/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared";

interface BankData {
  id: string;
  nombre: string;
  tipo: string;
  descripcion?: string;
  direccion: string;
  location?: string;
  created_at: string;
}

export default function BankAdminDashboard() {
  const router = useRouter();
  const [bank, setBank] = useState<BankData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBankData = async () => {
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

        // Obtener datos del banco
        const { data, error: dbError } = await supabase
          .from("banco")
          .select("*")
          .eq("id", user.id)
          .single();

        if (dbError) {
          setError("No se encontraron datos del banco");
          return;
        }

        setBank(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    fetchBankData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando tu banco...</p>
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

  const isMilkBank = bank?.tipo === "leche";
  const isBloodBank = bank?.tipo === "sangre";

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            {isBloodBank ? "🩸 Mi Banco de Sangre" : "🥛 Mi Banco de Leche"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Bienvenido a {bank?.nombre}
          </p>
        </div>

        {/* Grid de contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stock Editor */}
          <div className="lg:col-span-2">
            {isBloodBank && <BloodStockEditor />}
            {isMilkBank && <MilkStockEditor />}
          </div>

          {/* Información del Banco */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información del Banco</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-semibold">{bank?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="text-sm">{bank?.direccion}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-semibold">
                    {isBloodBank ? "Banco de Sangre" : "Banco de Leche"}
                  </p>
                </div>
                {bank?.descripcion && (
                  <div>
                    <p className="text-sm text-muted-foreground">Descripción</p>
                    <p className="text-sm">{bank.descripcion}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => router.push("/bank/update-profile")}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                >
                  Configuración
                </button>
                <button
                    onClick={() => router.push("/bank/campaigns")}
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                >
                  Crear Campaña

                </button>
                  <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  Ver Donantes
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Donantes Registrados</p>
                </div>
                <div className="text-center border-t pt-3">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Donaciones Realizadas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección adicional: Próximas funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campañas</CardTitle>
              <CardDescription>Próximamente</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Crea y gestiona campañas de donación
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reportes</CardTitle>
              <CardDescription>Próximamente</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Estadísticas y análisis de donaciones
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

