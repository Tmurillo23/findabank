import Link from "next/link";
import { Button } from "@/shared";
import { getAuthenticatedUser } from "@/features/auth/services/getUserAction";
import { LogoutButton } from "./LogoutButton";

export async function AuthButton() {
  // Obtener usuario autenticado (lógica servidor)
  const user = await getAuthenticatedUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}


