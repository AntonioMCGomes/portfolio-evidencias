import { useState } from 'react';
import { Plus, Trash2, Pencil, Scale } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BodyWeightEntry } from '../types';
import { formatDateBR, formatDateShortBR, compareDatesDesc } from '../utils/date';
import { AddBodyWeightDialog } from './AddBodyWeightDialog';
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

interface BodyWeightViewProps {
  entries: BodyWeightEntry[];
  onAdd: (entry: Omit<BodyWeightEntry, 'id'>) => void;
  onEdit: (entryId: string, updates: Omit<BodyWeightEntry, 'id'>) => void;
  onDelete: (entryId: string) => void;
}

export function BodyWeightView({ entries, onAdd, onEdit, onDelete }: BodyWeightViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<BodyWeightEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const sortedEntries = [...entries].sort((a, b) => compareDatesDesc(a.date, b.date));
  const chartData = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(entry => ({
      date: formatDateShortBR(entry.date),
      peso: entry.weight,
    }));

  const currentWeight = sortedEntries[0]?.weight;
  const firstWeight = sortedEntries[sortedEntries.length - 1]?.weight;
  const change = currentWeight !== undefined && firstWeight !== undefined ? currentWeight - firstWeight : null;

  if (entries.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Scale className="size-10 text-slate-300 mb-3" />
            <p className="text-slate-500 mb-4">Nenhum registro de peso corporal ainda.</p>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="size-4 mr-1" />
              Registrar Peso
            </Button>
          </CardContent>
        </Card>
        <AddBodyWeightDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onSave={onAdd}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-slate-900">Peso Corporal</h2>
          <p className="text-slate-500">Acompanhe sua evolução de peso ao longo do tempo</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="size-4 mr-1" />
          Registrar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Peso Atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{currentWeight} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Variação Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">
              {change !== null ? `${change > 0 ? '+' : ''}${change.toFixed(1)} kg` : '—'}
            </div>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Line type="monotone" dataKey="peso" stroke="#10b981" strokeWidth={2} name="Peso (kg)" />
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
          {sortedEntries.map(entry => (
            <div key={entry.id} className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded group">
              <div>
                <span className="text-slate-700">{formatDateBR(entry.date)}</span>
                <span className="text-slate-500 mx-2">•</span>
                <span className="text-slate-900">{entry.weight} kg</span>
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

      <AddBodyWeightDialog
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
              Essa ação não pode ser desfeita. O registro de peso será removido permanentemente.
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
