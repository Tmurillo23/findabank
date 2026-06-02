import { createClient } from "@/shared/services/supabase/client";
import { mapSignUpError } from "@/shared/services/errors";
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
        role,
      },
      emailRedirectTo: `${globalThis.window === undefined ? "" : globalThis.window.location.origin}/confirm?next=${encodeURIComponent(redirectPath)}`,
    },
  });

  if (error) {
    const mappedError = mapSignUpError(error);
    if (mappedError) {
      throw mappedError;
    }
  }

  if (!data.user) {
    throw new Error("No user returned from signup");
  }

  return data.user;
}
