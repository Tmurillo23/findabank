import { DonorProfileForm } from "@/features/donors/components/DonorProfileForm";

export default function DonorProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <DonorProfileForm />
      </div>
    </div>
  );
}

