import { createClient } from "@/shared/services/supabase/server";

export async function getBankLocation(bankId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("banco").select("latitude, longitude").eq("id", bankId).single();

  if (error) {
    throw error;
  }

  if (data?.latitude && data?.longitude) {
    return {
      lng: data.longitude,
      lat: data.latitude,
    };
  }
  return null;
}

export async function getBankProfile(bankId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("banco").select("*").eq("id", bankId).single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateBankProfileInfo(bankId: string, updates: { nombre?: string; tipo?: string; direccion?: string; descripcion?: string; latitude?: number; longitude?: number }) {
  const supabase = await createClient();
  const payload = {
    id: bankId,
    ...updates,
  };
  const { error } = await supabase.from("banco").upsert(payload);
  if (error) {
    throw error;
  }
}

export async function deleteBankProfileInfo(bankId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("banco").delete().eq("id", bankId);
  if (error) {
    throw error;
  }
}

