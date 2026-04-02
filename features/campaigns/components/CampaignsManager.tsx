"use client";

import { useState } from "react";
import { Campaign, createLocalCampaign } from "@/features/campaigns/services/campaign-service";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";

interface CampaignsManagerProps {
  bancoId: string;
  bankType: "sangre" | "leche";
  bankName: string;
  initialCampaigns: Campaign[];
}

export function CampaignsManager({ bancoId, bankType, bankName, initialCampaigns }: CampaignsManagerProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [radiusKm, setRadiusKm] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMilkBank = bankType === "leche";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const newCampaign = await createLocalCampaign({
        banco_id: bancoId,
        nombre,
        descripcion,
        ubicacion,
        radiusKm,
        isMilkBank,
        bankName,
      });

      if (newCampaign) {
        setCampaigns([newCampaign as Campaign, ...campaigns]);
      }

      setIsCreating(false);
      setNombre("");
      setDescripcion("");
      setUbicacion("");
      setRadiusKm(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la campaña");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Columna Izquierda: Lista de Campañas */}
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Mis Campañas</h2>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>Nueva Campaña</Button>
          )}
        </div>

        {campaigns.length === 0 ? (
          <p className="text-muted-foreground">Aún no has creado campañas.</p>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((camp) => (
              <Card key={camp.id}>
                <CardHeader>
                  <CardTitle>{camp.nombre}</CardTitle>
                  <CardDescription>{new Date(camp.fecha).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{camp.descripcion}</p>
                  <p className="text-sm font-semibold">📍 {camp.ubicacion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Columna Derecha: Creador (Oculto/Mostrado) */}
      {isCreating && (
        <Card className="w-full md:w-1/3 h-fit sticky top-4">
          <CardHeader>
            <CardTitle>Crear Nueva Campaña</CardTitle>
            <CardDescription>Notifica a donantes en tu área</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Título de la Campaña</Label>
                <Input
                  id="nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Gran Donatón de Verano"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  required
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Escribe el mensaje para los donantes..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación de Donación</Label>
                <Input
                  id="ubicacion"
                  required
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Dirección exacta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="radius">Radio de Búsqueda (km)</Label>
                <select
                  id="radius"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={15}>15 km</option>
                  <option value={20}>20 km</option>
                </select>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Crear y Enviar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

