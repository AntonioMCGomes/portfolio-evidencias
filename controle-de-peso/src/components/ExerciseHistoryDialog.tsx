import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { WorkoutLog } from '../App';
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

interface ExerciseHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseName: string;
  logs: WorkoutLog[];
  onEditLog: (log: WorkoutLog) => void;
  onDeleteLog: (logId: string) => void;
}

export function ExerciseHistoryDialog({
  open,
  onOpenChange,
  exerciseName,
  logs,
  onEditLog,
  onDeleteLog,
}: ExerciseHistoryDialogProps) {
  const [logToDelete, setLogToDelete] = useState<string | null>(null);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Histórico completo</DialogTitle>
            <DialogDescription>
              Todos os registros de {exerciseName} ({logs.length} {logs.length === 1 ? 'registro' : 'registros'})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 overflow-y-auto py-2">
            {logs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">Nenhum registro ainda.</p>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded group">
                  <div>
                    <div>
                      <span className="text-slate-700">{formatDateBR(log.date)}</span>
                      <span className="text-slate-500 mx-2">•</span>
                      <span className="text-slate-900">{log.weight}kg</span>
                      <span className="text-slate-500"> • {log.sets}x{log.reps}</span>
                    </div>
                    {log.notes && (
                      <p className="text-slate-500 mt-1">{log.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditLog(log)}
                      className="h-7 px-2 text-slate-600 hover:text-slate-900"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogToDelete(log.id)}
                      className="h-7 px-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!logToDelete} onOpenChange={(open) => !open && setLogToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O registro será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (logToDelete) onDeleteLog(logToDelete);
                setLogToDelete(null);
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
