"use client";

import Link from "next/link";
import { Button } from "@/shared";
import { useAuth } from "@/shared/hooks/useAuth";
import { LogoutButton } from "./LogoutButton";

export function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-10 w-24 rounded-full bg-slate-200 animate-pulse" />;
  }

  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Usuario";

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm font-semibold text-slate-700">Hola, {displayName}</span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild size="sm" variant="outline">
        <Link href="/login">Iniciar sesión</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Registrarse</Link>
      </Button>
    </div>
  );
}