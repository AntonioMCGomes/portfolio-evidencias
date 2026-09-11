# Gerando as versões mobile (Android/iOS) com Capacitor

Este projeto já está preparado com:
- `capacitor.config.ts` (appId `com.controledepeso.app`, webDir `build`)
- Dependências do Capacitor no `package.json`
- Scripts prontos: `cap:sync`, `cap:android`, `cap:ios`

As pastas `android/` e `ios/` **não vêm incluídas** porque são geradas localmente pelo próprio Capacitor (dependem do seu sistema operacional e das ferramentas nativas instaladas). Siga os passos abaixo na sua máquina.

## 1. Instalar as dependências

```bash
npm install
```

## 2. Gerar as plataformas nativas (só precisa fazer uma vez)

Android (precisa do [Android Studio](https://developer.android.com/studio) instalado):
```bash
npx cap add android
```

iOS (precisa de macOS + [Xcode](https://apps.apple.com/app/xcode/id497799835)):
```bash
npx cap add ios
```

## 3. Build + sync + abrir no IDE nativo

Sempre que alterar o código, rode um destes (já fazem build + sync + abrem o IDE):

```bash
npm run cap:android   # abre no Android Studio
npm run cap:ios       # abre no Xcode
```

A partir do Android Studio/Xcode, clique em "Run" para instalar no emulador ou num dispositivo físico conectado.

## 4. (Opcional) Gerar ícone e splash screen automaticamente

Coloque uma imagem `icon.png` (1024x1024) e `splash.png` (2732x2732) numa pasta `assets/` na raiz do projeto, depois:

```bash
npx capacitor-assets generate
```

## Recursos nativos já integrados

O app já vem com os seguintes plugins do Capacitor configurados em `src/utils/native.ts`:

- **`@capacitor/splash-screen`** — a splash nativa é escondida manualmente assim que o app termina de carregar (veja `capacitor.config.ts`, `launchAutoHide: false`).
- **`@capacitor/status-bar`** — a cor da barra de status acompanha o tema claro/escuro escolhido no app.
- **`@capacitor/app`** — o botão físico "voltar" do Android fecha diálogos abertos, depois volta para a aba de Exercícios, e só minimiza o app se já estiver nela.
- **`@capacitor/haptics`** — vibração leve ao salvar um registro (treino ou peso), mais forte ao bater um recorde de peso, e ao concluir o cronômetro de descanso.
- **`@capacitor/local-notifications`** — lembrete diário de treino, configurável em "Configurações" dentro do app. Exige que o usuário conceda permissão de notificações (pedida automaticamente ao ativar).
- **`@capacitor/filesystem` + `@capacitor/share`** — usados pelo botão "Exportar" em Configurações: gera o arquivo de backup e abre a folha de compartilhamento nativa do Android/iOS.

Depois de `npx cap add android`, rode `npx cap sync` (ou `npm run cap:android`, que já faz isso) para que o Android Studio baixe e configure os módulos nativos desses plugins.

**Nota sobre notificações no Android 13+:** a permissão de notificações é solicitada em tempo de execução automaticamente pelo app quando o usuário ativa o lembrete em Configurações — não precisa configurar nada manualmente no `AndroidManifest.xml`.

## Alterar o ID do app ou o nome

Edite `capacitor.config.ts`:
```ts
appId: 'com.suaempresa.seuapp',
appName: 'Nome do seu app',
```
Depois de alterar, rode `npx cap sync` novamente.
