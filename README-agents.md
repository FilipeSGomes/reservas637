# Sistema de Reserva 637 Cervejaria

Documento para leitura por agentes. Resume o que existe no código sem inventar arquitetura, fluxo ou integrações.

## O que o sistema faz

- Interface pública para ver a grade de horários por data e por quadra.
- Fluxo de pré-reserva, formulário e escolha de pagamento.
- Painel admin separado para login, lista de reservas do dia, confirmação de PIX e bloqueios.
- Persistência principal via Google Sheets + Apps Script.
- Fallback local em `localStorage` quando a integração remota falha.

## Stack real

- HTML5
- CSS3
- JavaScript puro
- Bootstrap 5 via CDN
- Google Fonts via CDN
- Google Sheets para leitura via `gviz/tq`
- Google Apps Script para escrita via `POST`
- Service Worker para suporte a PWA

## Arquivos relevantes

- `index.html`
- `admin/index.html`
- `app.js`
- `styles.css`
- `manifest.webmanifest`
- `instalar.html`
- `sw.js`
- `icons/`
- `images/`

## Quadras

- `BT1` - Beach Tennis 1
- `BT2` - Beach Tennis 2
- `TN1` - Tênis 1
- `TN2` - Tênis 2

## Horário

- Funcionamento padrão: 07h às 22h
- Blocos de 1 hora

## Fluxo público

1. Usuário escolhe a data.
2. Sistema carrega reservas e bloqueios.
3. Grade mostra horários por quadra.
4. Usuário clica em um horário disponível.
5. Abre modal de pré-reserva com regras e valor.
6. Usuário preenche nome, telefone e CPF.
7. Usuário escolhe `pix` ou `faturamento`.
8. Sistema envia a reserva ao Apps Script.

## Fluxo de pagamento

- `pix`: reserva criada com status `pendente`.
- `faturamento`: reserva criada com status `faturado`.

## Admin

- Senha simples hardcoded em `app.js`.
- Estado de autenticação salvo em `localStorage`.
- Funções visíveis no código:
  - ver reservas do dia
  - confirmar reservas pendentes
  - bloquear faixa de horário
  - bloquear dia inteiro
  - editar valores e textos

## Integração com Google Sheets

### Leitura

- A agenda é buscada por URL `gviz/tq`.
- O `spreadsheetId` vem de `APP_CONFIG`.

### Escrita

- O frontend faz `POST` JSON para `appsScriptWebhookUrl`.
- Formato: `{ action, payload }`

### Ações usadas

- `reservation:create`
- `reservation:confirm`
- `block:create`

## Abas esperadas

### `reservas`

- `data`
- `quadra`
- `horario`
- `nome`
- `telefone`
- `cpf`
- `status`
- `pagamento`
- `observacao`

Campos extras que o código também lê quando existirem:

- `price`
- `period`
- `pricingSnapshot`

### `bloqueios`

- `data`
- `quadra`
- `horario`
- `motivo`
- `tipo`

### `config`

Usada para carregar:

- `pixKey`
- `whatsappPhoneNumber`
- `openingStart`
- `openingEnd`
- preços por quadra
- textos da interface

## Configuração central

Em `APP_CONFIG` dentro de `app.js`:

- `googleSheetsApiKey` está vazia
- `spreadsheetId` aponta para a planilha principal
- `appsScriptWebhookUrl` aponta para o Apps Script
- `adminPassword` é a senha do admin

## Fallback local

O sistema grava em `localStorage`:

- reservas
- bloqueios
- cache de configurações
- autenticação do admin
- último contato de reserva

Isso permite manter a interface funcionando quando a leitura/escrita remota falha.

## Status visuais

- disponível
- pendente
- confirmado
- bloqueado
- faturado

## Observações

- O projeto é mobile first.
- Não há backend próprio.
- Não há SPA.
- A lógica principal está toda em `app.js`.
