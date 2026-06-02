export type BankType = "blood" | "milk";


export const BANK_TYPE_MAP: Record<BankType, string> = {
    blood: "sangre",
    milk: "leche",
};

export const STOCK_SITUATIONS : StockStatus[] = ["suficiente", "critico", "no_hay"] as const;

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

export interface BankData {
    id: string;
    nombre: string;
    tipo: string;
    descripcion?: string;
    direccion: string;
    location?: string;
    created_at: string;
}

export interface DashboardMetrics {
    total_items_stock: number;
    items_suficiente: number;
    items_critico: number;
    items_agotado: number;
    total_campanas: number;
    campanas_activas: number;
    proxima_campana: string | null;
    estado_general: string;
}

export interface ActivityItem {
    indice_por_banco: number;
    tipo_actividad: string;
    fecha_actividad: string;
    categoria: string;
}

export interface ActivityTimelineProps {
    activities: ActivityItem[];
}

export interface MilkStockEditorProps {
    bancoId?: string;
    readOnly?: boolean;
}

export type BankConfigTabKey = "perfil" | "stock";


export type StockStatus = "suficiente" | "critico" | "no_hay";
