import { BankViewPage } from "@/features/donors/components/BankViewPage";

export default function BankPublicProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <BankViewPage bankId={params.id} />
      </div>
    </div>
  );
}

