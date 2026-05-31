"use client";

import { cn } from "@/shared/services/utils";
import { signUpWithEmail } from "@/features/auth/services/signupClient";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";
import Link from "next/link";
import { useState } from "react";
import type { UserRole } from "@/features/auth/types";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState<UserRole>("donor");
  const [isLoading, setIsLoading] = useState(false);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      throw new Error("Las contraseñas no coinciden");
    }

    setIsLoading(true);

    await signUpWithEmail(email, password, role);

    if (role === "donor") {
      window.location.href = "/donor/update-profile";
    } else if (role === "blood_bank" || role === "milk_bank") {
      window.location.href = `/bank/update-profile?role=${role}`;
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="max-w-xl mx-auto">
        <CardHeader className="space-y-3">
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>Regístrate para comenzar a donar o recibir.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">¿Qué tipo de cuenta deseas?</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="flex h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-primary/30"
                required
              >
                <option value="donor">Donante</option>
                <option value="blood_bank">Banco de Sangre</option>
                <option value="milk_bank">Banco de Leche</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repeat-password">Repetir contraseña</Label>
              <Input
                id="repeat-password"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-600">
            ¿Ya tienes cuenta? {" "}
            <Link href="/login" className="font-semibold text-slate-950 underline-offset-4 hover:text-slate-700 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

