"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/shared/services/supabase/client";
import { fetchDonorData } from "@/features/donors/services/donors";
import { DonorUpdateForm } from "@/features/donors/components/DonorUpdateForm";
import type { DonorProfile } from "@/features/donors/types";

export default function DonorUpdateProfilePage() {
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonorDataHandler = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("No estás autenticado");
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
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDonorDataHandler();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!donor) return null;

  return (
    <div className="min-h-screen p-4 flex items-start justify-center pt-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Editar perfil de donante</p>
            <h1 className="text-3xl font-bold">Actualizar información</h1>
          </div>
          <Link href="/donor" className="text-sm font-medium text-blue-600 hover:underline">
            Volver al Dashboard
          </Link>
        </div>
        <DonorUpdateForm initialData={donor} />
      </div>
    </div>
  );
}
