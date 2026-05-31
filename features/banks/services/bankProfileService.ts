import { createClient } from "@/shared/services/supabase/client";
import { mapSupabaseError } from "@/shared/services/errors";
import { ValidationError } from "@/features/AppErrors";
import {BankProfile, UpdateBankProfileInput} from "@/features/banks/types";

/**
 * Fetches bank profile data by ID
 * @throws NotFoundError if bank not found
 * @throws SupabaseError for database errors
 */
export async function fetchBankData(bankId: string): Promise<BankProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("banco")
    .select("*")
    .eq("id", bankId)
    .single();

  if (error) {
    throw mapSupabaseError(error);
  }

  return data as BankProfile | null;
}

/**
 * Updates bank profile information
 * Performs either update or insert based on existence
 * @throws ValidationError if bankId is invalid
 * @throws SupabaseError for database errors
 */
export async function updateBankProfileInfo(bankId: string, updates: UpdateBankProfileInput) {
  if (!bankId || bankId.trim() === "") {
    throw new ValidationError("Bank ID is required", { bankId });
  }

  const supabase = createClient();

  // Intentar UPDATE primero
  const { error: updateError, data: updateData } = await supabase
    .from("banco")
    .update(updates)
    .eq("id", bankId)
    .select();

  if (updateError) {
    throw mapSupabaseError(updateError);
  }

  // Si no se actualizaron registros, intentar INSERT
  if (!updateData || updateData.length === 0) {
    const { error: insertError } = await supabase
      .from("banco")
      .insert({ id: bankId, ...updates });

    if (insertError) {
      throw mapSupabaseError(insertError);
    }
  }
}
