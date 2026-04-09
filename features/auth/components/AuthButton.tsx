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


