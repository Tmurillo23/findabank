"use client";

import { cn } from "@/shared/services/utils";
import { signInWithPassword } from "@/features/auth/services/loginClient";
import { redirectByRole } from "@/features/auth/services/redirectClient";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label
} from "@/shared";
import Link from "next/link";
import React, { useState } from "react";

export function LoginForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Usar encadenamiento de promesas en lugar de try/catch
    signInWithPassword(email, password)
      .then(() => {
        // redirectByRole lanza el error especial NEXT_REDIRECT que Next manejará
        return redirectByRole();
      })
      .catch((err) => {
        // Re-lanzar redirecciones internas de Next.js para que no se muestren
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
          throw err;
        }

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al iniciar sesión. Por favor intenta de nuevo.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="max-w-xl mx-auto">
        <CardHeader className="space-y-3 text-center">
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-6">
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
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-600">
            ¿No tienes cuenta? {" "}
            <Link href="/sign-up" className="font-semibold text-slate-950 underline-offset-4 hover:text-slate-700 hover:underline">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


