import { createClient } from "@/shared/services/supabase/client";

export async function getBankLocation(bankId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("banco").select("location").eq("id", bankId).single();

  if (error) {
    throw error;
  }

  if (data?.location) {
    const match = data.location.match(/POINT\(([-0-9.]+) ([-0-9.]+)\)/);
    if (match) {
      return {
        lng: match[1],
        lat: match[2],
      };
    }
  }
  return null;
}

export async function getBankProfile(bankId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("banco").select("*").eq("id", bankId).single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateBankProfileInfo(bankId: string, updates: { nombre?: string; tipo?: string; direccion?: string; descripcion?: string; location?: string }) {
  const supabase = createClient();
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
  const supabase = createClient();
  const { error } = await supabase.from("banco").delete().eq("id", bankId);
  if (error) {
    throw error;
  }
}
