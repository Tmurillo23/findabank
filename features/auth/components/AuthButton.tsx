// import Link from "next/link";
// import { Button } from "@/shared";
// import { getAuthenticatedUser } from "@/features/auth/services/getUserAction";
// import { LogoutButton } from "./LogoutButton";

// export async function AuthButton() {
//   // Obtener usuario autenticado (lógica servidor)
//   const user = await getAuthenticatedUser();

//   return user ? (
//     <div className="flex items-center gap-4">
//        Hey, {user.email}!
//       <LogoutButton />
//     </div>
//   ) : (
//     <div className="flex gap-2">
//       <Button asChild size="sm" variant={"outline"}>
//         <Link className="px-4 py-2" href="/login">Sign in</Link>
//       </Button>
//       <Button asChild size="sm" variant={"default"}>
//         <Link className="px-4 py-2" href="/sign-up">Sign up</Link>
//       </Button>
//     </div>
//   );
// }

import Link from "next/link";
import { Button } from "@/shared";
import { getAuthenticatedUser } from "@/features/auth/services/getUserAction";
import { LogoutButton } from "./LogoutButton";
import { createClient } from "@/shared/services/supabase/server";

export async function AuthButton() {
  const user = await getAuthenticatedUser();
  const supabase = await createClient();

  let displayName = "";

  if (user) {
    // Intentamos buscar en 'donors' (que es lo que usamos antes)
    // Pero pedimos tanto 'full_name' como 'nombre' por si acaso
    const { data: profile } = await supabase
      .from("donors") 
      .select("full_name, nombre") 
      .eq("id", user.id)
      .single();

    // Prioridad 1: Usar el nombre de la base de datos
    const rawName = profile?.full_name || profile?.nombre;
    
    if (rawName) {
      displayName = rawName.split(" ")[0];
    } else {
      // Prioridad 2: Si la DB falla, limpiamos el email
      const emailName = user.email?.split("@")[0] || "";
      displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
  }

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