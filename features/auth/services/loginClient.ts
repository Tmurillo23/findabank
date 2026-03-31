import { createClient } from "@/shared/services/supabase/client";

/**
 * Autenticar usuario con email y password
 * Solo lógica de cliente, sin redirecciones
 */
export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Obtener el rol del usuario autenticado
 */
export async function getUserRole(): Promise<string | undefined> {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  return data?.user?.user_metadata?.role;
}

