#!/usr/bin/env node

/**
 * Script para probar el envío de correos
 * Ejecuta: node test-email.js
 */

const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testEmailSending() {
  console.log('🧪 Probando envío de correos...\n');

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('❌ Error: RESEND_API_KEY no está configurada en .env.local');
    console.log('Obtén tu API key desde: https://resend.com');
    process.exit(1);
  }

  const resend = new Resend(resendApiKey);

  try {
    // Correo de prueba
    const testEmail = 'tu-email-de-prueba@example.com'; // Cambia esto por tu email real

    console.log(`📧 Enviando correo de prueba a: ${testEmail}`);

    const data = await resend.emails.send({
      from: 'noreply@findabank.com',
      to: testEmail,
      subject: 'Prueba FindABank - Envío de Correos',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Prueba de FindABank</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #dc2626; text-align: center;">¡Prueba Exitosa! 🎉</h1>
              <p style="font-size: 16px; margin: 20px 0;">
                Este es un correo de prueba enviado desde FindABank.
              </p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #1f2937; margin-top: 0;">Funcionalidades probadas:</h2>
                <ul>
                  <li>✅ Conexión con Resend API</li>
                  <li>✅ Envío de correos HTML</li>
                  <li>✅ Plantillas de campaña</li>
                  <li>✅ Envío masivo (hasta 100 emails/batch)</li>
                </ul>
              </div>
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                Si recibiste este correo, ¡el sistema de envío funciona correctamente!
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Correo enviado exitosamente!');
    console.log('📨 ID del correo:', data.data?.id);
    console.log('\n💡 Revisa tu bandeja de entrada (y spam) para confirmar que llegó el correo.');

  } catch (error) {
    console.error('\n❌ Error enviando correo de prueba:');
    console.error(error.message);

    if (error.message.includes('domain')) {
      console.log('\n💡 Posible solución: Verifica que "findabank.com" esté autorizado en Resend');
      console.log('O cambia el dominio en el código a uno autorizado');
    }
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  testEmailSending();
}

module.exports = { testEmailSending };