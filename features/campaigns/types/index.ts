/**
 * Tipos e interfaces para Campañas (Campaigns)
 */

/**
 * Perfil completo de una campaña en la BD
 */
export interface Campaign {
  id: string;
  banco_id: string;
  nombre: string;
  descripcion?: string;
  ubicacion: string;
  fecha: string; // YYYY-MM-DD
  created_at: string;
}

/**
 * Entrada para crear una nueva campaña
 */
export interface CreateCampaignInput {
  banco_id: string;
  nombre: string;
  descripcion?: string;
  ubicacion: string;
  fecha: string; // YYYY-MM-DD
}


