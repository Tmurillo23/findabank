/**
 * Tipos e interfaces para Horarios de Banco (Bank Hours)
 */

/**
 * Día de la semana válido
 */
export type DayOfWeek = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

/**
 * Horario de un banco para un día específico
 */
export interface BankHours {
  id: string;
  banco_id: string;
  dia_semana: DayOfWeek;
  hora_inicio: string; // HH:MM formato
  hora_fin: string;    // HH:MM formato
  duracion_bloque_min?: number;
}

/**
 * Entrada para crear horarios de banco
 */
export interface CreateBankHoursInput {
  banco_id: string;
  dia_semana: DayOfWeek;
  hora_inicio: string;
  hora_fin: string;
  duracion_bloque_min?: number;
}

/**
 * Entrada para actualizar horarios de banco
 */
export interface UpdateBankHoursInput {
  hora_inicio?: string;
  hora_fin?: string;
}
