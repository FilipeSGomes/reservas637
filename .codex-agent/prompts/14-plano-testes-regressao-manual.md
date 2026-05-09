# PROMPT 14 — Plano de Testes de Regressão Manual

## Modo
Somente leitura para código/runtime.
Escrita apenas em `.codex-agent/`.

## Escopo exato
- `index.html`
- `admin/index.html`
- `app.js`
- `sw.js`
- `manifest.webmanifest`

## Objetivo
Gerar plano de regressão manual reproduzível para fluxo crítico: reserva -> sheets -> admin -> bloqueios -> PWA.

## Atualizar arquivos
- `.codex-agent/README-PROJETO.md`
- `.codex-agent/PADROES.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/prompts/` (opcional: subprompts por cenário)

## Dependências
- `00-descoberta-inicial` (executado)
- `13-auditoria-seguranca-admin-e-pii`
