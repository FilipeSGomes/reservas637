# PROMPT 05 — Preparar Contrato da Primeira Correção Segura

## Modo

ALTERAÇÃO CONTROLADA somente em `.codex-agent/contracts/`.
Código-fonte continua SOMENTE LEITURA.

## Dependências

- Executar após:
  - `00-descoberta-inicial`
  - `01-auditoria-fluxo-reserva`
  - `02-auditoria-apps-script-planilhas`
  - `03-auditoria-seguranca-dados`

## Escopo Exato

Arquivos para leitura:

- `.codex-agent/README-PROJETO.md`
- `.codex-agent/index/MODULES.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/DECISOES.md`
- `.codex-agent/PADROES.md`
- `.codex-agent/SCORECARD.md`
- Código-fonte estritamente necessário para a correção proposta.

Arquivos para alteração:

- Criar um contrato em `.codex-agent/contracts/`.
- Atualizar `.codex-agent/CHANGELOG-AGENTE.md`.

## Objetivo

Selecionar uma primeira correção de baixo risco e alto valor, sem executá-la ainda, e formalizar contrato com:

1. Objetivo.
2. Contexto.
3. Arquivos permitidos para leitura.
4. Arquivos permitidos para alteração.
5. Arquivos proibidos.
6. Classificação de risco.
7. Plano de execução.
8. Plano de teste.
9. Plano de rollback.
10. Critérios de aceite.

## Atualizar em `.codex-agent/`

- `.codex-agent/contracts/<nome-do-contrato>.md`
- `.codex-agent/CHANGELOG-AGENTE.md`
- `.codex-agent/DECISOES.md` se surgirem perguntas ou assunções.

## Entrega

- Contrato criado com status pendente de aprovação.
- Justificativa da escolha da primeira correção.
- Nenhuma alteração em código-fonte.
