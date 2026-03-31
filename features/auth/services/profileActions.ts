"use server";

import { createClient } from "@/shared/services/supabase/server";
import { CreateDonorProfileInput } from "@/features/donors/types";
import { CreateBankProfileInput, BANK_TYPE_MAP } from "@/features/banks/types";

/**
 * Crear perfil de donante en tabla 'donors'
 */
export async function createDonorProfile(input: CreateDonorProfileInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("donors")
    .insert({
      id: user.id,
      full_name: input.full_name,
      blood_type: input.blood_type,
      puede_donar_leche: input.puede_donar_leche,
      description: input.description,
      created_at: new Date().toISOString(),
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
export async function createBankProfile(input: CreateBankProfileInput) {
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
    .insert({
      id: user.id,
      nombre: input.nombre,
      tipo: tipoValue,
      descripcion: input.descripcion,
      direccion: input.direccion,
      location: `POINT(${input.location.lng} ${input.location.lat})`,
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

