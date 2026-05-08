# TAREFA CODEX, CORRIGIR CONFIG INCOMPLETO DO SISTEMA 637

Você está trabalhando no sistema real da 637 Cervejaria, já implantado em produção.

Objetivo: completar a extração de variáveis de cliente para config/637.config.js, sem alterar comportamento, layout, fluxo, integração ou PWA.

A alteração anterior ficou incompleta. Existem valores hardcoded espalhados em app.js, index.html, instalar.html e sw.js. Corrija isso com mínimo impacto.

## Regra principal

Tudo que for específico da 637 deve vir de window.CLIENT_CONFIG.

Se o valor for regra técnica genérica do sistema, pode ficar no código.

Se o valor for nome, texto, cor, telefone, WhatsApp, imagem, manifesto, cache, status exibido, preço, quadra, horário, integração, admin, storage ou mensagem de usuário, deve ir para config/637.config.js.

## Arquivos permitidos

Você pode alterar:

- config/637.config.js
- app.js
- index.html
- instalar.html
- sw.js
- manifest.webmanifest
- admin/index.html, se existir

Não alterar styles.css, exceto se algum texto fixo estiver dentro de pseudo-elemento CSS.

Não instalar dependência.
Não criar backend.
Não refatorar por estética.
Não mudar fluxo de reserva.
Não mudar integração Google Sheets.
Não alterar layout visual.
Não trocar nomes de ids HTML.
Não quebrar PWA.
Não mudar comportamento da 637.

## Problemas que devem ser corrigidos

### 1. APP_CONFIG não pode ter dados reais da 637 como fallback

Hoje app.js tem fallback real para:

- spreadsheetId
- appsScriptWebhookUrl
- adminPassword

Remover esses dados reais do app.js.

O app.js pode ter fallback vazio ou seguro, mas os dados reais devem ficar apenas em config/637.config.js.

Exemplo correto:

const APP_CONFIG = {
  googleSheetsApiKey: LEGACY_APP_CONFIG.googleSheetsApiKey || CLIENT_INTEGRATIONS.googleSheetsApiKey || "",
  spreadsheetId: LEGACY_APP_CONFIG.spreadsheetId || CLIENT_INTEGRATIONS.spreadsheetId || "",
  appsScriptWebhookUrl: LEGACY_APP_CONFIG.appsScriptWebhookUrl || CLIENT_INTEGRATIONS.appsScriptWebhookUrl || "",
  adminPassword: LEGACY_APP_CONFIG.adminPassword || CLIENT_ADMIN.password || ""
};

Se adminPassword estiver vazio, o login admin deve recusar com mensagem clara, sem quebrar tela.

### 2. Completar CLIENT_CONFIG.texts

Mover todos os textos de DEFAULT_COPY para CLIENT_CONFIG.texts.

O DEFAULT_COPY deve ser montado assim:

const DEFAULT_COPY = {
  quickSlotEyebrow: CLIENT_TEXTS.quickSlotEyebrow || "Próximo horário livre",
  ...
}

Todos os campos abaixo devem existir em config/637.config.js:

texts: {
  heroEyebrow,
  heroTitle,
  heroCopy,
  heroPrimaryCta,
  installCta,
  whatsappClassCta,
  quickSlotEyebrow,
  quickSlotLoadingText,
  quickSlotEmptyTitle,
  quickSlotEmptyMeta,
  quickSlotButtonText,
  heroHoursLabel,
  heroHoursDescription,
  scheduleEyebrow,
  scheduleTitle,
  preBookingEyebrow,
  preBookingAmountLabel,
  preBookingRules,
  continueBookingText,
  bookingEyebrow,
  bookingPaymentTitle,
  bookingPixTitle,
  bookingPixSubtitle,
  bookingBillingTitle,
  bookingBillingSubtitle,
  bookingPixLabel,
  bookingPixInstruction,
  bookingBillingNotice,
  billingStatusText,
  pixWhatsAppMessage,
  bookingNextText,
  bookingSubmitText,
  bookingReuseText,
  confirmationEyebrow,
  confirmationTitle,
  confirmationCloseText,
  previousReservationNotFound,
  adminInvalidPassword,
  adminUnlocked,
  adminRefreshSuccess,
  noReservationsForDate,
  pendingReservationSingular,
  pendingReservationPlural,
  confirmPixButton,
  fullDayBlockedTitle,
  fullDayBlockedFallbackReason,
  genericBlockedReason,
  pastDateBlocked,
  pastTimeBlocked,
  slotAlreadyBooked,
  reservationSubmitError,
  blockSubmitError,
  fullDayBlockSubmitError,
  settingsSaved,
  copySaved,
  pixKeyNotConfigured,
  pixKeyCopied
}

Preserve os textos atuais da 637 como valores padrão no config.

### 3. Completar CLIENT_CONFIG.branding

Adicionar e usar:

