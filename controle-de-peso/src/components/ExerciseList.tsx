import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Exercise, WorkoutLog } from '../App';
import { ExerciseCard } from './ExerciseCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { compareDatesDesc } from '../utils/date';

interface ExerciseListProps {
  exercises: Exercise[];
  onAddLog: (exerciseId: string, log: Omit<WorkoutLog, 'id' | 'exerciseId'>) => void;
  onEditLog: (exerciseId: string, logId: string, updates: Omit<WorkoutLog, 'id' | 'exerciseId'>) => void;
  onEditExercise: (exercise: Exercise) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onDeleteLog: (exerciseId: string, logId: string) => void;
}

type SortOption = 'category' | 'name-asc' | 'name-desc' | 'recent' | 'most-logs';

const SORT_LABELS: Record<SortOption, string> = {
  category: 'Categoria',
  'name-asc': 'Nome (A-Z)',
  'name-desc': 'Nome (Z-A)',
  recent: 'Mais recente',
  'most-logs': 'Mais registrado',
};

/** Data do registro mais recente do exercício, ou '' se nunca foi registrado. */
function lastLogDate(exercise: Exercise): string {
  return exercise.logs[0]?.date ?? '';
}

// Grid responsivo: 1 coluna no celular, 2 a partir de tablets em pé,
// e mais colunas em telas maiores (tablets deitados/desktop), para
// aproveitar melhor o espaço disponível.
const GRID_CLASSES = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

export function ExerciseList({ exercises, onAddLog, onEditLog, onEditExercise, onDeleteExercise, onDeleteLog }: ExerciseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('category');

  const filteredExercises = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase();
    if (!term) return exercises;
    return exercises.filter(
      (ex) => ex.name.toLocaleLowerCase().includes(term) || ex.category.toLocaleLowerCase().includes(term)
    );
  }, [exercises, searchTerm]);

  const sortedExercises = useMemo(() => {
    const list = [...filteredExercises];
    switch (sortBy) {
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'recent':
        return list.sort((a, b) => {
          const dateCompare = compareDatesDesc(lastLogDate(a), lastLogDate(b));
          return dateCompare !== 0 ? dateCompare : a.name.localeCompare(b.name);
        });
      case 'most-logs':
        return list.sort((a, b) => {
          const diff = b.logs.length - a.logs.length;
          return diff !== 0 ? diff : a.name.localeCompare(b.name);
        });
      case 'category':
      default:
        return list.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    }
  }, [filteredExercises, sortBy]);

  const cardProps = { onAddLog, onEditLog, onEditExercise, onDeleteExercise, onDeleteLog };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar exercício ou categoria..."
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="sm:w-56" aria-label="Ordenar exercícios">
            <SelectValue placeholder="Ordenar por..." />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
              <SelectItem key={option} value={option}>
                {SORT_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {exercises.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border">
          <p className="text-slate-500">Nenhum exercício cadastrado ainda.</p>
          <p className="text-slate-400">Clique em "Adicionar Exercício" para começar.</p>
        </div>
      ) : sortedExercises.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border">
          <p className="text-slate-500">Nenhum exercício encontrado para "{searchTerm}".</p>
        </div>
      ) : (
        // Sempre um único grid contínuo (a categoria de cada exercício já
        // aparece como etiqueta no card). Isso evita colunas vazias à
        // direita quando uma categoria tem poucos exercícios, o que fazia
        // os cards parecerem "presos" à esquerda no agrupamento por seção.
        <div className={GRID_CLASSES}>
          {sortedExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} {...cardProps} />
          ))}
        </div>
      )}
    </div>
  );
}
