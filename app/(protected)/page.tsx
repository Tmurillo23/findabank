import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/shared/services/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared";

async function getUserRole() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  return data.claims;
}

export default async function ProtectedPage() {
  const claims = await getUserRole();
  const userRole = claims?.user_role || null;

  if (userRole === "bank") {
    redirect("/bank");
  } else if (userRole === "donor") {
    redirect("/donor");
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-white via-slate-100 to-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Selecciona tu rol</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-950">¿Cómo quieres trabajar hoy?</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Elige tu perfil y entra a un dashboard adaptado a tus necesidades como banco o donante.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-lg shadow-slate-950/10">
              <p className="font-semibold">Consejo rápido</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Si ya tienes un rol asignado, selecciona la opción correspondiente para continuar.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
            <CardHeader>
              <CardTitle>Banco de Sangre / Leche</CardTitle>
              <CardDescription>Gestiona donaciones y campañas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-6">
                Acceso para administradores de bancos. Crea campañas, maneja stocks y contacta donantes.
              </p>
              <Link
                href="/bank"
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ir al dashboard de banco
              </Link>
            </CardContent>
          </Card>

          <Card className="border-slate-200 transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
            <CardHeader>
              <CardTitle>Donante</CardTitle>
              <CardDescription>Gestiona tu perfil de donación</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-6">
                Acceso para donantes. Actualiza tu perfil, busca bancos cercanos y recibe campañas.
              </p>
              <Link
                href="/donor"
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ir al dashboard de donante
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
