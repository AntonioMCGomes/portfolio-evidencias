import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { BodyWeightEntry } from '../types';
import { getTodayLocalISODate } from '../utils/date';

interface AddBodyWeightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Quando fornecido, o diálogo abre em modo de edição para este registro. */
  entryToEdit?: BodyWeightEntry | null;
  onSave: (entry: Omit<BodyWeightEntry, 'id'>) => void;
}

export function AddBodyWeightDialog({ open, onOpenChange, entryToEdit, onSave }: AddBodyWeightDialogProps) {
  const isEditing = !!entryToEdit;
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setWeight(entryToEdit ? entryToEdit.weight.toString() : '');
      setDate(entryToEdit ? entryToEdit.date : getTodayLocalISODate());
      setNotes(entryToEdit?.notes ?? '');
    }
  }, [open, entryToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      weight: parseFloat(weight),
      date,
      notes: notes.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Peso' : 'Registrar Peso'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Altere os dados deste registro de peso corporal.' : 'Adicione um novo registro de peso corporal.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="body-weight">Peso (kg)</Label>
                <Input
                  id="body-weight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body-weight-date">Data</Label>
                <Input
                  id="body-weight-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  max={getTodayLocalISODate()}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body-weight-notes">Observações (opcional)</Label>
              <Textarea
                id="body-weight-notes"
                placeholder="Como está se sentindo, contexto, etc."
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
