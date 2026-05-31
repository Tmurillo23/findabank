import {createClient} from "@/shared/services/supabase/client";
import {calculateDistance, Coordinates} from "@/shared/services/geolocalization/geolocalization";
import { mapSupabaseError } from "@/shared/services/errors";
import type {DonorProfile} from "@/features/donors/types";
import type {BankProfile} from "@/features/banks/types/bank-types";



export async function fetchDonorData(donorId: string): Promise<DonorProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("donors")
    .select("*")
    .eq("id", donorId)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data as DonorProfile | null;
}

export async function updateDonorProfileInfo(upsertData: Partial<DonorProfile>) {
  const supabase = createClient();

  const { error } = await supabase
    .from("donors")
    .upsert(upsertData);

  if (error) {
    throw mapSupabaseError(error);
  }
}


export async function findNearbyBanks(
  userLocation: Coordinates,
  radiusKm: number = 20
): Promise<(BankProfile & { distance: number })[]> {
  const supabase = createClient();

  const { data: banksData, error: banksError } = await supabase
    .from("banco")
    .select("*");

  if (banksError) {
    throw mapSupabaseError(banksError);
  }

  return (banksData as BankProfile[])
      .map(bank => {
          const lat = parseFloat(bank.latitude);
          const lng = parseFloat(bank.longitude);
          const isValidCoord = !isNaN(lat) && !isNaN(lng);
          const distance = isValidCoord
              ? calculateDistance(userLocation, {lat, lng})
              : Infinity;

          return {...bank, distance};
      })
      .filter(bank => bank.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
}


