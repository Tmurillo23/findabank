export type BankType = "blood" | "milk";


export const BANK_TYPE_MAP: Record<BankType, string> = {
    blood: "sangre",
    milk: "leche",
};


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
