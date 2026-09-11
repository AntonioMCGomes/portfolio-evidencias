import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { hapticSuccess, hapticImpactLight } from '../utils/native';

interface RestTimerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESETS_SECONDS = [30, 60, 90, 120];

/** Toca um bipe curto usando a Web Audio API (sem precisar de nenhum arquivo de áudio). */
function playBeep() {
  try {
    const AudioContextClass = window.AudioContext ?? (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  } catch {
    // Sem suporte a Web Audio — ignora silenciosamente.
  }
}

export function RestTimerDialog({ open, onOpenChange }: RestTimerDialogProps) {
  const [totalSeconds, setTotalSeconds] = useState(90);
  const [remainingSeconds, setRemainingSeconds] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reseta o cronômetro sempre que o diálogo é reaberto.
  useEffect(() => {
    if (open) {
      setRemainingSeconds(totalSeconds);
      setIsRunning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          playBeep();
          hapticSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const selectPreset = (seconds: number) => {
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
    hapticImpactLight();
  };

  const toggleRunning = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(totalSeconds);
    }
    setIsRunning(prev => !prev);
    hapticImpactLight();
  };

  const reset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    hapticImpactLight();
  };

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cronômetro de Descanso</DialogTitle>
          <DialogDescription>Descanse entre as séries e volte com tudo.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="text-slate-900" style={{ fontSize: '3rem', fontWeight: 600, lineHeight: 1 }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex gap-2">
            {PRESETS_SECONDS.map(preset => (
              <Button
                key={preset}
                type="button"
                variant={totalSeconds === preset ? 'default' : 'outline'}
                size="sm"
                onClick={() => selectPreset(preset)}
              >
                {preset}s
              </Button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button type="button" size="lg" onClick={toggleRunning} className="w-28">
              {isRunning ? <Pause className="size-4 mr-1" /> : <Play className="size-4 mr-1" />}
              {isRunning ? 'Pausar' : 'Iniciar'}
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={reset}>
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
