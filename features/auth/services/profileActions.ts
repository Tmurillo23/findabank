"use server";

import { createClient } from "@/shared/services/supabase/server";
import { mapSupabaseError } from "@/shared/services/errors";
import { AuthenticationError } from "@/features/AppErrors";
import { UpdateDonorProfileInput } from "@/features/donors/types";
import { UpdateBankProfileInput, BANK_TYPE_MAP } from "@/features/banks/types";

/**
 * Creates a donor profile for the authenticated user
 * @throws AuthenticationError if no user is authenticated
 * @throws SupabaseError for database errors
 */
export async function createDonorProfile(input: UpdateDonorProfileInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthenticationError("No user is currently authenticated");
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
    throw mapSupabaseError(error);
  }

  return data;
}

/**
 * Creates a bank profile for the authenticated user
 * @throws AuthenticationError if no user is authenticated
 * @throws SupabaseError for database errors
 */
export async function createBankProfile(input: UpdateBankProfileInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthenticationError("No user is currently authenticated");
  }

  const tipoValue = input.tipo && input.tipo in BANK_TYPE_MAP
    ? BANK_TYPE_MAP[input.tipo as keyof typeof BANK_TYPE_MAP]
    : input.tipo;

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
    throw mapSupabaseError(error);
  }

  return data;
}

