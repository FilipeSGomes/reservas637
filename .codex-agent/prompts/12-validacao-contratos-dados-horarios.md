# PROMPT 12 — Validação de Contratos de Dados e Horários

## Modo
Somente leitura para código/runtime.
Escrita apenas em `.codex-agent/`.

## Escopo exato
- `AGENTS.md`
- `config/637.config.js`
- `app.js`
- `google-sheets-template/apps-script.gs`
- `google-sheets-template/*.csv`

## Objetivo
Mapear e resolver documentalmente divergências de contrato (horários, campos, status e regras) entre documentação e implementação.

## Atualizar arquivos
- `.codex-agent/DECISOES.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/contracts/` (criar contrato se mudança de código for necessária)

## Dependências
- `00-descoberta-inicial` (executado)
