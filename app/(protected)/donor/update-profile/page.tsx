"use client";

// Lo mismo aquí, crar la funcón para obtener la data de donantes

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
        <DonorUpdateForm initialData={donor} />
      </div>
    </div>
  );
}
