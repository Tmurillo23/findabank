/**
 * Tipos e interfaces de Autenticación y Usuario
 */

/**
 * Rol de usuario válido
 */
export type UserRole = "donor" | "blood_bank" | "milk_bank";

/**
 * Perfil de usuario autenticado
 */
export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
}


