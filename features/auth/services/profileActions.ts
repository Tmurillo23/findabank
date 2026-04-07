"use server";

import { createClient } from "@/shared/services/supabase/server";
import { UpdateDonorProfileInput } from "@/features/donors/types";
import { UpdateBankProfileInput, BANK_TYPE_MAP } from "@/features/banks/types";

/**
 * Crear perfil de donante en tabla 'donors'
 */
export async function createDonorProfile(input: UpdateDonorProfileInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("donors")
    .upsert({
      id: user.id,
      full_name: input.full_name,
      blood_type: input.blood_type,
      puede_donar_leche: input.puede_donar_leche,
      descripcion: input.descripcion,
      created_at: new Date().toISOString(),
      correo: user.email,

    })
    .select()
    .single();

  if (error) {
    console.error("Error creating donor profile:", error);
    throw new Error("Failed to create donor profile");
  }

  return data;
}

/**
 * Crear perfil de banco en tabla 'banco'
 */
export async function createBankProfile(input: UpdateBankProfileInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  // Mapear tipos a valores enum válidos en tu BD
  const tipoValue = BANK_TYPE_MAP[input.tipo] || input.tipo;

  const { data, error } = await supabase
    .from("banco")
    .upsert({
      id: user.id,
      nombre: input.nombre,
      tipo: tipoValue,
      descripcion: input.descripcion,
      direccion: input.direccion,
      latitude: input.latitude,
      longitude: input.longitude,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating bank profile:", error);
    throw new Error(`Failed to create bank profile: ${error.message}`);
  }

  return data;
}

