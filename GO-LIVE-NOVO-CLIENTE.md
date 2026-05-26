# Go-live de novo cliente

Use este checklist quando o comercial fechar um novo cliente.

## 1. Dados minimos para implantacao

- Nome publico do cliente
- Nome curto
- Dominio ou subdominio desejado
- WhatsApp de atendimento
- Chave PIX
- Horario de funcionamento
- Lista de quadras
- Preco diurno/noturno por modalidade ou quadra
- Regras de cancelamento
- Quem acessa o admin
- Senha temporaria do admin

## 2. Preparar configuracao

1. Copiar config/_client-template.config.js para config/cliente.config.js.
2. Trocar todos os campos com cliente-id pelo id real, em minusculo e sem espacos.
3. Preencher marca, horarios, quadras, precos, WhatsApp e PIX.
4. Preencher integrations.spreadsheetId e integrations.appsScriptWebhookUrl.
5. Trocar a senha admin antes do go-live.
6. Registrar o cliente em config/clients.js.
7. Se tiver dominio, registrar o hostname em hostnameMap.

## 3. Preparar Google Sheets e Apps Script

1. Criar uma copia da planilha modelo.
2. Garantir abas reservas, bloqueios e config.
3. Importar ou copiar os cabecalhos de google-sheets-template.
4. Publicar Apps Script como Web App.
5. Atualizar o webhook na config do cliente.

## 4. Validacao antes de enviar ao cliente

- Abrir index.html?client=cliente.
- Confirmar marca/textos.
- Confirmar quadras e horarios.
- Criar reserva PIX de teste.
- Criar reserva faturamento/mensalista de teste.
- Abrir admin/?client=cliente.
- Login admin funciona.
- Reserva aparece no admin.
- Confirmar PIX funciona.
- Bloquear horario funciona.
- Bloquear dia inteiro funciona.
- Testar no celular em 375px.

## 5. Go-live

- Apontar dominio/subdominio.
- Conferir que hostname carrega o cliente certo sem query string.
- Fazer uma reserva real assistida.
- Validar se caiu na planilha correta.
- Remover dados de teste ou marcar como teste/cancelado.

## 6. Pos-go-live

- Registrar pendencias no FISAM governance.
- Atualizar README/agente com particularidades do cliente.
- Planejar migracao para Next.js + PostgreSQL se o cliente exigir login, multiunidade, auditoria forte ou volume maior.
