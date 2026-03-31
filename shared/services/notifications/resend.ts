
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

interface BulkEmailOptions {
  emails: string[];
  subject: string;
  message: string;
}

/**
 * Envía un mensaje a un array de correos electrónicos (Bulk email)
 * MÁXIMO 100 CORREOS POR LLAMADA A ESTA FUNCIÓN POR LIMITACIONES DE LA API Y PLAN QUE TENEMOS
 */
export async function sendBulkEmails(from_email : string,{emails, subject, message }: BulkEmailOptions) {
  const emailPayloads = emails.map((email) => ({
    from: from_email,
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