branding: {
  appName,
  pageTitle,
  installPageTitle,
  appleAppTitle,
  themeColor,
  logoPath,
  logoAlt,
  favicon32,
  appleTouchIcon,
  manifestPath,
  primaryColor,
  secondaryColor
}

index.html e instalar.html devem aplicar esses valores no carregamento via JS leve no app.js ou script inline pequeno seguro.

Não precisa gerar HTML inteiro via JS. Pode manter HTML com fallback, mas deve sobrescrever com config quando existir.

### 4. Completar CLIENT_CONFIG.contact

Criar:

contact: {
  whatsappPhoneNumber,
  classWhatsappMessage,
  pixReceiptMessage
}

Usar isso no botão "Reserve sua aula" do index.html e no link de comprovante PIX.

Não deixar 5511964809815 hardcoded no index.html nem no app.js.

### 5. Corrigir admin

Garantir que admin/index.html, se existir, carrega o config antes do app.js.

Se admin/index.html está dentro da pasta admin, o caminho correto provavelmente é:

<script src="../config/637.config.js"></script>
<script src="../app.js"></script>

Se o projeto usa outra estrutura, detectar caminho real e ajustar.

O admin deve usar:

CLIENT_CONFIG.admin.password
CLIENT_CONFIG.admin.authStorageKey

Não criar nova senha.
Não trocar a senha atual.
Não trocar o storage key atual, para não deslogar todo mundo sem necessidade.

Adicionar validação segura:

- se adminPassword estiver vazio, mostrar "Senha admin não configurada."
- se config não carregou, mostrar "Configuração do cliente não carregada."

### 6. Corrigir storage

Hoje CLIENT_CONFIG.storage.blocksKey existe, mas app.js usa LOCAL_STORAGE_KEY único para reservas e bloqueios.

Escolha uma destas duas opções, sem quebrar dados atuais:

Opção preferida:
- manter LOCAL_STORAGE_KEY único como fallback legado
- adicionar suporte real a reservationsKey e blocksKey separados
- na leitura, aceitar formato antigo e novo
- na escrita local, gravar no formato novo e preservar compatibilidade

Se isso for grande demais, pelo menos remover blocksKey do config ou marcar em comentário que ainda não é usado.

Não deixar config mentiroso.

### 7. Corrigir service worker

O sw.js deve incluir config/637.config.js no APP_SHELL.

Atualizar CACHE_NAME usando valor claro, por exemplo:

const CACHE_NAME = "app-637-v5-config";

Se o service worker não consegue ler window.CLIENT_CONFIG, tudo bem. Mas não pode esquecer de cachear o arquivo config.

Adicionar no APP_SHELL:

"./config/637.config.js"

Não mexer na estratégia de cache fora disso.

### 8. Corrigir instalar.html

instalar.html ainda tem 637 Cervejaria, título, cor e textos fixos.

Carregar config/637.config.js e aplicar:

- theme-color
- apple-mobile-web-app-title
- title
- nome do cliente no topo
- texto principal de instalação
- link voltar, se necessário

Preservar instruções iPhone e Android.

### 9. Regras de status

Não trocar os status enviados para planilha.

Internamente, os valores continuam:

- pendente
- confirmado
- faturado

Os labels exibidos podem vir de config, mas os valores gravados precisam continuar compatíveis com a planilha atual.

### 10. Testes obrigatórios

Depois da alteração, validar manualmente:

- abrir index.html
- verificar se config/637.config.js carregou antes do app.js
- abrir agenda
- abrir pré-reserva
- seguir para formulário
- escolher PIX
- escolher faturamento
- enviar reserva
- abrir admin
- logar com senha atual
- listar reservas
- confirmar PIX
- bloquear horário
- abrir instalar.html
- registrar PWA sem erro no console
- confirmar que sw.js cacheia config/637.config.js

## Critério de pronto

A tarefa só está pronta se:

1. Não existir spreadsheetId real da 637 dentro de app.js.
2. Não existir appsScriptWebhookUrl real da 637 dentro de app.js.
3. Não existir senha real da 637 dentro de app.js.
4. Não existir telefone WhatsApp real da 637 dentro de index.html.
5. config/637.config.js tiver todos os textos usados pelo app.
6. admin/index.html carregar config antes de app.js.
7. sw.js cachear config/637.config.js.
8. O sistema continuar funcionando igual para a 637.
9. O relatório final listar:
   - arquivos alterados
   - valores movidos para config
   - valores que permaneceram hardcoded e motivo técnico
   - testes realizados
   - riscos restantes

## Forma de execução

Faça diff pequeno.
Não reescreva o app inteiro.
Não reorganize pastas.
Não renomeie ids HTML.
Não mude classes CSS.
Não mexa em layout.
Não mexa no Apps Script.
Não mexa na planilha.


session 019e0858-0bf2-7ad1-9c9e-26a6ea2092f5