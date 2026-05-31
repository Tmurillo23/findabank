
import type { StockStatus } from "@/features/banks/types";

export type milkStock = "calostro" | "leche_de_transicion" | "leche_madura";

export const MILK_TYPES: milkStock[] = ["calostro", "leche_de_transicion", "leche_madura"];

export interface MilkStock {
  id: string;
  banco_id: string;
  tipo_leche: string;
  situacion: StockStatus;
  updated_at: string;
}


export interface CreateMilkStockInput {
  banco_id: string;
  tipo_leche: string;
  situacion: StockStatus;
}

export interface MilkStockDisplayProps {
  bancoId: string;
}

