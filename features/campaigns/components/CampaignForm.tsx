"use client";

import React, { useState } from "react";
import { createCampaign } from "@/features/campaigns/services";
import  {CampaignFormProps } from "@/features/campaigns/types";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";



export function CampaignForm({ bankId, onCampaignCreated }: Readonly<CampaignFormProps>) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!nombre.trim()) {
      setError("El nombre de la campaña es requerido");
      setIsLoading(false);
      return;
    }

    if (!ubicacion.trim()) {
      setError("La ubicación es requerida");
      setIsLoading(false);
      return;
    }

    if (!fecha) {
      setError("La fecha es requerida");
      setIsLoading(false);
      return;
    }

    const newCampaign = await createCampaign({
      banco_id: bankId,
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      ubicacion: ubicacion.trim(),
      fecha,
    });

    setNombre("");
    setDescripcion("");
    setUbicacion("");
    setFecha("");

    setIsLoading(false);
    onCampaignCreated(newCampaign);
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
                {isLoading ? "Creando..." : "Crear Campaña"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
  );
}
