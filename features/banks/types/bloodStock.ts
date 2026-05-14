
import type { BloodType } from "@/features/donors/types";
import type { StockStatus } from "@/features/banks/types";


export interface BloodStock {
  id: string;
  banco_id: string;
  tipo_sangre: BloodType;
  situacion: StockStatus;
  updated_at: string;
}


export interface CreateBloodStockInput {
  banco_id: string;
  tipo_sangre: BloodType;
  situacion: StockStatus;
}



