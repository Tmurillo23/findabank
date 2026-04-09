import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

interface BulkEmailOptions {
  emails: string[];
  subject: string;
  message: string;
}

/**
 * Envía un mensaje a un array de correos electrónicos (Bulk email)
 * Usando Resend (Gratis y sin login de Google)
 */
export async function sendBulkEmails(
  from_email: string,
  { emails, subject, message }: BulkEmailOptions
) {
  try {
    // Resend tiene límite de 100 emails por batch, así que dividimos
    const batchSize = 100;
    let totalSent = 0;
    const errors: string[] = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      const emailPayloads = batch.map((email) => ({
        from: from_email || 'noreply@findabank.com',
        to: email,
        subject: subject,
        html: message,
      }));

      try {
        const data = await resend.batch.send(emailPayloads);
        totalSent += batch.length;
      } catch (error) {
        errors.push(`Lote ${Math.floor(i / batchSize) + 1}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }

    return {
      success: errors.length === 0,
      sentCount: totalSent,
      failedCount: Math.max(0, emails.length - totalSent),
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('Error al enviar correos masivos:', error);
    throw error;
  }
}
