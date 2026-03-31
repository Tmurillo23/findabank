import { createClient } from "@/shared/services/supabase/client";
import type { BloodStock, CreateBloodStockInput } from "@/features/banks/types/bloodStock";
import type { MilkStock, CreateMilkStockInput } from "@/features/banks/types/milkStock";

/**
 * Obtener stock de sangre de un banco
 */
export async function getBloodStock(bancoId: string): Promise<BloodStock[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("stock")
    .select("id, banco_id, tipo_sangre, situacion, updated_at")
    .eq("banco_id", bancoId)
    .not("tipo_sangre", "is", null);

  if (error) throw new Error(`Error fetching blood stock: ${error.message}`);
  return data || [];
}

/**
 * Obtener stock de leche de un banco
 */
export async function getMilkStock(bancoId: string): Promise<MilkStock[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("stock")
    .select("id, banco_id, tipo_leche, situacion, updated_at")
    .eq("banco_id", bancoId)
    .not("tipo_leche", "is", null);

  if (error) throw new Error(`Error fetching milk stock: ${error.message}`);
  return data || [];
}

/**
 * Hacer upsert de stock de sangre (crea o actualiza)
 * Seguro contra falta de constraints únicas compuestas en BD
 */
export async function upsertBloodStock(input: CreateBloodStockInput): Promise<BloodStock> {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("stock")
    .select("id")
    .eq("banco_id", input.banco_id)
    .eq("tipo_sangre", input.tipo_sangre)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("stock")
      .update({
        situacion: input.situacion,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("id, banco_id, tipo_sangre, situacion, updated_at")
      .single();

    if (error) throw new Error(`Error updating blood stock: ${error.message}`);
    return data as BloodStock;
  } else {
    const { data, error } = await supabase
      .from("stock")
      .insert({
        banco_id: input.banco_id,
        tipo_sangre: input.tipo_sangre,
        situacion: input.situacion,
        updated_at: new Date().toISOString(),
      })
      .select("id, banco_id, tipo_sangre, situacion, updated_at")
      .single();

    if (error) throw new Error(`Error inserting blood stock: ${error.message}`);
    return data as BloodStock;
  }
}

/**
 * Hacer upsert de stock de leche (crea o actualiza)
 * Seguro contra falta de constraints únicas compuestas en BD
 */
export async function upsertMilkStock(input: CreateMilkStockInput): Promise<MilkStock> {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("stock")
    .select("id")
    .eq("banco_id", input.banco_id)
    .eq("tipo_leche", input.tipo_leche)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("stock")
      .update({
        situacion: input.situacion,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("id, banco_id, tipo_leche, situacion, updated_at")
      .single();

    if (error) throw new Error(`Error updating milk stock: ${error.message}`);
    return data as MilkStock;
  } else {
    const { data, error } = await supabase
      .from("stock")
      .insert({
        banco_id: input.banco_id,
        tipo_leche: input.tipo_leche,
        situacion: input.situacion,
        updated_at: new Date().toISOString(),
      })
      .select("id, banco_id, tipo_leche, situacion, updated_at")
      .single();

    if (error) throw new Error(`Error inserting milk stock: ${error.message}`);
    return data as MilkStock;
  }
}

