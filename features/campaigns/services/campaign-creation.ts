import { createClient } from "@/shared/services/supabase/client";
import type { Campaign, CreateCampaignInput } from "@/features/campaigns/types";

/**
 * Busca donantes dentro de un radio específico de una ubicación
 * @param latitude - Latitud del centro de búsqueda
 * @param longitude - Longitud del centro de búsqueda
 * @param radiusKm - Radio de búsqueda en kilómetros
 * @returns Array de donantes encontrados
 */
export async function findDonorsByRadius(
  latitude: number,
  longitude: number,
  radiusKm: number
) {
  const supabase = createClient();

  // Usar la fórmula de haversine para calcular la distancia
  // Retorna donantes dentro del radio especificado
  const { data, error } = await supabase
    .rpc("find_donors_by_radius", {
      lat: latitude,
      lng: longitude,
      radius_km: radiusKm,
    });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Obtiene los emails de los donantes encontrados
 * @param donorIds - Array de IDs de donantes
 * @returns Array de emails
 */
export async function getDonorEmailsByIds(donorIds: string[]) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("donors")
    .select("correo")
    .in("id", donorIds);

  if (error) {
    throw error;
  }

  return data?.map((donor) => donor.correo) || [];
}

/**
 * Crea una nueva campaña
 * @param campaignData - Datos de la campaña a crear
 * @returns La campaña creada
 */
export async function createCampaign(campaignData: CreateCampaignInput) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("campana")
    .insert([campaignData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Campaign;
}

/**
 * Obtiene todas las campañas de un banco
 * @param bancoId - ID del banco
 * @returns Array de campañas
 */
export async function getBankCampaigns(bancoId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("campana")
    .select("*")
    .eq("banco_id", bancoId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as Campaign[]) || [];
}

/**
 * Obtiene una campaña por ID
 * @param campaignId - ID de la campaña
 * @returns La campaña encontrada
 */
export async function getCampaignById(campaignId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("campana")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (error) {
    throw error;
  }

  return data as Campaign;
}

/**
 * Actualiza una campaña
 * @param campaignId - ID de la campaña
 * @param updates - Datos a actualizar
 * @returns La campaña actualizada
 */
export async function updateCampaign(
  campaignId: string,
  updates: Partial<CreateCampaignInput>
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("campana")
    .update(updates)
    .eq("id", campaignId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Campaign;
}

/**
 * Elimina una campaña
 * @param campaignId - ID de la campaña
 */
export async function deleteCampaign(campaignId: string) {
  const supabase = createClient();

  const { error } = await supabase.from("campana").delete().eq("id", campaignId);

  if (error) {
    throw error;
  }
}
