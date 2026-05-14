"use client";

import Link from "next/link";
import { Button } from "@/shared";
import { useAuth } from "@/shared/hooks/useAuth";
import { LogoutButton } from "./LogoutButton";

export function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
    );
  }

  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Usuario";

  return user ? (
    <div className="flex items-center gap-4">
      <span className="font-medium text-slate-700">
        Hey, {displayName}!
      </span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link className="px-4 py-2" href="/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link className="px-4 py-2" href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}