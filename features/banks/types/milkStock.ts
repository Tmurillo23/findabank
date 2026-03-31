/**
 * Tipos e interfaces para Stock de Leche (Milk Stock)
 */

import type { StockStatus } from "@/features/banks/types";

/**
 * Stock de leche en la BD
 */
export interface MilkStock {
  id: string;
  banco_id: string;
  tipo_leche: string;
  situacion: StockStatus;
  updated_at: string;
}

/**
 * Entrada para crear un nuevo stock de leche
 */
export interface CreateMilkStockInput {
  banco_id: string;
  tipo_leche: string;
  situacion: StockStatus;
}

/**
 * Entrada para actualizar stock de leche
 */
export interface UpdateMilkStockInput {
  situacion?: StockStatus;
}

