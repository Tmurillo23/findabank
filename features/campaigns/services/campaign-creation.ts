import { createClient } from "@/shared/services/supabase/client";
import type { Campaign, CreateCampaignInput } from "@/features/campaigns/types";


/**
 * Obtiene los emails de los donantes encontrados
 * @param donorIds - Array de IDs de donantes
 * @returns Array de emails
 */
export async function getDonorEmails() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("donors")
    .select("correo")

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



