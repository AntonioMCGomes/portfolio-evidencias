import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { NutritionEntry } from '../types';
import { getTodayLocalISODate } from '../utils/date';

interface AddNutritionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Quando fornecido, o diálogo abre em modo de edição para este registro. */
  entryToEdit?: NutritionEntry | null;
  onSave: (entry: Omit<NutritionEntry, 'id'>) => void;
}

export function AddNutritionDialog({ open, onOpenChange, entryToEdit, onSave }: AddNutritionDialogProps) {
  const isEditing = !!entryToEdit;
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setCalories(entryToEdit?.calories !== undefined ? entryToEdit.calories.toString() : '');
      setProtein(entryToEdit?.protein !== undefined ? entryToEdit.protein.toString() : '');
      setDate(entryToEdit ? entryToEdit.date : getTodayLocalISODate());
      setNotes(entryToEdit?.notes ?? '');
    }
  }, [open, entryToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      calories: calories.trim() ? parseFloat(calories) : undefined,
      protein: protein.trim() ? parseFloat(protein) : undefined,
      notes: notes.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Nutrição' : 'Registrar Nutrição do Dia'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os totais nutricionais deste dia.'
              : 'Registre os totais do dia — sem precisar detalhar cada refeição.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nutrition-calories">Calorias (kcal)</Label>
                <Input
                  id="nutrition-calories"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nutrition-protein">Proteína (g)</Label>
                <Input
                  id="nutrition-protein"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nutrition-date">Data</Label>
              <Input
                id="nutrition-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                max={getTodayLocalISODate()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nutrition-notes">Observações (opcional)</Label>
              <Textarea
                id="nutrition-notes"
                placeholder="Contexto do dia, se quiser lembrar depois..."
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
