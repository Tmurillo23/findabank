import { createClient } from "@/shared/services/supabase/client";
import { calculateDistance, Coordinates } from "@/shared/services/geolocalization/geolocalization";
import { DonorProfile, CreateDonorProfileInput } from "@/features/donors/types";

// TODO: hacer las funciones: getDonorStats. Esto es para después

/**
 * Crea o inserta un perfil de donante usando el cliente de Supabase
 */
export async function createDonorProfile(input: CreateDonorProfileInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("donors")
    .insert({
      id: user.id,
      full_name: input.full_name,
      blood_type: input.blood_type,
      puede_donar_leche: input.puede_donar_leche,
      descripcion: input.description,
      latitude: input.latitude,
      longitude: input.longitude,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating donor profile:", error);
    throw new Error("Failed to create donor profile");
  }

  return data;
}

/**
 * Obtiene bancos cercanos a unas coordenadas dadas
 */
export async function getNearbyBanks(donorCoords: Coordinates, radiusKm: number) {
  const supabase = createClient();
  const { data: banks, error } = await supabase.from("banco").select("*");

  if (error) {
    throw error;
  }

  const nearbyBanks = [];
  for (const bank of banks || []) {
    if (bank.latitude && bank.longitude) {
      const bankCoords: Coordinates = {
        lat: bank.latitude,
        lng: bank.longitude,
      };
      const distance = calculateDistance(donorCoords, bankCoords);
      if (distance <= radiusKm) {
        nearbyBanks.push({ ...bank, distance });
      }
    }
  }

  return nearbyBanks.sort((a, b) => a.distance - b.distance);
}

export async function updateDonorProfileInfo(upsertData: Partial<DonorProfile> & { latitude?: number; longitude?: number }) {
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
