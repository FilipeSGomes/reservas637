# Mapa Mental Técnico

> Atualizado em 2026-04-27 durante a descoberta inicial.

## Domínios

- Reservas de quadras.
- Bloqueios de horários.
- Confirmação de pagamento PIX.
- Faturamento manual/mensal.
- Administração de agenda.
- PWA/instalação mobile.

## Fluxos Críticos

### Reserva pública

`index.html` -> clique em slot disponível -> modal de pré-reserva -> formulário de dados pessoais -> escolha de pagamento -> `submitBooking()` -> `submitMutation("reservation:create")` -> Apps Script -> Google Sheets.

### Confirmação PIX

Painel admin -> senha simples -> lista reservas do dia -> botão "Confirmar PIX" -> `confirmReservation()` -> `submitMutation("reservation:confirm")` -> Apps Script atualiza status.

### Bloqueio de horário

Painel admin -> formulário de bloqueio -> `submitBlock()` -> valida conflito local -> `submitMutation("block:create")` -> Apps Script grava aba `bloqueios`.

### Leitura da agenda

`loadAgenda()` -> `fetchSheetRows("reservas")` + `fetchSheetRows("bloqueios")` -> parsing `gviz/tq` -> filtro por data selecionada -> renderização da grade e admin.

### PWA

`index.html`/`instalar.html` referenciam manifesto. `app.js` registra `sw.js`, mas apenas páginas que carregam `app.js` registram service worker. `sw.js` instala cache de app shell e intercepta GETs com estratégia cache-first.

## Dependências Externas

- Google Sheets.
- Google Apps Script.
- CDN Bootstrap.
- CDN Google Fonts.
- GitHub Pages.
- Navegador com suporte a `dialog`, `fetch`, `localStorage`, `serviceWorker` e Cache API.

## Pontos de Acoplamento

- Estrutura e nomes das abas do Google Sheets.
- Nomes das actions aceitas pelo Apps Script.
- Campos esperados no payload de reserva/bloqueio.
- Formato de datas/horários retornados pelo `gviz`.
- IDs/classes do DOM usados por `app.js`.
- Nome do cache em `sw.js`.
- Caminhos estáticos em `APP_SHELL`.

## Mapa de Pastas

- Raiz: aplicação estática e configuração de domínio.
- `google-sheets-template/`: material para provisionar planilha e webhook.
- `icons/`: assets PWA.
- `images/`: imagem de marca.
- `.codex-agent/`: governança, memória técnica e prompts incrementais.

## Mapa de Dados

### Reserva

Campos confirmados: data, quadra, horário, nome, telefone, CPF, status, pagamento e observação.

Status reconhecidos: `pendente`, `confirmado`, `faturado`.

Pagamento reconhecido: `pix` ou `faturamento`.

### Bloqueio

Campos confirmados: data, quadra, horário e motivo.

### Quadras

`BT1`, `BT2`, `TN1`, `TN2`.

### Horários

Blocos de 1 hora de `07:00` a `22:00`.

## Mapa de Integrações

- Leitura: navegador -> Google Sheets `gviz/tq`.
- Escrita: navegador -> Apps Script -> Google Sheets.
- Deploy: repositório -> GitHub Pages -> domínio customizado.
- PWA: navegador -> manifesto + service worker + cache local.

## Mapa de Cache e Assets

- Cache versionado: `app-637-v2`.
- App shell pré-cacheado: raiz, `index.html`, `instalar.html`, `styles.css`, `app.js`, `manifest.webmanifest`, imagem de perfil e ícones.
- Assets externos: Bootstrap e Google Fonts não entram no `APP_SHELL`, mas podem ser cacheados dinamicamente após requisição GET.
- Dados externos: leituras de Google Sheets usam `cacheBust`, o que reduz reuso indevido, mas pode acumular entradas únicas no Cache Storage.
- Mutações POST para Apps Script não são interceptadas pelo service worker.

## Entrypoints Detectados

- `index.html`
- `instalar.html`
- `app.js`
- `sw.js`
- `google-sheets-template/apps-script.gs`
