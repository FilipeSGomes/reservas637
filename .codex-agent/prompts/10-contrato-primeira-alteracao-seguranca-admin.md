# Prompt 10 — Contrato da Primeira Alteração de Segurança Admin

## Modo
Alteração controlada com contrato. Sem execução fora do escopo aprovado.

## Escopo
Preparar contrato para alteração mínima e aditiva no painel admin (ex.: mascaramento de CPF por padrão sem quebrar operação).

## Objetivo
Criar contrato completo (execução, testes e rollback) para primeira melhoria de segurança de baixo risco funcional.

## Atualizar
- `.codex-agent/contracts/<novo-contrato>.md`
- `.codex-agent/DECISOES.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/CHANGELOG-AGENTE.md`

## Dependências
- `00-descoberta-inicial.md`
- `07-matriz-lgpd-dados-pessoais.md`
- `08-plano-testes-manuais-evidencias.md`
- `09-runbook-deploy-rollback-pages-appsscript.md`
