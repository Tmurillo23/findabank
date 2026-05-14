import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared";

export default function DonorFindBanksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Bancos cercanos</p>
            <h1 className="text-3xl font-bold">Buscar Bancos</h1>
          </div>
          <Link href="/donor" className="text-sm font-medium text-blue-600 hover:underline">
            Volver al Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Funcionalidad en desarrollo</CardTitle>
            <CardDescription>
              Próximamente podrás buscar banks cercanos, ver disponibilidad de stock y contactar directamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Por ahora esta página sirve como un punto de partida para que el usuario pueda navegar.
            </p>
            <p>
              La función será mejorada pronto para mostrar bancos disponibles según tu ubicación y tipo de donación.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
