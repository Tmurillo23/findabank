"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importamos para la navegación
import { getCurrentLocation, calculateDistance, Coordinates } from "@/shared/services/geolocalization/geolocalization";
import { createClient } from "@/shared/services/supabase/client";
import { BankProfile } from "@/features/banks/types/bank-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { MapPin, Loader2, Droplets, Baby, ArrowLeft } from "lucide-react"; // Importamos ArrowLeft
import Link from "next/link";

export default function NearbyBanksPage() {
  const router = useRouter(); // Inicializamos el router
  const [banks, setBanks] = useState<(BankProfile & { distance: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function getData() {
      try {
        setLoading(true);

        const currentPos = await getCurrentLocation();
        setCoords(currentPos);

        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (user) {
          await supabase
            .from("donors")
            .update({ 
              latitude: currentPos.lat, 
              longitude: currentPos.lng 
            })
            .eq("id", user.id);
        }

        const { data: banksData, error: banksError } = await supabase
          .from("banco")
          .select("*");

        if (banksError) throw banksError;

        const banksWithDistance = (banksData as BankProfile[]).map(bank => {
          const lat = parseFloat(bank.latitude);
          const lng = parseFloat(bank.longitude);
          
          const isValidCoord = !isNaN(lat) && !isNaN(lng);
          const distance = isValidCoord 
            ? calculateDistance(currentPos, { lat, lng }) 
            : Infinity; 
          
          return {
            ...bank,
            distance
          };
        })
        .sort((a, b) => a.distance - b.distance);

        setBanks(banksWithDistance);
      } catch (err) {
        console.error("Error capturado:", err);
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        setError(`No pudimos cargar la información: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-red-500 mb-4" size={40} />
        <p className="text-muted-foreground animate-pulse text-lg">Buscando bancos cercanos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-8">
      {/* BOTÓN DE VOLVER */}
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="mr-2" size={18} />
          Volver
        </Button>
      </div>

      <header className="space-y-2 border-b pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Bancos de Sangre y Leche</h1>
        <p className="text-slate-500 text-lg">Localiza los puntos de atención más cercanos a tu posición actual.</p>
      </header>

      {error && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-lg text-destructive text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {coords && !error && (
        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm w-fit">
          <MapPin size={14} />
          Ubicación detectada: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {banks.map((bank) => (
          <Card key={bank.id} className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xl font-bold leading-none">{bank.nombre}</CardTitle>
              <div className="p-2 rounded-full bg-slate-50">
                {bank.tipo === "blood" ? (
                  <Droplets className="text-red-500" size={24} />
                ) : (
                  <Baby className="text-blue-400" size={24} />
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow gap-4">
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-slate-400" />
                <p className="line-clamp-2">{bank.direccion || "Dirección no disponible"}</p>
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Distancia</span>
                  <span className="text-sm font-bold text-primary">
                    {bank.distance === Infinity ? "Sin ubicación" : `${bank.distance.toFixed(2)} km`}
                  </span>
                </div>
                
                <Link href={`/donor/bank/${bank.id}`}>
                  <Button variant="default" size="sm" className="font-semibold">
                    Ver perfil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banks.length === 0 && !error && (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl border-slate-200">
          <p className="text-slate-400 font-medium">No se encontraron bancos en el sistema.</p>
        </div>
      )}
    </div>
  );
}