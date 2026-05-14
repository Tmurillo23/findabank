
import type { StockStatus } from "@/features/banks/types";


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


export interface UpdateMilkStockInput {
  situacion?: StockStatus;
}

