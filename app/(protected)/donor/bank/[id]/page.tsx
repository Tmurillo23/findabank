import { BankViewPage } from "@/features/donors/components/BankViewPage";

export default async function BankPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <BankViewPage bankId={id} />
      </div>
    </div>
  );
}

