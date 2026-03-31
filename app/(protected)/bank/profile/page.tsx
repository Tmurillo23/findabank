import { BankProfileForm } from "@/features/banks/components";

export default function BankProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <BankProfileForm />
      </div>
    </div>
  );
}

