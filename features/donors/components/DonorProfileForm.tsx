"use client";

import { useState } from "react";
import { createDonorProfile } from "@/features/auth/services/profileActions";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/services/utils";
import type { BloodType } from "@/features/donors/types";

// TODO:importar blood_types desde tipos y meter esta lógica en services y poner también la función para encontrar bancos cercanos

const BLOOD_TYPES: BloodType[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export function DonorProfileForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [fullName, setFullName] = useState("");
  const [bloodType, setBloodType] = useState<BloodType>(BLOOD_TYPES[0]);
  const [canDonateMilk, setCanDonateMilk] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createDonorProfile({
        full_name: fullName,
        blood_type: bloodType,
        puede_donar_leche: canDonateMilk,
        description,
      });

      // Redirigir al dashboard de donante
      router.push("/donor");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">👤 Completa tu Perfil de Donante</CardTitle>
          <CardDescription>
            Ayúdanos a conocerte mejor para conectarte con los bancos adecuados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Nombre Completo */}
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

              {/* Tipo de Sangre */}
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

              {/* ¿Puedes donar leche? */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="canDonateMilk"
                  checked={canDonateMilk}
                  onChange={(e) => setCanDonateMilk(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <Label htmlFor="canDonateMilk" className="cursor-pointer">
                  🥛 Puedo donar leche materna
                </Label>
              </div>

              {/* Descripción (opcional) */}
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
