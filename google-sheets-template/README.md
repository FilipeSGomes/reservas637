# Google Sheets Template

Use estes arquivos para criar a planilha esperada pelo frontend.

## Abas obrigatorias

1. Crie uma nova planilha no Google Sheets.
2. Renomeie a primeira aba para `reservas`.
3. Crie uma segunda aba chamada `bloqueios`.
4. Crie uma terceira aba chamada `config`.
5. Importe [`reservas.csv`](./reservas.csv) na aba `reservas`.
6. Importe [`bloqueios.csv`](./bloqueios.csv) na aba `bloqueios`.
7. Importe [`config.csv`](./config.csv) na aba `config`.
8. Depois de importar, apague as linhas de exemplo se nao quiser dados iniciais.

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

As colunas precisam permanecer nesta ordem:

- `reservas`: `data`, `quadra`, `horario`, `nome`, `telefone`, `cpf`, `status`, `pagamento`, `observacao`, `price`, `period`, `pricingSnapshot`
- `bloqueios`: `data`, `quadra`, `horario`, `motivo`, `tipo`
- `config`: `chave`, `valor`

Chaves esperadas em `config`:

- `pixKey` preenchido no admin, sem fixar no código
- `whatsappPhoneNumber` em dígitos, por exemplo `5511944554650`
- `openingStart`
- `openingEnd`
- `pricing.beachTennis.dayPrice`
- `pricing.beachTennis.nightPrice`
- `pricing.tennis.dayPrice`
- `pricing.tennis.nightPrice`
- `pricing.nightStartsAt`
- `pricing.updatedAt`
- `copy.*` para textos opcionais do front, se quiser centralizar as mensagens no Sheets
- Exemplos de `copy.*`: `quickSlotEyebrow`, `heroHoursLabel`, `scheduleTitle`, `bookingPixLabel`, `pixWhatsAppMessage`

Regra de preço:

- o sistema calcula o valor por tipo de quadra: Beach Tennis ou Tênis
- o sistema usa `pricing.nightStartsAt` para alternar entre o valor diurno e noturno
- reservas novas salvam `price`, `period` e `pricingSnapshot`
- reservas antigas sem `price` seguem como legado, sem reescrita automática
