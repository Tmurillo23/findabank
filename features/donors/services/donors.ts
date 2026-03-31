import { createClient } from "@/shared/services/supabase/client";
import { DonorProfile } from "@/features/donors/types";

// TODO: hacer las funciones: findNearbyBanks, getDonorStats. Esto es para después

export async function updateDonorProfileInfo(upsertData: Partial<DonorProfile>) {
  const supabase = createClient();
  const { error } = await supabase.from("donors").upsert(upsertData);
  if (error) {
    throw error;
  }
}

export async function deleteDonorProfileInfo(donorId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("donors").delete().eq("id", donorId);
  if (error) {
    throw error;
  }
}
