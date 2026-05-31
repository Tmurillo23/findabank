import { createClient } from "@/shared/services/supabase/client";
import { mapSupabaseError } from "@/shared/services/errors";
import type { Campaign, CreateCampaignInput } from "@/features/campaigns/types";


export async function createCampaign(campaignData: CreateCampaignInput) {
  const supabase = createClient();

  const { data, error } = await supabase
      .from("campana")
      .insert([campaignData])
      .select()
      .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data as Campaign;
}


export async function getBankCampaigns(bancoId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
      .from("campana")
      .select("*")
      .eq("banco_id", bancoId)
      .order("created_at", { ascending: false });

  if (error) {
    throw mapSupabaseError(error);
  }

  return (data as Campaign[]) || [];
}
