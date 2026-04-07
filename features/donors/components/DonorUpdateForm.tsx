"use client";

import { useState, useEffect } from "react";
import { updateDonorProfileInfo, deleteDonorProfileInfo } from "@/features/donors/services/donors";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/services/utils";
import type { BloodType, DonorProfile } from "@/features/donors/types";

const BLOOD_TYPES: BloodType[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

interface DonorUpdateFormProps extends React.ComponentPropsWithoutRef<"div"> {
  initialData: DonorProfile;
}

export function DonorUpdateForm({ initialData, className, ...props }: DonorUpdateFormProps) {
  const [fullName, setFullName] = useState(initialData.full_name || "");
  const [bloodType, setBloodType] = useState<BloodType>(initialData.blood_type || BLOOD_TYPES[0]);
  const [canDonateMilk, setCanDonateMilk] = useState(initialData.puede_donar_leche || false);
  const [description, setDescription] = useState(initialData.descripcion || "");
  const [latitude, setLatitude] = useState(initialData.latitude || 0);
  const [longitude, setLongitude] = useState(initialData.longitude || 0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const router = useRouter();

  // Obtener geolocalización al cargar el componente
  useEffect(() => {
    if (initialData.latitude === 0 && initialData.longitude === 0) {
      getGeolocation();
    }
  }, []);

  const getGeolocation = () => {
    setGeoLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setGeoLoading(false);
        },
        () => {
          setError("No se pudo obtener tu ubicación. Por favor, intenta de nuevo.");
          setGeoLoading(false);
        }
      );
    } else {
      setError("Geolocalización no disponible en tu navegador");
      setGeoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (latitude === 0 && longitude === 0) {
      setError("Por favor, proporciona tu ubicación");
      setIsLoading(false);
      return;
    }

    try {
      const upsertData: Partial<DonorProfile> = {
        id: initialData.id,
        full_name: fullName,
        blood_type: bloodType,
        puede_donar_leche: canDonateMilk,
        descripcion: description,
        latitude: latitude,
        longitude: longitude,
        correo: initialData.correo
      };

      await updateDonorProfileInfo(upsertData);

      alert("Perfil guardado correctamente.");
      router.push("/donor");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿De verdad deseas eliminar tu perfil de donante? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteDonorProfileInfo(initialData.id);

      alert("Perfil eliminado correctamente.");
      window.location.href = "/";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar perfil");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">👤 Actualiza tu Perfil de Donante</CardTitle>
            <CardDescription>
              Mantén tu información actualizada para recibir las mejores recomendaciones.
            </CardDescription>
          </div>
          <button onClick={() => router.push("/donor")} className="text-2xl hover:text-gray-600 dark:hover:text-gray-300">
            ×
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bloodType">Tipo de Sangre</Label>
                <select
                  id="bloodType"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value as BloodType)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {BLOOD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="canDonateMilk"
                  checked={canDonateMilk}
                  onChange={(e) => setCanDonateMilk(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <Label htmlFor="canDonateMilk" className="cursor-pointer">
                  🍼 Puedo donar leche materna
                </Label>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Información Adicional (Opcional)</Label>
                <textarea
                  id="description"
                  placeholder="Cuéntanos sobre ti, preferencias, horarios disponibles..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Ubicación */}
              <div className="grid gap-2">
                <Label>📍 Ubicación</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={getGeolocation}
                    disabled={geoLoading || isLoading}
                    className="w-full"
                    variant="outline"
                  >
                    {geoLoading ? "Obteniendo ubicación..." : latitude && longitude ? "Actualizar Ubicación" : "Obtener Ubicación"}
                  </Button>
                </div>
                {latitude && longitude && (
                  <p className="text-sm text-muted-foreground">
                    📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Eliminar Perfil
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

