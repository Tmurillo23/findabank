import { createClient } from "@/shared/services/supabase/client";
import { mapSupabaseError } from "@/shared/services/errors";
import { ValidationError } from "@/features/AppErrors";
import {BankProfile, UpdateBankProfileInput} from "@/features/banks/types";


export async function fetchBankData(bankId: string): Promise<BankProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("banco")
    .select("*")
    .eq("id", bankId)
    .single();

  if (error) {
    const mappedError = mapSupabaseError(error);
    if (mappedError === null) {
      return null;
    }
    throw mappedError;
  }

  return data as BankProfile | null;
}


export async function updateBankProfileInfo(bankId: string, updates: UpdateBankProfileInput) {
  if (!bankId || bankId.trim() === "") {
    throw new ValidationError("Bank ID is required", { bankId });
  }

  const supabase = createClient();

  const { error: updateError, data: updateData } = await supabase
    .from("banco")
    .update(updates)
    .eq("id", bankId)
    .select();

  if (updateError) {
    const mappedError = mapSupabaseError(updateError);
    if (mappedError) {
      throw mappedError;
    }
    return;
  }

  if (!updateData || updateData.length === 0) {
    const { error: insertError } = await supabase
      .from("banco")
      .insert({ id: bankId, ...updates });

    if (insertError) {
      const mappedError = mapSupabaseError(insertError);
      if (mappedError) {
        throw mappedError;
      }
    }
  }
}
