export interface WorkoutLog {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  sets: number;
  date: string;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  logs: WorkoutLog[];
}

export interface BodyWeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

/**
 * Registro nutricional diário — deliberadamente simples (só os totais do
 * dia, não um diário de refeições). O objetivo é cruzar com a evolução de
 * peso/treino, não substituir um app de contagem de calorias.
 */
export interface NutritionEntry {
  id: string;
  date: string;
  calories?: number;
  protein?: number;
  notes?: string;
}

export type Theme = 'light' | 'dark';

export interface ReminderSettings {
  enabled: boolean;
  /** Hora do lembrete diário, formato 24h (0-23). */
  hour: number;
  /** Minuto do lembrete diário (0-59). */
  minute: number;
}

