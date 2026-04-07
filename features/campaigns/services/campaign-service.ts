"use server";

import { createClient } from "@/shared/services/supabase/server";
import { sendBulkEmails } from "@/shared/services/notifications/resend";
import { getDonorEmailsByRadius } from "@/features/banks/services/bankCampaignService";

export interface CreateCampaignOptions {
  banco_id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  radiusKm: number;
  isMilkBank: boolean;
  bankName: string;
}

export interface Campaign {
  id: string;
  banco_id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  fecha: string;
  created_at: string;
}

export async function getCampaignsByBank(bancoId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campana")
    .select("*")
    .eq("banco_id", bancoId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching campaigns:", error);
    throw new Error("No se pudieron cargar las campañas");
  }

  return data as Campaign[];
}



export async function createLocalCampaign(options: CreateCampaignOptions) {
  const supabase = await createClient();

  // 1. Insert the campaign in the database
  const { data: campaignData, error: insertError } = await supabase
    .from("campana")
    .insert({
      banco_id: options.banco_id,
      nombre: options.nombre,
      descripcion: options.descripcion,
      ubicacion: options.ubicacion,
      fecha: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error interting campaign:", insertError);
    throw new Error("No se pudo crear la campaña en la base de datos.");
  }

  // 2. Find donors in the radius
  try {
    const emails = await getDonorEmailsByRadius(options.banco_id, options.radiusKm, options.isMilkBank);

    // 3. Send bulk emails via Resend
    if (emails && emails.length > 0) {
      const subject = `Nueva campaña de donación: ${options.nombre}`;
      const message = `
        <h2>${options.nombre}</h2>
        <p>El banco <strong>${options.bankName}</strong> ha iniciado una campaña cerca de ti.</p>
        <p>${options.descripcion}</p>
        <p><strong>Ubicación:</strong> ${options.ubicacion}</p>
        <br/>
        <p>Por favor acércate a donar y ayuda a salvar vidas.</p>
      `;

      // We use a verified domain email in Resend, adjust this 'from' email to your verified Resend domain
      const fromEmail = "onboarding@resend.dev";

      await sendBulkEmails(fromEmail, {
        emails: emails,
        subject,
        message,
      });
    }

    return campaignData;
  } catch (error) {
    console.error("Error in campaign notification process:", error);
    // Even if emails fail, the DB record was created, so we return it but might want to handle partial failures
    return campaignData;
  }
}
