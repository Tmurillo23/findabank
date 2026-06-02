"use server";

import { redirect } from "next/navigation";
import { mapSupabaseError } from "@/shared/services/errors";


export async function redirectByRole() {
  const supabase = await (await import("@/shared/services/supabase/server")).createClient();

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    const mappedError = mapSupabaseError(error);
    if (mappedError) {
      throw mappedError;
    }
    throw new Error("Error al obtener datos del usuario");
  }

  if (!user) {
    throw new Error("No se encontró usuario autenticado. Por favor intenta de nuevo.");

  }

  const userRole = user.user_metadata?.role;

  if (userRole === "donor") {
    redirect("/donor");
  } else if (userRole === "blood_bank" || userRole === "milk_bank") {
    redirect("/bank");
  } else {
    redirect("/");
  }
}
