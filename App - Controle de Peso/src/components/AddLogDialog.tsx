import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { WorkoutLog } from '../App';
import { getTodayLocalISODate } from '../utils/date';

interface AddLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseName: string;
  lastLog?: WorkoutLog;
  /** Quando fornecido, o diálogo abre em modo de edição para este registro. */
  logToEdit?: WorkoutLog | null;
  onSave: (log: Omit<WorkoutLog, 'id' | 'exerciseId'>) => void;
}

export function AddLogDialog({ open, onOpenChange, exerciseName, lastLog, logToEdit, onSave }: AddLogDialogProps) {
  const isEditing = !!logToEdit;
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      if (logToEdit) {
        // Edit mode: pre-fill with the log being edited
        setWeight(logToEdit.weight.toString());
        setReps(logToEdit.reps.toString());
        setSets(logToEdit.sets.toString());
        setDate(logToEdit.date);
        setNotes(logToEdit.notes ?? '');
      } else {
        // Add mode: pre-fill with last log values, today as the date
        if (lastLog) {
          setWeight(lastLog.weight.toString());
          setReps(lastLog.reps.toString());
          setSets(lastLog.sets.toString());
        }
        setDate(getTodayLocalISODate());
        setNotes('');
      }
    }
  }, [open, lastLog, logToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      weight: parseFloat(weight),
      reps: parseInt(reps),
      sets: parseInt(sets),
      date,
      notes: notes.trim() || undefined
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Registro' : 'Registrar Treino'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Altere os dados deste registro de ${exerciseName}`
              : `Adicione um novo registro para ${exerciseName}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="0.0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  max={getTodayLocalISODate()}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sets">Séries</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  placeholder="3"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reps">Repetições</Label>
                <Input
                  id="reps"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Como você se sentiu, dificuldades, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Salvar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
