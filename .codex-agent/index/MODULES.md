# Inventário de Módulos Críticos

> Atualizado em 2026-05-05 (descoberta incremental em modo leitura).

## 1. Frontend Público (Reserva)
- Arquivos: `index.html`, `app.js`, `styles.css`.
- Função: agenda visual, pré-reserva, cadastro de cliente, escolha de pagamento, envio da solicitação.
- Dados sensíveis: nome, telefone, CPF, observação.
- Criticidade: alta.

## 2. Painel Admin
- Arquivos: `admin/index.html`, `app.js`.
- Função: login por senha simples, confirmação PIX, bloqueio por faixa/dia, configuração de preços/textos/PIX/WhatsApp.
- Criticidade: crítica.

## 3. Motor de Agenda e Regras Locais
- Arquivo: `app.js`.
- Função: leitura de `reservas` e `bloqueios`, cálculo de status, regra de disponibilidade, normalizações de data/hora/pagamento.
- Criticidade: alta.

## 4. Integração Google Sheets (Leitura)
- Arquivo: `app.js`.
- Função: leitura pública via `gviz/tq` das abas `reservas`, `bloqueios` e `config`.
- Criticidade: alta.

## 5. Integração Apps Script (Escrita)
- Arquivos: `app.js`, `google-sheets-template/apps-script.gs`.
- Ações: `reservation:create`, `reservation:confirm`, `block:create`, `config:update`.
- Função: persistência e validações server-side mínimas.
- Criticidade: crítica.

## 6. Persistência de Configuração Operacional
- Arquivos: aba `config` no Sheets, `app.js`, `google-sheets-template/config.csv`.
- Função: chave PIX, WhatsApp, horários de funcionamento, precificação e cópias de texto.
- Criticidade: alta.

## 7. PWA e Cache
- Arquivos: `manifest.webmanifest`, `sw.js`, `instalar.html`, `icons/*`.
- Função: instalação e cache offline de app shell.
- Estado observado: `CACHE_NAME = app-637-v4`.
- Criticidade: média.

## 8. Provisionamento
- Arquivos: `google-sheets-template/README.md`, `*.csv`, `apps-script.gs`.
- Função: bootstrap de planilha e webhook.
- Criticidade: média.
