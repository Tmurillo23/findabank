import { createClient } from "@/shared/services/supabase/client";
import type { UserRole } from "@/features/auth/types";

export async function signUpWithEmail(
  email: string,
  password: string,
  role: UserRole
) {
  const supabase = createClient();

  const redirectPath =
    role === "donor"
      ? "/donor/update-profile"
      : role === "blood_bank" || role === "milk_bank"
      ? `/bank/update-profile?role=${role}`
      : "/404-error";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role, // Guardar rol en metadata del usuario
      },
      emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/confirm?next=${encodeURIComponent(redirectPath)}`,
    },
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("No user returned from signup");
  }

  return data.user;
}
