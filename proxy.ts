import { updateSession } from "@/shared/services/supabase/proxy";
import { type NextRequest } from "next/server";

/**
 * Proxy para autenticación y autorización
 * - Verifica si el usuario tiene sesión válida en Supabase
 * - Redirige según el rol (donor vs bank_admin)
 * - Protege rutas que requieren autenticación
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
