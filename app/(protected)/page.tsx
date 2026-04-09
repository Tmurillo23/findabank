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
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <div className="w-full">
        <div className="bg-blue-50 border border-blue-200 text-blue-900 text-sm p-3 px-5 rounded-md flex gap-3 items-center">
          <span className="text-lg">ℹ️</span>
          <div>
            <p className="font-semibold">Bienvenido a FindABank</p>
            <p>Selecciona tu rol para acceder al dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Elige tu rol</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>🩸 Banco de Sangre/Leche</CardTitle>
              <CardDescription>
                Gestiona donaciones y campañas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Acceso para administradores de bancos. Crea campañas, maneja stocks y contacta donantes.
              </p>
              <button
                onClick={() => (window.location.href = "/bank")}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Ir al Dashboard de Banco
              </button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>👤 Donante</CardTitle>
              <CardDescription>
                Gestiona tu perfil de donación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Acceso para donantes. Actualiza tu perfil, busca bancos cercanos y recibe campañas.
              </p>
              <button
                onClick={() => (window.location.href = "/donor")}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Ir al Dashboard de Donante
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
