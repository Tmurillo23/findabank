"use client";

import { useState } from "react";
import { createCampaign, findDonorsByRadius } from "@/features/campaigns/services";
import type { Campaign } from "@/features/campaigns/types";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";

interface CampaignFormProps {
  bankId: string;
  onCampaignCreated: (campaign: Campaign) => void;
}

const RADIUS_OPTIONS = [1, 2, 5, 10, 20, 50];

export function CampaignForm({ bankId, onCampaignCreated }: CampaignFormProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [radioKm, setRadioKm] = useState("10");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [donorCount, setDonorCount] = useState<number | null>(null);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        () => {
          setError("No se pudo obtener tu ubicación");
        }
      );
    } else {
      setError("Geolocalización no disponible");
    }
  };

  const handleCheckDonors = async () => {
    if (!latitude || !longitude || !radioKm) {
      setError("Debes completar ubicación y radio");
      return;
    }

    try {
      setError(null);
      const donors = await findDonorsByRadius(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radioKm)
      );
      setDonorCount(donors.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar donantes");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validaciones
      if (!nombre.trim()) {
        setError("El nombre de la campaña es requerido");
        return;
      }

      if (!ubicacion.trim()) {
        setError("La ubicación es requerida");
        return;
      }

      if (!fecha) {
        setError("La fecha es requerida");
        return;
      }

      const newCampaign = await createCampaign({
        banco_id: bankId,
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        ubicacion: ubicacion.trim(),
        fecha,
      });

      // Limpiar formulario
      setNombre("");
      setDescripcion("");
      setUbicacion("");
      setFecha("");
      setLatitude("");
      setLongitude("");
      setRadioKm("10");
      setDonorCount(null);

      onCampaignCreated(newCampaign);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear campaña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-blue-500">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-2xl">📝 Nueva Campaña</CardTitle>
        <CardDescription>
          Crea una nueva campaña para buscar donantes en un área específica
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre de la Campaña *</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Ej: Campaña de Sangre - Marzo 2026"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Descripción */}
          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <textarea
              id="descripcion"
              placeholder="Detalles de la campaña..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Ubicación */}
          <div className="grid gap-2">
            <Label htmlFor="ubicacion">Ubicación *</Label>
            <Input
              id="ubicacion"
              type="text"
              placeholder="Ej: Centro de la ciudad"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </div>

          {/* Fecha */}
          <div className="grid gap-2">
            <Label htmlFor="fecha">Fecha de la Campaña *</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          {/* Sección de Geolocalización */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold">📍 Búsqueda de Donantes por Radio</h3>

            {/* Botón de Geolocalización */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGetLocation}
              className="w-full"
            >
              {latitude && longitude
                ? `📍 Ubicación: ${parseFloat(latitude).toFixed(4)}, ${parseFloat(longitude).toFixed(4)}`
                : "📍 Obtener Mi Ubicación"}
            </Button>

            {/* Radio de búsqueda */}
            <div className="grid gap-2">
              <Label htmlFor="radio">Radio de búsqueda (km)</Label>
              <div className="flex gap-2 flex-wrap">
                {RADIUS_OPTIONS.map((radius) => (
                  <button
                    key={radius}
                    type="button"
                    onClick={() => setRadioKm(radius.toString())}
                    className={`px-4 py-2 rounded border transition ${
                      radioKm === radius.toString()
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
                    }`}
                  >
                    {radius} km
                  </button>
                ))}
              </div>
            </div>

            {/* Botón de buscar donantes */}
            <Button
              type="button"
              variant="outline"
              onClick={handleCheckDonors}
              className="w-full"
              disabled={!latitude || !longitude}
            >
              {donorCount !== null
                ? `✅ ${donorCount} donante${donorCount !== 1 ? "s" : ""} encontrado${donorCount !== 1 ? "s" : ""}`
                : "🔍 Buscar Donantes"}
            </Button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Creando..." : "✅ Crear Campaña"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

