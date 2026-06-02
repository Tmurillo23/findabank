import { DonorDashboard } from "@/features/donors/components";

export default function DonorProfilePage() {
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <DonorDashboard />
      </div>
    </div>
  );
}

