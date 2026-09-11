import { useState, useEffect } from 'react';
import { Plus, Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ExerciseList } from './components/ExerciseList';
import { AddExerciseDialog } from './components/AddExerciseDialog';
import { ProgressView } from './components/ProgressView';
import { BodyWeightView } from './components/BodyWeightView';
import { NutritionView } from './components/NutritionView';
import { SettingsDialog } from './components/SettingsDialog';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { storage } from './services/storage';
import { compareDatesDesc, getTodayLocalISODate } from './utils/date';
import {
  hideNativeSplash,
  syncStatusBar,
  onHardwareBackButton,
  exitApp,
  scheduleReminder,
  hapticImpactLight,
  hapticImpactMedium,
  exportTextFile,
  isNativePlatform,
} from './utils/native';

// Tipos re-exportados aqui para não quebrar os componentes que já
// importam de '../App'. A fonte de verdade agora é ./types.ts.
export type { Exercise, WorkoutLog, BodyWeightEntry, NutritionEntry } from './types';
import type { Exercise, WorkoutLog, BodyWeightEntry, NutritionEntry, Theme, ReminderSettings } from './types';

type TabValue = 'exercises' | 'bodyweight' | 'progress';

const DEFAULT_REMINDER_SETTINGS: ReminderSettings = { enabled: false, hour: 19, minute: 0 };

