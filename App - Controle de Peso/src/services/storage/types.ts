import { Exercise, BodyWeightEntry, NutritionEntry, Theme, ReminderSettings } from '../../types';

/**
 * Contrato de persistência da aplicação.
 *
 * A UI (App.tsx e componentes) só conhece esta interface — nunca o
 * localStorage, uma API REST, Supabase, etc. diretamente. Isso permite
 * trocar o "onde" os dados são guardados sem tocar em nenhum componente.
 *
 * Todos os métodos são assíncronos de propósito: mesmo a implementação
 * local (síncrona por natureza) retorna Promises, para que uma futura
 * implementação remota (fetch a uma API, SDK do Supabase/Firebase, etc.)
 * possa ser um "drop-in replacement" sem mudar nenhuma chamada.
 */
export interface StorageAdapter {
  /** Retorna a lista de exercícios salva, ou null se nunca houve dados salvos. */
  loadExercises(): Promise<Exercise[] | null>;

  /** Persiste a lista completa de exercícios (substitui o estado salvo). */
  saveExercises(exercises: Exercise[]): Promise<void>;

  /** Retorna o histórico de peso corporal salvo, ou null se nunca houve dados. */
  loadBodyWeightLogs(): Promise<BodyWeightEntry[] | null>;

  /** Persiste a lista completa de registros de peso corporal. */
  saveBodyWeightLogs(logs: BodyWeightEntry[]): Promise<void>;

  /** Retorna o histórico nutricional salvo, ou null se nunca houve dados. */
  loadNutritionLogs(): Promise<NutritionEntry[] | null>;

  /** Persiste a lista completa de registros nutricionais. */
  saveNutritionLogs(logs: NutritionEntry[]): Promise<void>;

  /** Indica se o usuário já passou pela tela de boas-vindas alguma vez. */
  hasVisited(): Promise<boolean>;

  /** Marca que o usuário já viu a tela de boas-vindas. */
  markVisited(): Promise<void>;

  /** Retorna o tema salvo, ou null se o usuário nunca escolheu um. */
  loadTheme(): Promise<Theme | null>;

  /** Persiste o tema escolhido pelo usuário. */
  saveTheme(theme: Theme): Promise<void>;

  /** Retorna a configuração de lembrete diário salva, ou null. */
  loadReminderSettings(): Promise<ReminderSettings | null>;

  /** Persiste a configuração de lembrete diário. */
  saveReminderSettings(settings: ReminderSettings): Promise<void>;
}

