import { useState } from 'react';
import { Exercise } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar, Dumbbell } from 'lucide-react';
import { formatDateShortBR } from '../utils/date';

interface ProgressViewProps {
  exercises: Exercise[];
}

export function ProgressView({ exercises }: ProgressViewProps) {
  const exercisesWithLogs = exercises.filter(ex => ex.logs.length > 0);
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    exercisesWithLogs.length > 0 ? exercisesWithLogs[0].id : ''
  );

  if (exercisesWithLogs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-500">Nenhum registro de treino ainda.</p>
          <p className="text-slate-400">Comece a registrar seus treinos para visualizar o progresso.</p>
        </CardContent>
      </Card>
    );
  }

  const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);
  
  if (!selectedExercise) return null;

  // Prepare chart data (reverse to show chronological order)
  const chartData = [...selectedExercise.logs]
    .reverse()
    .map(log => ({
      date: formatDateShortBR(log.date),
      fullDate: log.date,
      peso: log.weight,
      volume: log.weight * log.reps * log.sets,
      reps: log.reps,
      sets: log.sets
    }));

  // Calculate statistics
  const weights = selectedExercise.logs.map(log => log.weight);
  const maxWeight = Math.max(...weights);
  const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
  const totalWorkouts = selectedExercise.logs.length;
  
  const firstLog = selectedExercise.logs[selectedExercise.logs.length - 1];
  const lastLog = selectedExercise.logs[0];
  const improvement = lastLog.weight - firstLog.weight;
  const improvementPercent = firstLog.weight > 0
    ? ((improvement / firstLog.weight) * 100).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selecione um Exercício</CardTitle>
          <CardDescription>Visualize sua evolução ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exercisesWithLogs.map(exercise => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  {exercise.name} ({exercise.logs.length} registros)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Dumbbell className="size-4" />
              Peso Máximo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{maxWeight} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Evolução
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">
              {improvement > 0 ? '+' : ''}{improvement} kg{improvementPercent !== null ? ` (${improvementPercent}%)` : ''}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Peso Médio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{avgWeight.toFixed(1)} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="size-4" />
              Total de Treinos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">{totalWorkouts}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução do Peso</CardTitle>
          <CardDescription>Progressão de carga ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#64748b' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'peso') return [value + ' kg', 'Peso'];
                  if (name === 'volume') return [value.toFixed(0) + ' kg', 'Volume Total'];
                  return [value, name];
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="peso" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Volume Total de Treino</CardTitle>
          <CardDescription>Peso × Séries × Repetições</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#64748b' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [value.toFixed(0) + ' kg', 'Volume']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="volume" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
