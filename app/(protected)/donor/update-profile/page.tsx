import { DonorUpdateForm } from "@/features/donors/components/DonorUpdateForm";

export default function DonorUpdateProfilePageRoute() {
  return (
    <div className="min-h-screen p-4 flex items-start justify-center pt-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Editar perfil de donante</p>
            <h1 className="text-3xl font-bold">Actualizar información</h1>
          </div>
        </div>
        <DonorUpdateForm />
      </div>
    </div>
  );
}

