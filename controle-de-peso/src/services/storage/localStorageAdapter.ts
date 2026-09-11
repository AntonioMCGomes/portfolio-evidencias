import { Exercise, BodyWeightEntry, NutritionEntry, Theme, ReminderSettings } from '../../types';
import { StorageAdapter } from './types';

const EXERCISES_KEY = 'workout-exercises';
const HAS_VISITED_KEY = 'has-visited';
const BODY_WEIGHT_KEY = 'body-weight-logs';
const NUTRITION_KEY = 'nutrition-logs';
const THEME_KEY = 'theme';
const REMINDER_SETTINGS_KEY = 'reminder-settings';

/**
 * Implementação do StorageAdapter usando localStorage do navegador.
 * É a implementação padrão hoje, mas pode ser trocada por outra (API,
 * Supabase, Firebase...) sem alterar quem a consome — veja ./index.ts.
 */
export class LocalStorageAdapter implements StorageAdapter {
  async loadExercises(): Promise<Exercise[] | null> {
    return this.loadJSON<Exercise[]>(EXERCISES_KEY);
  }

  async saveExercises(exercises: Exercise[]): Promise<void> {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  }

  async loadBodyWeightLogs(): Promise<BodyWeightEntry[] | null> {
    return this.loadJSON<BodyWeightEntry[]>(BODY_WEIGHT_KEY);
  }

  async saveBodyWeightLogs(logs: BodyWeightEntry[]): Promise<void> {
    localStorage.setItem(BODY_WEIGHT_KEY, JSON.stringify(logs));
  }

  async loadNutritionLogs(): Promise<NutritionEntry[] | null> {
    return this.loadJSON<NutritionEntry[]>(NUTRITION_KEY);
  }

  async saveNutritionLogs(logs: NutritionEntry[]): Promise<void> {
    localStorage.setItem(NUTRITION_KEY, JSON.stringify(logs));
  }

  async hasVisited(): Promise<boolean> {
    return localStorage.getItem(HAS_VISITED_KEY) === 'true';
  }

  async markVisited(): Promise<void> {
    localStorage.setItem(HAS_VISITED_KEY, 'true');
  }

  async loadTheme(): Promise<Theme | null> {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  }

  async saveTheme(theme: Theme): Promise<void> {
    localStorage.setItem(THEME_KEY, theme);
  }

  async loadReminderSettings(): Promise<ReminderSettings | null> {
    return this.loadJSON<ReminderSettings>(REMINDER_SETTINGS_KEY);
  }

  async saveReminderSettings(settings: ReminderSettings): Promise<void> {
    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
  }

  private loadJSON<T>(key: string): T | null {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
      return JSON.parse(stored) as T;
    } catch (error) {
      console.error(`Falha ao ler "${key}" salvo, ignorando.`, error);
      return null;
    }
  }
}

