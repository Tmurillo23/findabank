'use client';

import { Campaign, CreateCampaignInput, SendCampaignInput, UserType } from '../types';
import { sendBulkEmails } from '@/shared/services/notifications/resend';

/**
 * Generar ID único
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Obtener campañas desde localStorage
 */
function getCampaignsFromStorage(): Campaign[] {
  try {
    const stored = localStorage.getItem('findabank_campaigns');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Guardar campañas en localStorage
 */
function saveCampaignsToStorage(campaigns: Campaign[]): void {
  try {
    localStorage.setItem('findabank_campaigns', JSON.stringify(campaigns));
  } catch (error) {
    console.error('Error saving campaigns to localStorage:', error);
  }
}

/**
 * Crear una nueva campaña (localStorage)
 */
export async function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));

  const campaign: Campaign = {
    id: generateId(),
    banco_id: input.banco_id,
    nombre: input.nombre,
    descripcion: input.descripcion,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Guardar en localStorage
  const campaigns = getCampaignsFromStorage();
  campaigns.push(campaign);
  saveCampaignsToStorage(campaigns);

  console.log('✅ Campaña creada:', campaign);
  return campaign;
}

/**
 * Obtener todas las campañas de un banco (localStorage)
 */
export async function getBankCampaigns(bankId: string): Promise<Campaign[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const campaigns = getCampaignsFromStorage();
  const bankCampaigns = campaigns.filter(c => c.banco_id === bankId);

  console.log(`📋 Campañas encontradas para banco ${bankId}:`, bankCampaigns.length);
  return bankCampaigns;
}

/**
 * Obtener una campaña específica (localStorage)
 */
export async function getCampaign(campaignId: string): Promise<Campaign> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));

  const campaigns = getCampaignsFromStorage();
  const campaign = campaigns.find(c => c.id === campaignId);

  if (!campaign) {
    throw new Error('Campaña no encontrada');
  }

  return campaign;
}

/**
 * Obtener usuarios de prueba (sin BD)
 */
function getMockUsers(userType: UserType) {
  const mockUsers = {
    donors: [
      { id: '1', email: 'juan@example.com', name: 'Juan Pérez' },
      { id: '2', email: 'maria@example.com', name: 'María García' },
      { id: '3', email: 'carlos@example.com', name: 'Carlos López' },
      { id: '4', email: 'ana@example.com', name: 'Ana Rodríguez' },
      { id: '5', email: 'luis@example.com', name: 'Luis Martínez' },
      { id: '6', email: 'sofia@example.com', name: 'Sofía Sánchez' },
      { id: '7', email: 'diego@example.com', name: 'Diego Torres' },
      { id: '8', email: 'valentina@example.com', name: 'Valentina Ruiz' },
    ],
    banks: [
      { id: 'b1', email: 'redcross@example.com', name: 'Cruz Roja' },
      { id: 'b2', email: 'banco1@example.com', name: 'Banco de Sangre Central' },
      { id: 'b3', email: 'banco2@example.com', name: 'Hospital General' },
      { id: 'b4', email: 'banco3@example.com', name: 'Clínica San José' },
    ],
  };

  return mockUsers[userType];
}

/**
 * Enviar una campaña (con envío real de correos)
 */
export async function sendCampaign(input: SendCampaignInput): Promise<{
  success: boolean;
  sentCount: number;
  failedCount: number;
  errors?: string[];
}> {
  console.log('🚀 Iniciando envío de campaña...');

  // Simular delay de carga
  await new Promise(resolve => setTimeout(resolve, 500));

  const campaign = await getCampaign(input.campaign_id);
  console.log(`📧 Enviando campaña: "${campaign.nombre}"`);

  // Obtener emails para enviar
  let emailList: string[];
  let recipientNames: string[] = [];

  if (input.emails && input.emails.length > 0) {
    // Emails manuales
    emailList = input.emails;
    recipientNames = input.emails.map(email => email.split('@')[0]);
    console.log(`📝 Enviando a ${emailList.length} emails manuales`);
  } else {
    // Por tipo de usuario
    const users = getMockUsers(input.user_type);
    emailList = users.map(user => user.email);
    recipientNames = users.map(user => user.name);
    console.log(`👥 Enviando a ${emailList.length} ${input.user_type}`);
  }

  if (emailList.length === 0) {
    console.log('⚠️ No hay emails para enviar');
    return {
      success: true,
      sentCount: 0,
      failedCount: 0,
      errors: ['No hay emails para enviar'],
    };
  }

  // Enviar usando Resend (correos reales)
  const result = await sendBulkEmails(
    'noreply@findabank.com',
    {
      emails: emailList,
      subject: campaign.nombre,
      message: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${campaign.nombre}</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #dc2626; text-align: center;">${campaign.nombre}</h1>
              ${campaign.descripcion ? `<p style="font-size: 16px; margin: 20px 0;">${campaign.descripcion.replace(/\n/g, '<br>')}</p>` : ''}
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #1f2937; margin-top: 0;">¡Tu ayuda es importante!</h2>
                <p>Has recibido esta campaña porque eres parte de nuestra comunidad de donantes.</p>
                <p>Si puedes ayudar, por favor contacta al banco más cercano.</p>
              </div>
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                Este mensaje fue enviado por FindABank
              </p>
            </div>
          </body>
        </html>
      `,
    }
  );

  console.log(`✅ Resultado del envío: ${result.sentCount} enviados, ${result.failedCount} fallidos`);

  return result;
}