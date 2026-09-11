import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Exercise } from '../App';

interface AddExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Quando fornecido, o diálogo abre em modo de edição para este exercício. */
  exerciseToEdit?: Exercise | null;
  onAdd: (name: string, category: string) => void;
  onEdit: (exerciseId: string, name: string, category: string) => void;
}

const CATEGORIES = [
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Abdômen',
  'Cardio',
  'Outro'
];

export function AddExerciseDialog({ open, onOpenChange, exerciseToEdit, onAdd, onEdit }: AddExerciseDialogProps) {
  const isEditing = !!exerciseToEdit;
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (open) {
      setName(exerciseToEdit?.name ?? '');
      setCategory(exerciseToEdit?.category ?? '');
    }
  }, [open, exerciseToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) return;

    if (exerciseToEdit) {
      onEdit(exerciseToEdit.id, name.trim(), category);
    } else {
      onAdd(name.trim(), category);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Exercício' : 'Adicionar Exercício'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere o nome ou a categoria deste exercício.'
              : 'Adicione um novo exercício ao seu programa de treino.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Exercício</Label>
              <Input
                id="name"
                placeholder="Ex: Supino reto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Adicionar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
