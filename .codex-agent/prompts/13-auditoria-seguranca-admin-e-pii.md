# PROMPT 13 — Auditoria de Segurança Admin e PII

## Modo
Somente leitura para código/runtime.
Escrita apenas em `.codex-agent/`.

## Escopo exato
- `admin/index.html`
- `app.js`
- `config/637.config.js`
- `google-sheets-template/apps-script.gs`

## Objetivo
Auditar superfície de ataque do admin, exposição de PII e controles mínimos (mascaramento, autenticação, abuso de webhook).

## Atualizar arquivos
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/DECISOES.md`
- `.codex-agent/SCORECARD.md`

## Dependências
- `00-descoberta-inicial` (executado)
- `12-validacao-contratos-dados-horarios`
