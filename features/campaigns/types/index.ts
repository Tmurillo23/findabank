/**
 * Tipos e interfaces para Campañas (Campaigns)
 */

export type UserType = 'donors' | 'banks';

/**
 * Distribuciones de radio predefinidas (en km)
 */
export const PREDEFINED_RADIUS = {
  1: '1 km',
  5: '5 km',
  10: '10 km',
  20: '20 km',
  50: '50 km'
} as const;

/**
 * Perfil completo de una campaña en la BD
 */
export interface Campaign {
  id: string;
  banco_id: string;
  nombre: string;
  descripcion?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Entrada para crear una nueva campaña
 */
export interface CreateCampaignInput {
  banco_id: string;
  nombre: string;
  descripcion?: string;
}

/**
 * Parámetros para enviar una campaña
 */
export interface SendCampaignInput {
  campaign_id: string;
  user_type: UserType;
  radius_km: number;
  emails?: string[]; // Nueva propiedad para emails manuales
}


