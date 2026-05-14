"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/shared";
import { useRouter } from "next/navigation";
import { BloodStockEditor, MilkStockEditor } from "@/features/banks/components";
import { BankConfigTabKey } from "@/features/banks/types";
import { updateBankProfileInfo, fetchBankData } from "@/features/banks/services/bankProfileService";
import { createClient } from "@/shared/services/supabase/client";

export function BankUpdateForm({ initialRole }: { initialRole?: "blood_bank" | "milk_bank" | null }) {
  const router = useRouter();

  const [bankId, setBankId] = useState<string>("");
  const [bankName] = useState<string>("");
  const [bankType, setBankType] = useState<"sangre" | "leche">(initialRole === "milk_bank" ? "leche" : "sangre");

  const [activeTab, setActiveTab] = useState<BankConfigTabKey>("perfil");
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Estados para edicion de perfil
  const [editNombre, setEditNombre] = useState("");
  const [editDireccion, setEditDireccion] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editLatitude, setEditLatitude] = useState("");
  const [editLongitude, setEditLongitude] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    const initializeBankForm = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setProfileError("No estás autenticado");
          setLoadingConfig(false);
          return;
        }

        // Establecer el ID del banco
        setBankId(user.id);

        // Determinar el tipo de banco
        let currentType: "sangre" | "leche" = "sangre";
        if (initialRole === "milk_bank") {
          currentType = "leche";
        } else if (user.user_metadata?.role === "milk_bank") {
          currentType = "leche";
        }
        setBankType(currentType);

        // Cargar datos existentes del banco
        const bankData = await fetchBankData(user.id);
        if (bankData) {
          setEditNombre(bankData.nombre || "");
          setEditDireccion(bankData.direccion || "");
          setEditDescripcion(bankData.descripcion || "");
          setEditLatitude(bankData.latitude?.toString() || "");
          setEditLongitude(bankData.longitude?.toString() || "");
        }

      } catch (err) {
        setProfileError(err instanceof Error ? err.message : "Error al inicializar el formulario");
      } finally {
        setLoadingConfig(false);
      }
    };

    initializeBankForm();
  }, [initialRole]);



  if (loadingConfig) {
    return (
      <div className="flex justify-center p-8">
        <p className="text-muted-foreground">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg bg-white shadow-lg pb-8">
      <div className="flex items-center justify-between border-b p-6">
        <h2 className="text-2xl font-bold">Configuración de {bankName || "Banco"}</h2>
      </div>

        <div className="flex border-b px-6">
          <button
            onClick={() => setActiveTab("perfil")}
            className={`border-b-2 px-4 py-3 font-medium transition ${
              activeTab === "perfil"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={`border-b-2 px-4 py-3 font-medium transition ${
              activeTab === "stock"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Stock
          </button>
        </div>

        <div className="p-6">
          {activeTab === "perfil" && (
            <Card>
              <CardHeader>
                <CardTitle>Informacion del Banco</CardTitle>
                <CardDescription>
                  Actualiza la informacion de tu banco para que los donantes puedan encontrarte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSavingProfile(true);
                    setProfileError(null);

                    // Validaciones
                    if (!editNombre || editNombre.trim() === "") {
                      setProfileError("El nombre del banco es requerido.");
                      setIsSavingProfile(false);
                      return;
                    }

                    if (!editDireccion || editDireccion.trim() === "") {
                      setProfileError("La dirección es requerida.");
                      setIsSavingProfile(false);
                      return;
                    }

                    if (!editLatitude || !editLongitude) {
                      setProfileError("La ubicación geográfica es requerida. Por favor, presiona 'Usar Mi Ubicación Actual' o ingresa las coordenadas manualmente.");
                      setIsSavingProfile(false);
                      return;
                    }

                    try {
                      const updates: Record<string, string> = {
                        nombre: editNombre.trim(),
                        tipo: bankType === "leche" ? "leche" : "sangre",
                        direccion: editDireccion.trim(),
                        descripcion: editDescripcion.trim(),
                        latitude: editLatitude,
                        longitude: editLongitude,
                      };

                      await updateBankProfileInfo(bankId, updates);

                      alert("Perfil actualizado correctamente.");
                      router.push("/bank");
                    } catch (err: unknown) {
                      setProfileError(err instanceof Error ? err.message : "Error al actualizar perfil");
                    } finally {
                      setIsSavingProfile(false);
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="nombre">Nombre del Banco</Label>
                    <Input
                      id="nombre"
                      type="text"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Input
                      id="tipo"
                      type="text"
                      value={bankType === "sangre" ? "Banco de Sangre" : "Banco de Leche"}
                      disabled
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="direccion">Direccion</Label>
                    <Input
                      id="direccion"
                      type="text"
                      placeholder="Calle Principal 123, Apartado 45"
                      required
                      value={editDireccion}
                      onChange={(e) => setEditDireccion(e.target.value)}
                    />
                  </div>

                  {/* Ubicacion */}
                  <div className="space-y-3">
                    <Label>Ubicacion Geografica</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        setGeoLoading(true);
                        setProfileError(null);
                        try {
                          const { getCurrentLocation } = await import("@/shared/services/geolocalization");
                          const coords = await getCurrentLocation();
                          setEditLatitude(coords.lat.toString());
                          setEditLongitude(coords.lng.toString());
                        } catch {
                          setProfileError("No se pudo obtener tu ubicacion. Ingresa manualmente.");
                        } finally {
                          setGeoLoading(false);
                        }
                      }}
                      disabled={geoLoading}
                    >
                      {geoLoading ? "Obteniendo ubicacion..." : "Usar Mi Ubicacion Actual"}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="latitude">Latitud</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="0.0001"
                          placeholder="10.3123"
                          value={editLatitude}
                          onChange={(e) => setEditLatitude(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="longitude">Longitud</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="0.0001"
                          placeholder="-75.5234"
                          value={editLongitude}
                          onChange={(e) => setEditLongitude(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descripcion */}
                  <div className="grid gap-2">
                    <Label htmlFor="descripcion">Descripcion (Opcional)</Label>
                    <textarea
                      id="descripcion"
                      placeholder="Informacion sobre tu banco, horarios, especializaciones..."
                      value={editDescripcion}
                      onChange={(e) => setEditDescripcion(e.target.value)}
                      className="flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  {profileError && <p className="text-sm text-red-500">{profileError}</p>}

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" className="flex-1" disabled={isSavingProfile}>
                      {isSavingProfile ? "Guardando..." : "Guardar Cambios"}
                    </Button>

                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "stock" && (
            <div className="space-y-6">
              {bankType === "sangre" ? (
                <BloodStockEditor bancoId={bankId} />
              ) : (
                <MilkStockEditor bancoId={bankId} />
              )}
            </div>
          )}
        </div>
    </div>
  );
}

