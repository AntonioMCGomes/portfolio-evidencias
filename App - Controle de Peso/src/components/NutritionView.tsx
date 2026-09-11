import { useState } from 'react';
import { Plus, Trash2, Pencil, Utensils } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { NutritionEntry } from '../types';
import { formatDateBR, formatDateShortBR, compareDatesDesc } from '../utils/date';
import { AddNutritionDialog } from './AddNutritionDialog';
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

interface NutritionViewProps {
  entries: NutritionEntry[];
  onAdd: (entry: Omit<NutritionEntry, 'id'>) => void;
  onEdit: (entryId: string, updates: Omit<NutritionEntry, 'id'>) => void;
  onDelete: (entryId: string) => void;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function NutritionView({ entries, onAdd, onEdit, onDelete }: NutritionViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<NutritionEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const sortedEntries = [...entries].sort((a, b) => compareDatesDesc(a.date, b.date));
  const chartData = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry) => ({
      date: formatDateShortBR(entry.date),
      calorias: entry.calories,
      proteina: entry.protein,
    }));

  const avgCalories = average(entries.map((e) => e.calories).filter((v): v is number => v !== undefined));
  const avgProtein = average(entries.map((e) => e.protein).filter((v): v is number => v !== undefined));

  if (entries.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Utensils className="size-10 text-slate-300 mb-3" />
            <p className="text-slate-500 mb-1">Nenhum registro de nutrição ainda.</p>
            <p className="text-slate-400 mb-4">Só os totais do dia — sem precisar detalhar cada refeição.</p>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="size-4 mr-1" />
              Registrar Nutrição
            </Button>
          </CardContent>
        </Card>
        <AddNutritionDialog open={isAddOpen} onOpenChange={setIsAddOpen} onSave={onAdd} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-slate-900">Nutrição</h2>
          <p className="text-slate-500">Totais diários de calorias e proteína, para cruzar com seu progresso</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="size-4 mr-1" />
          Registrar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Média de Calorias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{avgCalories !== null ? `${Math.round(avgCalories)} kcal` : '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Média de Proteína</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{avgProtein !== null ? `${Math.round(avgProtein)} g` : '—'}</div>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução Nutricional</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="calorias" stroke="#f97316" strokeWidth={2} name="Calorias (kcal)" connectNulls />
                <Line type="monotone" dataKey="proteina" stroke="#3b82f6" strokeWidth={2} name="Proteína (g)" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sortedEntries.map((entry) => (
            <div key={entry.id} className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded group">
              <div>
                <span className="text-slate-700">{formatDateBR(entry.date)}</span>
                <span className="text-slate-500 mx-2">•</span>
                {entry.calories !== undefined && <span className="text-slate-900">{entry.calories} kcal</span>}
                {entry.calories !== undefined && entry.protein !== undefined && (
                  <span className="text-slate-500 mx-2">•</span>
                )}
                {entry.protein !== undefined && <span className="text-slate-900">{entry.protein} g proteína</span>}
                {entry.notes && <p className="text-slate-500 mt-1">{entry.notes}</p>}
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEntryToEdit(entry)}
                  className="h-7 px-2 text-slate-600 hover:text-slate-900"
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEntryToDelete(entry.id)}
                  className="h-7 px-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AddNutritionDialog
        open={isAddOpen || !!entryToEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setEntryToEdit(null);
          }
        }}
        entryToEdit={entryToEdit}
        onSave={(entry) => {
          if (entryToEdit) {
            onEdit(entryToEdit.id, entry);
          } else {
            onAdd(entry);
          }
        }}
      />

      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O registro de nutrição será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (entryToDelete) onDelete(entryToDelete);
                setEntryToDelete(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
