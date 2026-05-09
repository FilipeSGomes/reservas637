# PROMPT 15 — Contrato de Hardening Mínimo do Admin

## Modo
Alteração controlada apenas em `.codex-agent/` (sem tocar código-fonte).

## Escopo exato
- Evidências de `app.js`, `admin/index.html`, `config/637.config.js`
- Contratos em `.codex-agent/contracts/`

## Objetivo
Preparar contrato APROVADO para endurecimento mínimo de segurança admin (sem backend): mensagens, bloqueios básicos de abuso, redução de exposição de PII na UI.

## Atualizar arquivos
- `.codex-agent/contracts/` (novo contrato)
- `.codex-agent/DECISOES.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/CHANGELOG-AGENTE.md`

## Dependências
- `13-auditoria-seguranca-admin-e-pii`
- `14-plano-testes-regressao-manual`
