"use client";

import { BankUpdateForm } from "@/features/banks/components";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BankUpdateProfileContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  return (
    <div className="min-h-screen relative p-4 flex items-start justify-center pt-10">
      <BankUpdateForm initialRole={role as "blood_bank" | "milk_bank" | null} />
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

