# Contrato 002 — Correção de Configurações do Admin que Não Refletem

## Status

APROVADO E IMPLEMENTADO (2026-05-05)

## 1. Objetivo

Corrigir o fluxo de configuração para que alterações feitas no admin reflitam de forma consistente no sistema, com foco em:

1. Persistência de textos `copy.*` no Google Sheets.
2. Coerência entre os blocos de configuração de preço e o motor de precificação usado na agenda/reserva.

## 2. Contexto

Diagnóstico confirmado no código:

- O admin envia textos via `saveCopySettings()` com `settings.copy`, porém o Apps Script não grava os valores enviados, apenas preserva `copy.*` já existente na planilha.
- O bloco “Valores por quadra” (`BT1`, `BT2`, `TN1`, `TN2`) é salvo, mas o cálculo de preço da agenda/reserva usa `pricingConfig` (diurno/noturno por tipo), criando percepção de “não refletiu”.

Evidências principais:

- `app.js`: leitura de `copy.*` em `configRowsToSettings()` e aplicação em `applySettings()`.
- `app.js`: envio de `settings.copy` em `saveCopySettings()`.
- `google-sheets-template/apps-script.gs`: `updateConfig_()` não mescla `settings.copy` no objeto `merged` antes de `writeKeyValueSheet_()`.
- `app.js`: `resolveSlotPricing()` usa `pricingConfig`; `pricingByCourt` é praticamente legado para formulário e fallback parcial.

## 3. Arquivos Permitidos para Leitura

- `app.js`
- `admin/index.html`
- `google-sheets-template/apps-script.gs`
- `google-sheets-template/config.csv`
- `.codex-agent/README-PROJETO.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/DECISOES.md`

## 4. Arquivos Permitidos para Alteração

- `app.js`
- `admin/index.html`
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
- `sw.js`
- `CNAME`
- Qualquer alteração em `spreadsheetId`, `appsScriptWebhookUrl` e `adminPassword`
- Qualquer mudança de estrutura das abas `reservas`, `bloqueios`, `config`

## 6. Classificação de Risco

Risco: Médio-Alto.

Justificativa:

- Toca configuração global e Apps Script de produção.
- Pode afetar experiência pública (textos e preço exibido).
- Escopo é controlado e aditivo, sem mexer em colunas/abas.

## 7. Plano de Execução

1. Ajustar `updateConfig_()` no Apps Script para gravar explicitamente as chaves `copy.*` recebidas em `settings.copy`.
2. Manter preservação de chaves existentes não conhecidas para evitar perda de configuração.
3. Definir regra única de precificação para o admin:
   - opção recomendada: tornar “Configuração de valores” (`pricingConfig`) fonte oficial e tratar “Valores por quadra” como legado (somente leitura) ou removê-lo da edição para evitar conflito.
4. Ajustar frontend conforme regra escolhida para eliminar dupla fonte de verdade.
5. Validar sincronização pós-salvamento: salvar -> recarregar `config` -> `applySettings()` -> render da agenda.
6. Atualizar memória técnica em `.codex-agent/` com decisão final sobre modelo de preço.

## 8. Plano de Teste

1. Alterar um campo de texto em “Textos do app”, salvar e recarregar página pública; confirmar refletido.
2. Confirmar que a aba `config` recebeu/atualizou as chaves `copy.*` esperadas.
3. Alterar preços na fonte oficial definida (pricing) e validar:
   - cartão de horário disponível,
   - resumo da reserva,
   - valor no PIX,
   - mensagem de confirmação.
4. Validar que salvar configuração não altera fluxo de reserva/confirmar/bloquear.
5. Testar em `/admin/` e `index.html` na mesma data, com refresh.

## 9. Plano de Rollback

1. Reverter commit das alterações em `app.js`, `admin/index.html` e `apps-script.gs`.
2. Republicar versão anterior no GitHub Pages.
3. Republicar Apps Script anterior.
4. Validar rapidamente: agenda carrega, reserva envia, admin abre.

## 10. Critérios de Aceite

- Alterações de textos no admin refletem no frontend após salvar e recarregar.
- `config:update` persiste `copy.*` corretamente na planilha.
- Não existe ambiguidade ativa de fonte de preço no admin.
- Nenhuma credencial/URL/ID sensível foi alterada.
- Estrutura de abas/colunas permanece intacta.
