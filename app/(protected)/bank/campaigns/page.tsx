import { redirect } from "next/navigation";
import { createClient } from "@/shared/services/supabase/server";
import { getCampaignsByBank } from "@/features/campaigns";
import { CampaignsManager } from "@/features/campaigns/components";

export default async function CampaignsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get Bank info
  const { data: bankData, error } = await supabase
    .from("banco")
    .select("id, nombre, tipo")
    .eq("id", user.id)
    .single();

  if (error || !bankData) {
    // Si no es un banco, redirigir a un lugar seguro
    redirect("/404-error");
  }

  const initialCampaigns = await getCampaignsByBank(bankData.id);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Campañas</h1>
        <p className="text-muted-foreground">
          Crea campañas de donación y notifica a los donantes cercanos.
        </p>
      </div>

      <CampaignsManager
        bancoId={bankData.id}
        bankType={bankData.tipo}
        bankName={bankData.nombre}
        initialCampaigns={initialCampaigns}
      />
    </div>
  );
}

