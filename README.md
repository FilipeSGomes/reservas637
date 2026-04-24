# Reserva de Quadras

Sistema estático em HTML, CSS e JavaScript puro para publicar no GitHub Pages.

## Arquivos

- `index.html`: interface pública e painel admin.
- `styles.css`: layout mobile first e grade visual por quadra.
- `app.js`: leitura da agenda, reservas, bloqueios e painel admin.

## Configuração

Edite `APP_CONFIG` em [`app.js`](/Users/filipe.gomes/Documents/PersonalWorkspace/aluguel%20de%20quadras/app.js) com:

- `googleSheetsApiKey`: chave pública da Google Sheets API.
- `spreadsheetId`: ID da planilha.
- `appsScriptWebhookUrl`: URL do Apps Script para POST.
- `adminPassword`: senha hardcoded do painel.
- `pixKey`: chave PIX exibida ao cliente.

## Estrutura esperada no Google Sheets

### Aba `reservas`

Colunas:

- `data`
- `quadra`
- `horario`
- `nome`
- `telefone`
- `status`

### Aba `bloqueios`

Colunas:

- `data`
- `quadra`
- `horario`
- `motivo`

Arquivos prontos para importacao e um modelo de Apps Script foram adicionados em [`google-sheets-template/README.md`](/Users/filipe.gomes/Documents/PersonalWorkspace/aluguel%20de%20quadras/google-sheets-template/README.md).

## Webhook esperado

O frontend envia `POST` JSON para o Apps Script neste formato:

```json
{
  "action": "reservation:create",
  "payload": {
    "data": "2026-04-24",
    "quadra": "BT1",
    "horario": "07:00",
    "nome": "Cliente",
    "telefone": "(11) 99999-9999",
    "status": "pendente"
  }
}
```

Ações usadas:

- `reservation:create`
- `reservation:confirm`
- `block:create`

## Observação

Sem API key e webhook configurados, a aplicação entra em modo local usando `localStorage`, o que facilita testar a interface antes de conectar o backend.
# reservas637
# reservas637
