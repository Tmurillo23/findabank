/**
 * Tipos e interfaces para Stock de Sangre (Blood Stock)
 */

import type { BloodType } from "@/features/donors/types";
import type { StockStatus } from "@/features/banks/types";

/**
 * Stock de sangre en la BD
 */
export interface BloodStock {
  id: string;
  banco_id: string;
  tipo_sangre: BloodType;
  situacion: StockStatus;
  updated_at: string;
}

/**
 * Entrada para crear un nuevo stock de sangre
 */
export interface CreateBloodStockInput {
  banco_id: string;
  tipo_sangre: BloodType;
  situacion: StockStatus;
}

/**
 * Entrada para actualizar stock de sangre
 */
export interface UpdateBloodStockInput {
  situacion?: StockStatus;
}

