# Inventário de Módulos Críticos

> Atualizado em 2026-05-08.

## 1. Frontend Público (Reserva)
- Arquivos: `index.html`, `app.js`, `styles.css`.
- Função: agenda visual, pré-reserva, cadastro (nome/telefone/CPF), escolha de pagamento e envio.
- Criticidade: alta.

## 2. Painel Admin
- Arquivos: `admin/index.html`, `app.js`.
- Função: autenticação simples, confirmação PIX, bloqueios, edição de configuração operacional.
- Criticidade: crítica.

## 3. Motor de Agenda e Regras
- Arquivo: `app.js`.
- Função: compor disponibilidade por data/quadra/horário, estados visuais e validações de fluxo.
- Criticidade: alta.

## 4. Integração de Leitura (Sheets)
- Arquivo: `app.js`.
- Função: leitura `gviz/tq` das abas `reservas`, `bloqueios`, `config`.
- Criticidade: alta.

## 5. Integração de Escrita (Apps Script)
- Arquivos: `app.js`, `google-sheets-template/apps-script.gs`.
- Ações: `reservation:create`, `reservation:confirm`, `block:create`, `config:update`.
- Criticidade: crítica.

## 6. Configuração de Cliente e Negócio
- Arquivos: `config/637.config.js`, aba `config` (Sheets), `google-sheets-template/config.csv`.
- Função: branding, contato, horários, preços, textos.
- Criticidade: alta.

## 7. PWA e Cache
- Arquivos: `manifest.webmanifest`, `sw.js`, `instalar.html`, `icons/*`.
- Função: instalação e app shell offline.
- Criticidade: média.

## 8. Provisionamento/Template
- Arquivos: `google-sheets-template/README.md`, `*.csv`, `apps-script.gs`.
- Função: bootstrap de nova planilha + webhook.
- Criticidade: média.
