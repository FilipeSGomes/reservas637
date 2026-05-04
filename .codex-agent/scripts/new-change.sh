#!/usr/bin/env bash
# new-change.sh — Cria contrato de mudança
#
# Uso:
#   ./.codex-agent/scripts/new-change.sh "descrição curta da mudança"

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
AGENT_DIR="$PROJECT_DIR/.codex-agent"
AUDIT_LOG="$AGENT_DIR/logs/audit.log"
OPERATOR="${USER:-unknown}"

_audit() {
  printf "%s | %s | %s | %s\n" "$(date +"%Y-%m-%dT%H:%M:%S")" "$OPERATOR" "$1" "${2:-}" >> "$AUDIT_LOG"
}

TITLE="${1:-}"

if [ -z "$TITLE" ]; then
  echo "Uso:"
  echo "  ./.codex-agent/scripts/new-change.sh \"descrição curta da mudança\""
  exit 1
fi

SLUG="$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | \
  iconv -f utf-8 -t ascii//translit 2>/dev/null || echo "$TITLE" | tr '[:upper:]' '[:lower:]')"
SLUG="$(echo "$SLUG" | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"
TS="$(date +"%Y%m%d%H%M%S")"
CONTRACT="$AGENT_DIR/contracts/${TS}-${SLUG}.md"

# Lê o nível de risco do contexto do projeto
RISK_LEVEL="N/A"
if [ -f "$AGENT_DIR/PROJECT-CONTEXT.md" ]; then
  RISK_LEVEL=$(grep -E "Nível de risco" "$AGENT_DIR/PROJECT-CONTEXT.md" | \
    grep -oE 'R[0-5]' | head -1 || echo "N/A")
fi

cat > "$CONTRACT" <<EOF
# Contrato de Mudança — $TITLE

## Status

RASCUNHO — não executar. Aguarda preenchimento e aprovação.

## Metadata

| Campo       | Valor                              |
|-------------|-------------------------------------|
| Criado em   | $(date +"%Y-%m-%d %H:%M:%S")       |
| Criado por  | $OPERATOR                           |
| Aprovado em | —                                   |
| Aprovado por| —                                   |
| Risco projeto | $RISK_LEVEL                       |

## Objetivo

Descrever objetivamente o problema a resolver.

## Contexto

Descrever o contexto técnico e funcional relevante para esta mudança.
Referenciar módulos do MAPA-MENTAL.md se aplicável.

## Arquivos permitidos para leitura

- A preencher

## Arquivos permitidos para alteração

- A preencher

## Arquivos proibidos (não tocar)

- A preencher

## Classificação de risco desta mudança

[ ] Baixo — documentação, comentários, scripts auxiliares
[ ] Médio — lógica de negócio não crítica
[ ] Alto — autenticação, autorização, dados, integrações
[ ] Crítico — fiscal, financeiro, segurança, produção crítica

## Plano de execução

1. A preencher
2. A preencher
3. A preencher

## Plano de teste

1. A preencher
2. A preencher
3. A preencher

## Plano de rollback

A preencher. Deve ser executável em menos de 15 minutos.

## Critérios de aceite

- [ ] A preencher
- [ ] A preencher

## Prompt de execução

Depois de aprovado, executar com:
\`.codex-agent/prompts/99-template-correcao-segura.md\`
EOF

echo "Contrato criado:"
echo "$CONTRACT"
echo ""
echo "Próximos passos:"
echo "  1. Preencha o contrato."
echo "  2. Aprove com: ./.codex-agent/scripts/approve-contract.sh \"$CONTRACT\""

_audit "CONTRACT_CREATED" "file=$CONTRACT title=$TITLE"
