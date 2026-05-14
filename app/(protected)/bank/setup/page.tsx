"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/services/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface BankSetupData {
  nombre: string;
  tipo: "sangre" | "leche";
  descripcion: string;
  direccion: string;
  latitude: number;
  longitude: number;
}

export default function BankSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BankSetupData>({
    nombre: "",
    tipo: "sangre",
    descripcion: "",
    direccion: "",
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    // Verificar si el usuario ya tiene un banco configurado
    const checkExistingBank = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data } = await supabase
          .from("banco")
          .select("id")
          .eq("id", user.id)
          .single();

        if (data) {
          // Ya tiene banco configurado, redirigir al dashboard
          router.push("/bank");
        }
      } catch (err) {
        console.error("Error checking existing bank:", err);
      }
    };

    checkExistingBank();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No estás autenticado");
      }

      // Crear el banco
      const { error } = await supabase
        .from("banco")
        .insert({
          id: user.id,
          nombre: formData.nombre,
          tipo: formData.tipo,
          descripcion: formData.descripcion,
          direccion: formData.direccion,
          latitude: formData.latitude,
          longitude: formData.longitude,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Redirigir al dashboard
      router.push("/bank");
    } catch (err) {
      console.error("Error creating bank:", err);
      alert("Error al crear el banco. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BankSetupData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Configuración inicial del banco</p>
            <h1 className="text-3xl font-bold">Configura tu Banco</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Configura tu Banco</CardTitle>
            <CardDescription>
              Completa la información de tu banco para comenzar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Banco *</Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Banco de Sangre Central"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Banco *</Label>
                  <select
                    id="tipo"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    value={formData.tipo}
                    onChange={(e) => handleInputChange("tipo", e.target.value as "sangre" | "leche")}
                    required
                  >
                    <option value="sangre">Banco de Sangre</option>
                    <option value="leche">Banco de Leche</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md resize-none"
                  placeholder="Describe brevemente tu banco..."
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  type="text"
                  placeholder="Calle Principal 123, Ciudad"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitud</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="-12.0464"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitud</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="-77.0428"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creando Banco..." : "Crear Banco"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}