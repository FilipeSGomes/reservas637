# Contrato 003 — Unificação da Fonte de Preço no Admin

## Status

APROVADO E IMPLEMENTADO (2026-05-05)

## Objetivo

Eliminar ambiguidade entre `pricingByCourt` e `pricingConfig`, garantindo que o sistema use e exponha uma única fonte de verdade para preço.

## Escopo aplicado

- `app.js`
- `admin/index.html`
- Atualizações em memória `.codex-agent/`

## Mudanças implementadas

1. `pricingConfig` permanece como fonte oficial de preço do runtime.
2. Campos `BT1/BT2/TN1/TN2` no admin foram convertidos para informativos (readonly/disabled).
3. Formulário de configurações gerais (`saveSettings`) deixou de aceitar edição de preço por quadra.
4. `pricingByCourt` passa a ser derivado de `pricingConfig` (valores diurnos por tipo), para compatibilidade com legado e visualização.
5. Salvar configuração de preços (`savePricingConfig`) atualiza também o snapshot derivado de `pricingByCourt`.

## Testes esperados

1. Alterar preço no bloco "Configuração de valores" e salvar.
2. Validar que agenda/slot/pix usam novo preço.
3. Validar que bloco "Valores por quadra" apenas espelha os valores diurnos.
4. Validar que salvar configurações gerais (PIX, WhatsApp, horário) não altera preço.

## Risco residual

Baixo a médio: comportamento de preço fica consistente, mas ainda depende de publicação correta do Apps Script e sincronização de cache/browser.
