import { createClient } from "@/shared/services/supabase/client";
import {BankProfile, UpdateBankProfileInput} from "@/features/banks/types";

export async function fetchBankData(bankId: string): Promise<BankProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("banco")
    .select("*")
    .eq("id", bankId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("No se encontraron datos del banco");
  }

  return data as BankProfile | null;
}

export async function updateBankProfileInfo(
  bankId: string,
  updates: UpdateBankProfileInput
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
