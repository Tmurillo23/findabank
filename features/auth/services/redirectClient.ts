"use server";

import { redirect } from "next/navigation";

/**
 * Server action: Obtener rol y redirigir
 * Se ejecuta después de autenticación exitosa
 */
export async function redirectByRole() {
  const supabase = await (await import("@/shared/services/supabase/server")).createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const userRole = user.user_metadata?.role;

  // Redirigir según rol
  if (userRole === "donor") {
    redirect("/donor");
  } else if (userRole === "blood_bank" || userRole === "milk_bank") {
    redirect("/bank");
  } else {
    // Si no tiene rol, redirigir a home
    redirect("/");
  }
}
