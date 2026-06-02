"use client";

import { cn } from "@/shared/services/utils";
import { signUpWithEmail } from "@/features/auth/services/signupClient";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";
import Link from "next/link";
import { useState } from "react";
import type { UserRole } from "@/features/auth/types";
import { isSignUpError } from "@/shared/services/errors";

export function SignUpForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState<UserRole>("donor");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    signUpWithEmail(email, password, role)
      .then(() => {
        if (role === "donor") {
          globalThis.location.href = "/donor/update-profile";
        } else if (role === "blood_bank" || role === "milk_bank") {
          globalThis.location.href = `/bank/update-profile?role=${role}`;
        }
      })
      .catch((err) => {
        if (isSignUpError(err)) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error inesperado durante el registro");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
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
                <option value="milk_bank">Banco de Leche Materna</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="*******"
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
                placeholder="*******"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

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

