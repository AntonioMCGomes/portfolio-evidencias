import { useState } from 'react';
import { Plus, Trash2, TrendingUp, Calendar, Pencil, Timer, ListOrdered } from 'lucide-react';
import { Exercise, WorkoutLog } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AddLogDialog } from './AddLogDialog';
import { ExerciseHistoryDialog } from './ExerciseHistoryDialog';
import { RestTimerDialog } from './RestTimerDialog';
import { formatDateBR } from '../utils/date';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface ExerciseCardProps {
  exercise: Exercise;
  onAddLog: (exerciseId: string, log: Omit<WorkoutLog, 'id' | 'exerciseId'>) => void;
  onEditLog: (exerciseId: string, logId: string, updates: Omit<WorkoutLog, 'id' | 'exerciseId'>) => void;
  onEditExercise: (exercise: Exercise) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onDeleteLog: (exerciseId: string, logId: string) => void;
}

export function ExerciseCard({ exercise, onAddLog, onEditLog, onEditExercise, onDeleteExercise, onDeleteLog }: ExerciseCardProps) {
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState<WorkoutLog | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);

  const latestLog = exercise.logs[0];
  const previousLog = exercise.logs[1];

  const getWeightChange = () => {
    if (!latestLog || !previousLog) return null;
    const diff = latestLog.weight - previousLog.weight;
    return diff;
  };

  const weightChange = getWeightChange();

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <CardTitle>{exercise.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditExercise(exercise)}
                  className="h-6 px-1.5 text-slate-500 hover:text-slate-900"
                  aria-label="Editar exercício"
                >
                  <Pencil className="size-3" />
                </Button>
              </div>
              <Badge variant="outline" className="mt-2">
                {exercise.category}
              </Badge>
              {latestLog && (
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="size-3" />
                  Último treino: {formatDateBR(latestLog.date)}
                </CardDescription>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {latestLog ? (
            <>
              <div className="flex items-end gap-2">
                <div>
                  <p className="text-slate-600">Peso Atual</p>
                  <p className="text-slate-900">{latestLog.weight} kg</p>
                </div>
                {weightChange !== null && weightChange !== 0 && (
                  <Badge variant={weightChange > 0 ? "default" : "secondary"} className="mb-1">
                    <TrendingUp className="size-3 mr-1" />
                    {weightChange > 0 ? '+' : ''}{weightChange} kg
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Séries</p>
                  <p className="text-slate-900">{latestLog.sets}</p>
                </div>
                <div>
                  <p className="text-slate-600">Repetições</p>
                  <p className="text-slate-900">{latestLog.reps}</p>
                </div>
              </div>

              {exercise.logs.length > 1 && (
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-600">Histórico Recente</p>
                    {exercise.logs.length > 4 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsHistoryOpen(true)}
                        className="h-6 px-2 text-slate-500 hover:text-slate-900"
                      >
                        <ListOrdered className="size-3 mr-1" />
                        Ver tudo
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {exercise.logs.slice(1, 4).map(log => (
                      <div key={log.id} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded group">
                        <div>
                          <span className="text-slate-700">{formatDateBR(log.date)}</span>
                          <span className="text-slate-500 mx-2">•</span>
                          <span className="text-slate-900">{log.weight}kg</span>
                          <span className="text-slate-500"> • {log.sets}x{log.reps}</span>
                        </div>
                        <div className="flex items-center opacity-0 group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLogToEdit(log)}
                            className="h-6 px-2 text-slate-600 hover:text-slate-900"
                          >
                            <Pencil className="size-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLogToDelete(log.id)}
                            className="h-6 px-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-500 text-center py-4">Nenhum registro ainda</p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => setIsAddLogOpen(true)} 
              className="w-full gap-2"
              variant="outline"
            >
              <Plus className="size-4" />
              Registrar
            </Button>
            <Button
              onClick={() => setIsRestTimerOpen(true)}
              className="w-full gap-2"
              variant="outline"
            >
              <Timer className="size-4" />
              Descanso
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddLogDialog
        open={isAddLogOpen || !!logToEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddLogOpen(false);
            setLogToEdit(null);
          }
        }}
        exerciseName={exercise.name}
        lastLog={latestLog}
        logToEdit={logToEdit}
        onSave={(log) => {
          if (logToEdit) {
            onEditLog(exercise.id, logToEdit.id, log);
          } else {
            onAddLog(exercise.id, log);
          }
        }}
      />

      <ExerciseHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        exerciseName={exercise.name}
        logs={exercise.logs}
        onEditLog={(log) => {
          setIsHistoryOpen(false);
          setLogToEdit(log);
        }}
        onDeleteLog={(logId) => onDeleteLog(exercise.id, logId)}
      />

      <RestTimerDialog open={isRestTimerOpen} onOpenChange={setIsRestTimerOpen} />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir exercício?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{exercise.name}"? Todos os registros serão perdidos. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDeleteExercise(exercise.id)} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!logToDelete} onOpenChange={() => setLogToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro de treino? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (logToDelete) {
                  onDeleteLog(exercise.id, logToDelete);
                  setLogToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
