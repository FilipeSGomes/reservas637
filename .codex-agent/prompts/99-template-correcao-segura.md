# PROMPT 99 — Template de Correção Segura

## Modo

Alteração controlada — somente o escrito no contrato.

## Leitura obrigatória antes de qualquer ação

1. `.codex-agent/PROJECT-CONTEXT.md`
2. `.codex-agent/AGENTS.md`
3. `.codex-agent/README-PROJETO.md`
4. `.codex-agent/MAPA-MENTAL.md`
5. `.codex-agent/RISCOS.md`
6. `.codex-agent/DECISOES.md`
7. Contrato de mudança correspondente em `.codex-agent/contracts/`
   → Verificar que status é **APROVADO**. Se não for, parar.

## Verificações antes de alterar

- [ ] Contrato tem status APROVADO?
- [ ] Todos os arquivos do escopo estão listados no contrato?
- [ ] Plano de rollback está documentado?
- [ ] Plano de teste está documentado?

## Regras de execução

- Alterar somente os arquivos listados em "Arquivos permitidos para alteração".
- Diff mínimo — nenhuma linha fora do escopo.
- Não refatorar por estética.
- Não mudar comportamento não relacionado ao objetivo.
- Não instalar dependências.
- Não alterar schema sem migration correspondente.
- Não remover código sem justificativa documentada.

## Saída obrigatória

1. Arquivos lidos.
2. Arquivos alterados (com diff resumido).
3. O que mudou e por quê.
4. Como testar (passo a passo).
5. Como reverter (passo a passo).
6. Riscos remanescentes após a mudança.
7. Atualizações feitas na documentação viva.
8. Atualização do `CHANGELOG-AGENTE.md`.
