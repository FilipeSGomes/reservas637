# Contrato 001 — Bloquear Reservas em Datas Passadas

## Status

APROVADO PELO USUÁRIO E IMPLEMENTADO NO REPOSITÓRIO

## Aprovação

- Aprovado no chat pelo usuário em 2026-04-27.
- Implementação realizada no repositório após aprovação.
- Publicação do Apps Script em produção ainda deve ser feita manualmente fora do repositório, copiando/publicando o conteúdo versionado de `google-sheets-template/apps-script.gs`.

## 1. Objetivo

Impedir que clientes criem reservas públicas em datas passadas, preservando o comportamento existente para datas atuais/futuras e sem alterar a estrutura do Google Sheets.

## 2. Contexto

Regra de negócio confirmada: reservas em datas passadas devem ser bloqueadas.

Auditorias `01` e `02` confirmaram que:

- O frontend permite selecionar data passada e tentar enviar reserva.
- `submitBooking()` não valida data passada antes de chamar o webhook.
- O Apps Script de produção é igual ao versionado e também não valida data passada.
- A URL de Apps Script é produção.
- A aplicação usa PWA com service worker cache-first; alteração em `app.js` requer cuidado com `CACHE_NAME`.

Esta correção foi escolhida como primeira por ser regra confirmada, ter escopo pequeno, reduzir risco operacional real e não exigir mudança de modelo de dados.

## 3. Arquivos Permitidos para Leitura

- `.codex-agent/README-PROJETO.md`
- `.codex-agent/index/MODULES.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/DECISOES.md`
- `.codex-agent/PADROES.md`
- `.codex-agent/SCORECARD.md`
- `index.html`
- `app.js`
- `sw.js`
- `google-sheets-template/apps-script.gs`

## 4. Arquivos Permitidos para Alteração

- `app.js`
- `sw.js`
- `google-sheets-template/apps-script.gs`
- `.codex-agent/CHANGELOG-AGENTE.md`
- `.codex-agent/DECISOES.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/SCORECARD.md`

## 5. Arquivos Proibidos

- `index.html`
- `styles.css`
- `manifest.webmanifest`
- `README.md`
- `CNAME`
- `google-sheets-template/reservas.csv`
- `google-sheets-template/bloqueios.csv`
- `icons/**`
- `images/**`
- Qualquer arquivo fora da lista permitida para alteração.

## 6. Classificação de Risco

Risco: Médio.

Justificativa:

- Toca fluxo crítico de reserva e Apps Script de produção.
- Não altera credenciais/configuração, nomes de abas, colunas ou payload base.
- Mudança é restrita a validação de data passada e atualização de cache PWA.
- Requer teste fim a fim antes de deploy.

## 7. Plano de Execução

1. Em `app.js`, adicionar helper para comparar `YYYY-MM-DD` com a data local de hoje.
2. Em `app.js`, definir `min` do `#date-input` para hoje durante `boot()`.
3. Em `app.js`, ao trocar a data, se for passada, normalizar de volta para hoje, recarregar agenda e exibir mensagem clara.
4. Em `app.js`, antes de `submitBooking()`, bloquear envio se `state.selectedDate` for passada.
5. Em `google-sheets-template/apps-script.gs`, adicionar validação em `appendReservation_()` para recusar `payload.data` anterior à data atual no timezone do script.
6. Em `google-sheets-template/apps-script.gs`, não aplicar essa validação em `block:create` neste contrato, pois ainda há pergunta pendente sobre bloqueios admin em datas passadas.
7. Em `sw.js`, incrementar `CACHE_NAME` para invalidar app shell antigo.
8. Atualizar memória `.codex-agent/` com resultado, testes e riscos residuais.

## 8. Plano de Teste

Teste manual local/estático:

1. Abrir `index.html` em servidor estático local.
2. Confirmar que o campo de data não permite data anterior a hoje pela UI nativa quando suportado.
3. Tentar forçar data passada via DevTools ou edição manual do input.
4. Confirmar que a interface volta para hoje ou impede envio com mensagem de erro.
5. Confirmar que reserva para hoje ainda abre pré-reserva, formulário e pagamento.
6. Confirmar que reserva para data futura ainda abre pré-reserva, formulário e pagamento.
7. Confirmar que PIX continua gerando status `pendente`.
8. Confirmar que faturamento continua gerando status `faturado`.

Teste Apps Script:

1. Executar `reservation:create` com data passada em ambiente de teste do Apps Script e validar resposta de erro.
2. Executar `reservation:create` com data de hoje e validar comportamento existente.
3. Executar `reservation:create` com data futura e validar comportamento existente.
4. Confirmar que `reservation:confirm` não foi alterado.
5. Confirmar que `block:create` não foi alterado neste contrato.

Teste PWA/cache:

1. Confirmar que `CACHE_NAME` foi incrementado.
2. Em navegador com versão anterior aberta, recarregar e verificar que novo `app.js` é entregue após ciclo de atualização do service worker.
3. Confirmar que agenda online continua carregando.

## 9. Plano de Rollback

Rollback por Git:

1. Reverter o commit da alteração em `app.js`, `sw.js` e `google-sheets-template/apps-script.gs`.
2. Republicar GitHub Pages com a versão anterior.
3. Republicar Apps Script com a versão anterior versionada no repositório.
4. Se o cache novo já tiver sido distribuído, incrementar novamente `CACHE_NAME` no rollback para forçar app shell coerente com a versão revertida.
5. Validar reserva para hoje e futura após rollback.

Rollback operacional temporário:

1. Se a validação no Apps Script bloquear reservas válidas, restaurar a versão anterior do script no editor do Apps Script usando histórico/versionamento do Google ou o arquivo versionado anterior.
2. Registrar incidente em `.codex-agent/CHANGELOG-AGENTE.md`.

## 10. Critérios de Aceite

- Usuário não consegue enviar reserva pública em data anterior à data local atual.
- Apps Script recusa `reservation:create` com data passada mesmo se chamado diretamente.
- Reservas para hoje e datas futuras continuam funcionando.
- Nenhum valor de `spreadsheetId`, URL de Apps Script, senha admin ou chave PIX é alterado.
- Estrutura das abas `reservas` e `bloqueios` permanece inalterada.
- `block:create` não muda comportamento neste contrato.
- `CACHE_NAME` é incrementado.
- Teste manual do fluxo reserva -> webhook/Sheets -> admin é executado antes de deploy.

## Resultado da Implementação

- `app.js`: definido `min` do campo de data para hoje; troca para data passada volta para hoje e exibe aviso; envio de reserva em data passada é bloqueado antes do webhook.
- `google-sheets-template/apps-script.gs`: `reservation:create` passa a recusar data passada no Apps Script.
- `sw.js`: `CACHE_NAME` incrementado para `app-637-v3`.

## Verificações Executadas

- `node --check app.js`: aprovado.
- `node --check sw.js`: aprovado.
- `node --check` do conteúdo de `google-sheets-template/apps-script.gs` copiado temporariamente para `/tmp/apps-script-check.js`: aprovado.

## Verificações Pendentes

- Teste manual em navegador com fluxo completo reserva -> Apps Script/Sheets -> admin.
- Publicação do Apps Script em produção.
- Validação de atualização PWA em cliente com service worker anterior.
