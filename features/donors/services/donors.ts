import { createClient } from "@/shared/services/supabase/client";
import type { DonorProfile } from "@/features/donors/types";

// TODO: hacer las funciones: findNearbyBanks, getDonorStats. Esto es para después

export async function fetchDonorData(donorId: string): Promise<DonorProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("donors")
    .select("*")
    .eq("id", donorId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("No se encontraron datos del donante");
  }

  return data as DonorProfile | null;
}

export async function updateDonorProfileInfo(upsertData: Partial<DonorProfile>) {
  const supabase = createClient();
  const { error } = await supabase.from("donors").upsert(upsertData);
  if (error) {
    throw error;
  }
}


