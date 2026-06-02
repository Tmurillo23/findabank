import { createClient } from "@/shared/services/supabase/client";
import { mapSupabaseError } from "@/shared/services/errors";


export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const mappedError = mapSupabaseError(error);
    if (mappedError) {
      throw mappedError;
    }
    // Si mapSupabaseError retorna null, lanzar error genérico
    throw new Error("Credenciales inválidas. Por favor intenta de nuevo.");
  }

  return data;
}


export async function getUserRole(): Promise<string | undefined> {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  return data?.user?.user_metadata?.role;
}

