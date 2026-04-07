import { createClient } from "@/shared/services/supabase/server";
import { calculateDistance, Coordinates } from "@/shared/services/geolocalization/geolocalization";

/**
 * Obtiene los emails de donantes dentro de un radio específico del banco
 * Usa latitude y longitude directamente de las tablas
 */
export async function getDonorEmailsByRadius(bankId: string, radiusKm: number, isMilkBank: boolean): Promise<string[]> {
  const supabase = await createClient();

  // Obtener ubicación del banco usando latitude y longitude
  const { data: bankData, error: bankError } = await supabase
    .from("banco")
    .select("latitude, longitude")
    .eq("id", bankId)
    .single();

  if (bankError || !bankData?.latitude || !bankData?.longitude) {
    throw new Error("No se pudo obtener la ubicación del banco.");
  }

  const bankCoords: Coordinates = {
    lat: bankData.latitude,
    lng: bankData.longitude,
  };

  // Obtener donantes con sus emails
  let query = supabase.from("donors").select("id, email, latitude, longitude, puede_donar_leche");

  if (isMilkBank) {
    query = query.eq("puede_donar_leche", true);
  }

  const { data: donorsData, error: donorsError } = await query;

  if (donorsError) {
    throw donorsError;
  }

  const matchingEmails: string[] = [];

  for (const donor of (donorsData || [])) {
    // Solo procesar si tiene coordenadas válidas
    if (donor.latitude && donor.longitude) {
      const donorCoords: Coordinates = {
        lat: donor.latitude,
        lng: donor.longitude,
      };

      const distance = calculateDistance(bankCoords, donorCoords);

      if (distance <= radiusKm && donor.email) {
        matchingEmails.push(donor.email);
        console.log(`✓ Donante encontrado: ${donor.email} (distancia: ${distance.toFixed(2)}km)`);
      }
    }
  }

  console.log(`Total de donantes en el radio: ${matchingEmails.length}`);
  console.log("Emails de donantes:", matchingEmails);

  return matchingEmails;
}
