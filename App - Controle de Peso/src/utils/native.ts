import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import type { ReminderSettings } from '../types';

/**
 * Este arquivo é o único lugar do app que fala diretamente com os
 * plugins nativos do Capacitor. Toda chamada é protegida: no navegador
 * (não-nativo) ou se o plugin falhar por qualquer razão, ela vira um
 * no-op silencioso em vez de quebrar a aplicação.
 */

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

/** Esconde a splash screen nativa assim que o React já montou a UI. */
export async function hideNativeSplash(): Promise<void> {
  if (!isNativePlatform()) return;
  try {
    await SplashScreen.hide();
  } catch (error) {
    console.warn('Não foi possível esconder a splash nativa.', error);
  }
}

/** Ajusta a cor/estilo da barra de status para acompanhar o tema atual. */
export async function syncStatusBar(isDark: boolean): Promise<void> {
  if (!isNativePlatform()) return;
  try {
    await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
    await StatusBar.setBackgroundColor({ color: isDark ? '#0f172a' : '#ffffff' });
  } catch (error) {
    console.warn('Não foi possível ajustar a barra de status.', error);
  }
}

/** Vibração curta para confirmar uma ação (salvar registro, etc.). */
export async function hapticImpactLight(): Promise<void> {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Sem suporte (ex: navegador sem Vibration API) — ignora silenciosamente.
  }
}

/** Vibração mais forte para marcos importantes (ex: novo recorde de peso). */
export async function hapticImpactMedium(): Promise<void> {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    // Ignora silenciosamente.
  }
}

/** Padrão de vibração de "sucesso", usado ao concluir o cronômetro de descanso. */
export async function hapticSuccess(): Promise<void> {
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Ignora silenciosamente.
  }
}

/**
 * Registra o listener do botão físico "voltar" do Android.
 * Retorna uma função de limpeza (remove o listener).
 */
export function onHardwareBackButton(handler: () => void): () => void {
  if (!isNativePlatform()) return () => {};

  const listenerPromise = CapacitorApp.addListener('backButton', handler);
  return () => {
    listenerPromise.then((listener) => listener.remove()).catch(() => {});
  };
}

/** Minimiza/fecha o app (chamado quando não há mais para onde "voltar"). */
export async function exitApp(): Promise<void> {
  if (!isNativePlatform()) return;
  try {
    await CapacitorApp.exitApp();
  } catch {
    // Ignora silenciosamente.
  }
}

const REMINDER_NOTIFICATION_ID = 1001;

/** Pede permissão para notificações locais. Retorna true se concedida. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNativePlatform()) return false;
  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.warn('Não foi possível pedir permissão de notificações.', error);
    return false;
  }
}

/** Agenda (ou reagenda) o lembrete diário de treino. */
export async function scheduleReminder(settings: ReminderSettings): Promise<boolean> {
  if (!isNativePlatform()) return false;
  try {
    // Cancela o anterior antes de reagendar, para não duplicar.
    await cancelReminder();

    if (!settings.enabled) return true;

    const granted = await requestNotificationPermission();
    if (!granted) return false;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_NOTIFICATION_ID,
          title: 'Hora de treinar! 💪',
          body: 'Não esqueça de registrar seu treino de hoje.',
          schedule: {
            on: { hour: settings.hour, minute: settings.minute },
            repeats: true,
          },
        },
      ],
    });
    return true;
  } catch (error) {
    console.warn('Não foi possível agendar o lembrete.', error);
    return false;
  }
}

export async function cancelReminder(): Promise<void> {
  if (!isNativePlatform()) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_NOTIFICATION_ID }] });
  } catch {
    // Nada agendado ainda — ok ignorar.
  }
}

/**
 * Exporta um conteúdo de texto (JSON) como arquivo para o usuário.
 * - Nativo (Android/iOS): grava em cache e abre a folha de compartilhamento.
 * - Web: dispara um download comum via link temporário.
 */
export async function exportTextFile(fileName: string, content: string): Promise<void> {
  if (isNativePlatform()) {
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: content,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });
      const { uri } = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });
      await Share.share({
        title: 'Backup - Controle de Peso',
        url: uri,
      });
      return;
    } catch (error) {
      console.warn('Falha ao compartilhar arquivo nativo, tentando download web.', error);
    }
  }

  // Web (ou fallback se o compartilhamento nativo falhar)
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
