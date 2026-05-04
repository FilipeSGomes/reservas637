# Google Sheets Template

Use estes arquivos para criar a planilha esperada pelo frontend.

## Abas obrigatorias

1. Crie uma nova planilha no Google Sheets.
2. Renomeie a primeira aba para `reservas`.
3. Crie uma segunda aba chamada `bloqueios`.
4. Importe [`reservas.csv`](./reservas.csv) na aba `reservas`.
5. Importe [`bloqueios.csv`](./bloqueios.csv) na aba `bloqueios`.
6. Depois de importar, apague as linhas de exemplo se nao quiser dados iniciais.

## Apps Script

1. Abra `Extensoes > Apps Script` na planilha.
2. Cole o conteudo de [`apps-script.gs`](./apps-script.gs).
3. Publique como Web App com acesso para `Anyone`.
4. Copie a URL publicada para `appsScriptWebhookUrl` em [`app.js`](../app.js).

## Configuracao do frontend

Preencha em [`app.js`](../app.js):

- `spreadsheetId`
- `googleSheetsApiKey` deve permanecer vazio para leitura publica via gviz
- `appsScriptWebhookUrl`
- `pixKey`

As colunas precisam permanecer nesta ordem:

- `reservas`: `data`, `quadra`, `horario`, `nome`, `telefone`, `cpf`, `status`, `pagamento`, `observacao`
- `bloqueios`: `data`, `quadra`, `horario`, `motivo`, `tipo`
