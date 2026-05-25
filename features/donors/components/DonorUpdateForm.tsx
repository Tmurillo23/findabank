"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/shared/services/supabase/client";
import { fetchDonorData, updateDonorProfileInfo } from "@/features/donors/services/donors";
import { getCurrentLocation } from "@/shared/services/geolocalization/geolocalization";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/services/utils";
import type { BloodType, DonorProfile } from "@/features/donors/types";
import { Loader2 } from "lucide-react";

const BLOOD_TYPES: BloodType[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export function DonorUpdateForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [bloodType, setBloodType] = useState<BloodType>(BLOOD_TYPES[0]);
  const [canDonateMilk, setCanDonateMilk] = useState(false);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    const fetchDonorDataHandler = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setFormError("No estás autenticado");
          return;
        }

        const data = await fetchDonorData(user.id);

        if (!data) {
          setDonor({
            id: user.id,
            full_name: "",
            blood_type: "O+",
            puede_donar_leche: false,
            descripcion: "",
            created_at: new Date().toISOString(),
            latitude: 0,
            longitude: 0,
            correo: user.email || "",
          });
        } else {
          setDonor(data);
          setFullName(data.full_name || "");
          setBloodType(data.blood_type || BLOOD_TYPES[0]);
          setCanDonateMilk(data.puede_donar_leche || false);
          setDescription(data.descripcion || "");
          setLatitude(data.latitude?.toString() || "");
          setLongitude(data.longitude?.toString() || "");
        }
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDonorDataHandler();
  }, []);

  const getGeolocation = async () => {
    setGeoLoading(true);
    setFormError(null);

    try {
      const coords = await getCurrentLocation();
      setLatitude(coords.lat.toString());
      setLongitude(coords.lng.toString());
    } catch {
      setFormError("No se pudo obtener tu ubicación. Por favor, intenta manualmente.");
    } finally {
      setGeoLoading(false);
    }
  };

  const saveProfile = async () => {
    setIsLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    if (!latitude || !longitude) {
      setFormError("Por favor, proporciona tu ubicación");
      setIsLoading(false);
      return;
    }

    if (!donor) {
      setFormError("Error: No se encontraron datos del donante");
      setIsLoading(false);
      return;
    }

    try {
      const upsertData: Partial<DonorProfile> = {
        id: donor.id,
        full_name: fullName,
        blood_type: bloodType,
        puede_donar_leche: canDonateMilk,
        descripcion: description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        correo: donor.correo
      };

      await updateDonorProfileInfo(upsertData);

      setSuccessMessage("Perfil guardado correctamente.");
      setTimeout(() => {
        router.push("/donor");
      }, 1500);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al actualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (formError && !donor) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg text-red-500">{formError}</p>
      </div>
    );
  }

  if (!donor) return null;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {successMessage && (
        <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-3xl border border-green-200 bg-white px-5 py-3 shadow-2xl shadow-slate-950/10">
          <p className="text-sm font-semibold text-green-700">{successMessage}</p>
        </div>
      )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Actualiza tu Perfil de Donante</CardTitle>
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
                  Puedo donar leche materna
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
                <Label>Ubicación</Label>
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
                    {latitude}, {longitude}
                  </p>
                )}
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar Perfil"}
              </Button>
            </div>
          </form>
        </CardContent>
        <div className="border-t p-4">
          <div className="max-w-md mx-auto">
            <Button
              onClick={saveProfile}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Confirmar cambios"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}



