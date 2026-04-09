"use server";

import { createClient } from "@/shared/services/supabase/server";


export async function getAuthenticatedUser() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  return data?.claims;
}

