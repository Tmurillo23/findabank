import { createClient } from "@/shared/services/supabase/client";
import {BankProfile, UpdateBankProfileInput} from "@/features/banks/types";

export async function fetchBankData(bankId: string): Promise<BankProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("banco")
    .select("*")
    .eq("id", bankId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("No se encontraron datos del banco");
  }

  return data as BankProfile | null;
}

export async function updateBankProfileInfo(bankId: string, updates: UpdateBankProfileInput) {
  if (!bankId || bankId.trim() === "") {
    throw new Error("ID del banco no válido");
  }

  const supabase = createClient();
  
  try {
    // Intentar UPDATE primero
    const { error: updateError, data: updateData } = await supabase
      .from("banco")
      .update(updates)
      .eq("id", bankId)
      .select();
    
    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    console.log("Update result:", updateData);

    // Si no actualizo nada (registro no existe), intentar INSERT
    if (!updateData || updateData.length === 0) {
      console.log("No rows updated, trying INSERT");
      const { error: insertError } = await supabase
        .from("banco")
        .insert({ id: bankId, ...updates });
      
      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }
    }
  } catch (error: any) {
    console.error("Strategy error:", error);
    throw new Error(`Error actualizando banco: ${error.message || error}`);
  }
}
