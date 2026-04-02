"use client";


import {FormEvent, useState} from "react";
import { createBankProfile } from "@/features/auth/services/profileActions";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/services/utils";
import { useUserRole } from "@/shared/hooks/useUserRole";
import {getCurrentLocation} from "@/shared/services/geolocalization/geolocalization";

export function BankProfileForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { role } = useUserRole();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const router = useRouter();

  const handleGetLocation = async () => {
    setGeoLoading(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      setLatitude(coords.lat.toString());
      setLongitude(coords.lng.toString());
    } catch {
      setError("No se pudo obtener tu ubicación. Ingresa manualmente.");
    } finally {
      setGeoLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!latitude || !longitude) {
      setError("Ubicación requerida");
      setIsLoading(false);
      return;
    }

    try {
      const bankType = role === "blood_bank" ? "blood" : "milk";

      await createBankProfile({
        nombre,
        tipo: bankType,
        descripcion,
        direccion,
        location: {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
        },
      });

      // Redirigir al dashboard del banco
      router.push("/bank");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const bankTypeLabel = role === "blood_bank" ? "Banco de Sangre" : "Banco de Leche";
  const bankEmoji = role === "blood_bank" ? "🩸" : "🥛";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{bankEmoji} Completa tu Perfil de {bankTypeLabel}</CardTitle>
          <CardDescription>
            Proporciona información sobre tu banco para que los donantes puedan encontrarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Nombre del Banco */}
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre del {bankTypeLabel}</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Centro de Transfusión del Sur"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              {/* Dirección */}
              <div className="grid gap-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  type="text"
                  placeholder="Calle Principal 123, Apartado 45"
                  required
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>

              {/* Ubicación */}
              <div className="space-y-3">
                <Label>Ubicación Geográfica</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGetLocation}
                  disabled={geoLoading}
                >
                  {geoLoading ? "Obteniendo ubicación..." : "📍 Usar Mi Ubicación Actual"}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="latitude">Latitud</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0001"
                      placeholder="10.3123"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="longitude">Longitud</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.0001"
                      placeholder="-75.5234"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Descripción (opcional) */}
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                <textarea
                  id="descripcion"
                  placeholder="Información sobre tu banco, horarios, especializaciones..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Completar Perfil"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

