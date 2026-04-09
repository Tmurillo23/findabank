import { createClient } from "@/shared/services/supabase/client";

export async function getBankLocation(bankId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("banco").select("location").eq("id", bankId).single();

  if (error) {
    throw error;
  }

  if (data?.location) {
    const match = data.location.match(/POINT\(([-0-9.]+) ([-0-9.]+)\)/);
    if (match) {
      return {
        lng: match[1],
        lat: match[2],
      };
    }
  }
  return null;
}

export async function getBankProfile(bankId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("banco").select("*").eq("id", bankId).single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateBankProfileInfo(bankId: string, updates: { nombre?: string; tipo?: string; direccion?: string; descripcion?: string; location?: string }) {
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

export async function deleteBankProfileInfo(bankId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("banco").delete().eq("id", bankId);
  if (error) {
    throw error;
  }
}