export default function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [bodyWeightLogs, setBodyWeightLogs] = useState<BodyWeightEntry[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionEntry[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>('exercises');

  const [theme, setTheme] = useState<Theme>('light');
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);

  // `null` enquanto ainda não sabemos se o usuário já visitou o app antes
  // (aguardando o storage). Depois de resolvido, vira `true` ou `false`.
  const [hasVisitedBefore, setHasVisitedBefore] = useState<boolean | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Esconde a splash nativa assim que o React montou (a splash animada
  // em React, se houver, assume o controle visual a partir daqui).
  useEffect(() => {
    hideNativeSplash();
  }, []);

  // Carrega todos os dados via storage adapter (hoje é localStorage, pode
  // virar uma API/Supabase/etc. no futuro sem mudar este componente).
  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      const [storedExercises, storedBodyWeight, storedNutrition, visited, storedTheme, storedReminder] = await Promise.all([
        storage.loadExercises(),
        storage.loadBodyWeightLogs(),
        storage.loadNutritionLogs(),
        storage.hasVisited(),
        storage.loadTheme(),
        storage.loadReminderSettings(),
      ]);

      if (cancelled) return;

      if (visited) {
        setHasVisitedBefore(true);
      } else {
        // Primeira visita: mostra a splash animada, seguida da tela de
        // boas-vindas. Em visitas seguintes isso é pulado inteiramente.
        setHasVisitedBefore(false);
        setShowLoading(true);
      }

      if (storedExercises) {
        setExercises(storedExercises);
      } else {
        // Initialize with sample data
        const sampleData: Exercise[] = [
          {
            id: '1',
            name: 'Supino Reto',
            category: 'Peito',
            logs: [
              { id: '1-1', exerciseId: '1', weight: 60, reps: 10, sets: 3, date: '2024-11-10' },
              { id: '1-2', exerciseId: '1', weight: 65, reps: 8, sets: 3, date: '2024-11-13' },
            ]
          },
          {
            id: '2',
            name: 'Agachamento',
            category: 'Pernas',
            logs: [
              { id: '2-1', exerciseId: '2', weight: 80, reps: 12, sets: 4, date: '2024-11-11' },
              { id: '2-2', exerciseId: '2', weight: 85, reps: 10, sets: 4, date: '2024-11-13' },
            ]
          }
        ];
        setExercises(sampleData);
        await storage.saveExercises(sampleData);
      }

      if (storedBodyWeight) setBodyWeightLogs(storedBodyWeight);
      if (storedNutrition) setNutritionLogs(storedNutrition);
      if (storedTheme) setTheme(storedTheme);
      if (storedReminder) setReminderSettings(storedReminder);

      setDataLoaded(true);
    }

    loadInitialData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persiste exercícios sempre que mudarem (só depois da carga inicial,
  // pra não sobrescrever os dados salvos com o estado vazio do primeiro render).
  useEffect(() => {
    if (!dataLoaded) return;
    storage.saveExercises(exercises);
  }, [exercises, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    storage.saveBodyWeightLogs(bodyWeightLogs);
  }, [bodyWeightLogs, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    storage.saveNutritionLogs(nutritionLogs);
  }, [nutritionLogs, dataLoaded]);

  // Tema: aplica a classe `dark`, sincroniza a barra de status nativa e salva.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    syncStatusBar(theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!dataLoaded) return;
    storage.saveTheme(theme);
  }, [theme, dataLoaded]);

  // Lembrete diário: reagenda a notificação nativa sempre que a configuração mudar.
  useEffect(() => {
    if (!dataLoaded) return;
    storage.saveReminderSettings(reminderSettings);
    scheduleReminder(reminderSettings);
  }, [reminderSettings, dataLoaded]);

  // Botão físico "voltar" do Android: fecha diálogos abertos, depois volta
  // pra aba de Exercícios, só saindo do app se já estiver nela.
  useEffect(() => {
    return onHardwareBackButton(() => {
      const openDialog = document.querySelector('[role="dialog"], [role="alertdialog"]');
      if (openDialog) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
        return;
      }
      if (activeTab !== 'exercises') {
        setActiveTab('exercises');
        return;
      }
      exitApp();
    });
  }, [activeTab]);

  const addExercise = (name: string, category: string) => {
    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name,
      category,
      logs: []
    };
    setExercises([...exercises, newExercise]);
  };

  const editExercise = (exerciseId: string, name: string, category: string) => {
    setExercises(exercises.map(ex => (ex.id === exerciseId ? { ...ex, name, category } : ex)));
  };

  const addLog = (exerciseId: string, log: Omit<WorkoutLog, 'id' | 'exerciseId'>) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    const isRecord = !!exercise && exercise.logs.length > 0 && log.weight > Math.max(...exercise.logs.map(l => l.weight));
    if (isRecord) {
      hapticImpactMedium();
    } else {
      hapticImpactLight();
    }

    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const newLog: WorkoutLog = {
          ...log,
          id: crypto.randomUUID(),
          exerciseId
        };
        return {
          ...exercise,
          logs: [...exercise.logs, newLog].sort((a, b) => compareDatesDesc(a.date, b.date))
        };
      }
      return exercise;
    }));
  };

  const editLog = (exerciseId: string, logId: string, updates: Omit<WorkoutLog, 'id' | 'exerciseId'>) => {
    hapticImpactLight();
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          logs: exercise.logs
            .map(log => (log.id === logId ? { ...log, ...updates } : log))
            .sort((a, b) => compareDatesDesc(a.date, b.date))
        };
      }
      return exercise;
    }));
  };

  const deleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const deleteLog = (exerciseId: string, logId: string) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          logs: exercise.logs.filter(log => log.id !== logId)
        };
      }
      return exercise;
    }));
  };

  const addBodyWeight = (entry: Omit<BodyWeightEntry, 'id'>) => {
    hapticImpactLight();
    const newEntry: BodyWeightEntry = { ...entry, id: crypto.randomUUID() };
    setBodyWeightLogs([...bodyWeightLogs, newEntry].sort((a, b) => compareDatesDesc(a.date, b.date)));
  };

  const editBodyWeight = (entryId: string, updates: Omit<BodyWeightEntry, 'id'>) => {
    hapticImpactLight();
    setBodyWeightLogs(
      bodyWeightLogs
        .map(entry => (entry.id === entryId ? { ...entry, ...updates } : entry))
        .sort((a, b) => compareDatesDesc(a.date, b.date))
    );
  };

  const deleteBodyWeight = (entryId: string) => {
    setBodyWeightLogs(bodyWeightLogs.filter(entry => entry.id !== entryId));
  };

  const addNutrition = (entry: Omit<NutritionEntry, 'id'>) => {
    hapticImpactLight();
    const newEntry: NutritionEntry = { ...entry, id: crypto.randomUUID() };
    setNutritionLogs([...nutritionLogs, newEntry].sort((a, b) => compareDatesDesc(a.date, b.date)));
  };

  const editNutrition = (entryId: string, updates: Omit<NutritionEntry, 'id'>) => {
    hapticImpactLight();
    setNutritionLogs(
      nutritionLogs
        .map(entry => (entry.id === entryId ? { ...entry, ...updates } : entry))
        .sort((a, b) => compareDatesDesc(a.date, b.date))
    );
  };

  const deleteNutrition = (entryId: string) => {
    setNutritionLogs(nutritionLogs.filter(entry => entry.id !== entryId));
  };

  const handleStart = () => {
    storage.markVisited();
    setShowWelcome(false);
  };

  const handleExport = async () => {
    const payload = {
      exercises,
      bodyWeightLogs,
      nutritionLogs,
      exportedAt: new Date().toISOString(),
    };
    const fileName = `backup-controle-de-peso-${getTodayLocalISODate()}.json`;
    await exportTextFile(fileName, JSON.stringify(payload, null, 2));
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed.exercises)) setExercises(parsed.exercises);
      if (Array.isArray(parsed.bodyWeightLogs)) setBodyWeightLogs(parsed.bodyWeightLogs);
      if (Array.isArray(parsed.nutritionLogs)) setNutritionLogs(parsed.nutritionLogs);
    } catch (error) {
      console.error('Backup inválido.', error);
      window.alert('Não foi possível importar o arquivo — verifique se é um backup válido gerado por este app.');
    }
  };

  // Ainda determinando se é a primeira visita: evita piscar a splash
  // animada para quem já usa o app, mas também evita conteúdo em branco.
  if (hasVisitedBefore === null) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950" />;
  }

  if (showLoading) {
    return <LoadingScreen onComplete={() => { setShowLoading(false); setShowWelcome(true); }} />;
  }

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="container max-w-6xl mx-auto p-4 md:p-8">
        <header
          className="mb-8 flex items-start justify-between gap-4"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div>
            <h1 className="text-slate-900 mb-2">Controle de Treino</h1>
            <p className="text-slate-600">Acompanhe seu progresso e evolução nos exercícios</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Configurações"
            >
              <SettingsIcon className="size-4" />
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="exercises">Exercícios</TabsTrigger>
            <TabsTrigger value="bodyweight">Peso & Nutrição</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="size-4" />
                Adicionar Exercício
              </Button>
            </div>

            <ExerciseList 
              exercises={exercises}
              onAddLog={addLog}
              onEditLog={editLog}
              onEditExercise={setExerciseToEdit}
              onDeleteExercise={deleteExercise}
              onDeleteLog={deleteLog}
            />
          </TabsContent>

          <TabsContent value="bodyweight" className="space-y-8">
            <BodyWeightView
              entries={bodyWeightLogs}
              onAdd={addBodyWeight}
              onEdit={editBodyWeight}
              onDelete={deleteBodyWeight}
            />
            <NutritionView
              entries={nutritionLogs}
              onAdd={addNutrition}
              onEdit={editNutrition}
              onDelete={deleteNutrition}
            />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressView exercises={exercises} />
          </TabsContent>
        </Tabs>

        <AddExerciseDialog
          open={isAddDialogOpen || !!exerciseToEdit}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddDialogOpen(false);
              setExerciseToEdit(null);
            }
          }}
          exerciseToEdit={exerciseToEdit}
          onAdd={addExercise}
          onEdit={editExercise}
        />

        <SettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          isNative={isNativePlatform()}
          reminderSettings={reminderSettings}
          onReminderSettingsChange={setReminderSettings}
          onExport={handleExport}
          onImport={handleImport}
        />
      </div>
    </div>
  );
}
