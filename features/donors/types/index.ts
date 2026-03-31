/**
 * Tipos e interfaces para la entidad Donors (Donantes)
 */

/**
 * Tipo de sangre válido
 */
export type BloodType = "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-";

/**
 * Perfil completo de un donante en la BD
 */
export interface DonorProfile {
  id: string;
  full_name: string;
  blood_type: BloodType;
  puede_donar_leche: boolean;
  descripcion?: string;
  created_at: string;
}

/**
 * Entrada para crear un nuevo perfil de donante
 */
export interface CreateDonorProfileInput {
  full_name: string;
  blood_type: BloodType;
  puede_donar_leche: boolean;
  description?: string;
}

/**
 * Entrada para actualizar un perfil de donante
 */
export interface UpdateDonorProfileInput {
  full_name?: string;
  blood_type?: BloodType;
  puede_donar_leche?: boolean;
  description?: string;
}

