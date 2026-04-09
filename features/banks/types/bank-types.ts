/**
 * Tipos e interfaces para la entidad Banco (Banks)
 */

/**
 * Tipo de banco válido
 */
export type BankType = "blood" | "milk";

/**
 * Mapeo de tipos de banco a valores de base de datos
 */
export const BANK_TYPE_MAP: Record<BankType, string> = {
    blood: "sangre",
    milk: "leche",
};


/**
 * Perfil completo de un banco en la BD
 */
export interface BankProfile {
    id: string;
    nombre: string;
    tipo: BankType;
    descripcion?: string;
    direccion: string;
    latitude: string;
    longitude: string;
    created_at: string;
}

/**
 * Entrada para crear un nuevo perfil de banco
 */
export interface UpdateBankProfileInput {
    nombre?: string;
    tipo?: string;
    direccion?: string;
    descripcion?: string;
    latitude?: string;
    longitude?: string;
}




export type BankConfigTabKey = "perfil" | "stock";

/**
 * Estado de stock válido
 */
export type StockStatus = "suficiente" | "critico" | "no_hay";
