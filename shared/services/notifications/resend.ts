import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

interface BulkEmailOptions {
  emails: string[];
  subject: string;
  message: string;
}

/**
 * Envía un mensaje a un array de correos electrónicos (Bulk email)
 */
export async function sendBulkEmails({ emails, subject, message }: BulkEmailOptions) {
  // Preparamos el array de configuración de correos para `resend.batch.send`
  const emailPayloads = emails.map((email) => ({
    from: 'onboarding@resend.dev', // Asegúrate de reemplazar esto por tu dominio verificado cuando pases a producción
    to: email,
    subject: subject,
    html: message,
  }));

  try {
    const data = await resend.batch.send(emailPayloads);
    return data;
  } catch (error) {
    console.error("Error al enviar correos masivos:", error);
    throw error;
  }
}
