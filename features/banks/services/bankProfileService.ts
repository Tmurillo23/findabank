import { createClient } from "@/shared/services/supabase/client";

export async function updateBankProfileInfo(
  bankId: string,
  updates: {
    nombre?: string;
    tipo?: string;
    direccion?: string;
    descripcion?: string;
    latitude?: string;
    longitude?: string;
  }
) {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = {
    id: bankId,
  };

  // Agregar campos si existen
  if (updates.nombre !== undefined) payload.nombre = updates.nombre;
  if (updates.tipo !== undefined) payload.tipo = updates.tipo;
  if (updates.direccion !== undefined) payload.direccion = updates.direccion;
  if (updates.descripcion !== undefined) payload.descripcion = updates.descripcion;
  if (updates.latitude !== undefined) payload.latitude = parseFloat(updates.latitude);
  if (updates.longitude !== undefined) payload.longitude = parseFloat(updates.longitude);

  const { error } = await supabase.from("banco").upsert(payload);
  if (error) {
    throw error;
  }
}

export async function deleteBankProfileInfo(bankId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("banco").delete().eq("id", bankId);
  if (error) {
    throw error;
  }
}
