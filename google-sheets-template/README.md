# Google Sheets Template

Use estes arquivos para criar a planilha esperada pelo frontend.

## Abas obrigatorias

1. Crie uma nova planilha no Google Sheets.
2. Renomeie a primeira aba para `reservas`.
3. Crie uma segunda aba chamada `bloqueios`.
4. Importe [`reservas.csv`](/Users/filipe.gomes/Documents/PersonalWorkspace/aluguel%20de%20quadras/google-sheets-template/reservas.csv) na aba `reservas`.
5. Importe [`bloqueios.csv`](/Users/filipe.gomes/Documents/PersonalWorkspace/aluguel%20de%20quadras/google-sheets-template/bloqueios.csv) na aba `bloqueios`.
6. Depois de importar, apague as linhas de exemplo se nao quiser dados iniciais.

## Apps Script

1. Abra `Extensoes > Apps Script` na planilha.
2. Cole o conteudo de [`apps-script.gs`](/Users/filipe.gomes/Documents/PersonalWorkspace/aluguel%20de%20quadras/google-sheets-template/apps-script.gs).
3. Publique como Web App com acesso para `Anyone`.
4. Copie a URL publicada para `appsScriptWebhookUrl` em [`app.js`](/Users/filipe.gomes/Documents/PersonalWorkspace/aluguel%20de%20quadras/app.js:1).

## Configuracao do frontend

Preencha em [`app.js`](/Users/filipe.gomes/Documents/PersonalWorkspace/aluguel%20de%20quadras/app.js:1):

- `spreadsheetId`
- `googleSheetsApiKey`
- `appsScriptWebhookUrl`
- `pixKey`

As colunas precisam permanecer nesta ordem:

- `reservas`: `data`, `quadra`, `horario`, `nome`, `telefone`, `status`
- `bloqueios`: `data`, `quadra`, `horario`, `motivo`
