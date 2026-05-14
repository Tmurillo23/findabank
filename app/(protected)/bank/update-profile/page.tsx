"use client";

import Link from "next/link";
import { BankUpdateForm } from "@/features/banks/components";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BankUpdateProfileContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  return (
    <div className="min-h-screen relative p-4 flex items-start justify-center pt-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Editar perfil del banco</p>
            <h1 className="text-3xl font-bold">Actualizar información</h1>
          </div>
          <Link href="/bank" className="text-sm font-medium text-blue-600 hover:underline">
            Volver al Dashboard
          </Link>
        </div>
        <BankUpdateForm />
      </div>
    </div>
  );
}

export default function BankUpdateProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <BankUpdateProfileContent />
    </Suspense>
  );
}

