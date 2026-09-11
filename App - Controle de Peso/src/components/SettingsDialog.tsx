import { useRef, useState } from 'react';
import { Download, Upload, Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { ReminderSettings } from '../types';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isNative: boolean;
  reminderSettings: ReminderSettings;
  onReminderSettingsChange: (settings: ReminderSettings) => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  isNative,
  reminderSettings,
  onReminderSettingsChange,
  onExport,
  onImport,
}: SettingsDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const timeValue = `${String(reminderSettings.hour).padStart(2, '0')}:${String(reminderSettings.minute).padStart(2, '0')}`;

  const handleTimeChange = (value: string) => {
    const [hourStr, minuteStr] = value.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return;
    onReminderSettingsChange({ ...reminderSettings, hour, minute });
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      setImportMessage('Backup importado com sucesso.');
    }
    e.target.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) setImportMessage(null); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>Backup dos seus dados e lembretes de treino.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-3">
            <h3 className="text-slate-900 flex items-center gap-2">
              <Bell className="size-4" />
              Lembrete diário
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-enabled" className="font-normal">
                Notificar todos os dias para treinar
              </Label>
              <Switch
                id="reminder-enabled"
                checked={reminderSettings.enabled}
                disabled={!isNative}
                onCheckedChange={(checked) => onReminderSettingsChange({ ...reminderSettings, enabled: checked })}
              />
            </div>
            {reminderSettings.enabled && (
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Horário</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={timeValue}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  disabled={!isNative}
                />
              </div>
            )}
            {!isNative && (
              <p className="text-slate-500">
                Lembretes só funcionam no app instalado (Android/iOS), não no navegador.
              </p>
            )}
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h3 className="text-slate-900">Backup dos dados</h3>
            <p className="text-slate-500">
              Seus dados ficam salvos só neste dispositivo. Exporte um backup para não perdê-los.
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onExport} className="flex-1">
                <Download className="size-4 mr-1" />
                Exportar
              </Button>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                <Upload className="size-4 mr-1" />
                Importar
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleFileSelected}
              />
            </div>
            {importMessage && <p className="text-emerald-600">{importMessage}</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
