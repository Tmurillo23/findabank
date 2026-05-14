import Link from "next/link";
import { BankProfileForm } from "@/features/banks/components";

export default function BankProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Perfil del banco</p>
            <h1 className="text-3xl font-bold">Ver información del banco</h1>
          </div>
          <Link href="/bank" className="text-sm font-medium text-blue-600 hover:underline">
            Volver al Dashboard
          </Link>
        </div>
        <BankProfileForm />
      </div>
    </div>
  );
}

