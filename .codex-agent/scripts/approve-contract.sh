#!/usr/bin/env bash
# approve-contract.sh — Aprova um contrato de mudança
#
# Uso:
#   ./.codex-agent/scripts/approve-contract.sh .codex-agent/contracts/ARQUIVO.md

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
AGENT_DIR="$PROJECT_DIR/.codex-agent"
AUDIT_LOG="$AGENT_DIR/logs/audit.log"
OPERATOR="${USER:-unknown}"

_audit() {
  printf "%s | %s | %s | %s\n" "$(date +"%Y-%m-%dT%H:%M:%S")" "$OPERATOR" "$1" "${2:-}" >> "$AUDIT_LOG"
}

CONTRACT="${1:-}"

if [ -z "$CONTRACT" ]; then
  echo "Uso:"
  echo "  ./.codex-agent/scripts/approve-contract.sh .codex-agent/contracts/ARQUIVO.md"
  echo ""
  echo "Contratos disponíveis:"
  ls -1 "$AGENT_DIR/contracts/"*.md 2>/dev/null | while read f; do
    STATUS=$(grep -m1 "^RASCUNHO\|^APROVADO\|^REJEITADO\|^EXECUTADO" "$f" 2>/dev/null || \
             grep -m1 "RASCUNHO\|APROVADO\|REJEITADO\|EXECUTADO" "$f" 2>/dev/null | \
             head -1 | tr -d '# ' || echo "DESCONHECIDO")
    echo "  [$STATUS] $(basename $f)"
  done
  exit 1
fi

# Aceita caminho relativo à raiz do projeto
if [ ! -f "$CONTRACT" ]; then
  CONTRACT="$PROJECT_DIR/$CONTRACT"
fi

if [ ! -f "$CONTRACT" ]; then
  echo "Erro: contrato não encontrado: $CONTRACT"
  exit 1
fi

# Verifica se já está aprovado
if grep -q "^APROVADO" "$CONTRACT" 2>/dev/null; then
  echo "Aviso: este contrato já está APROVADO."
  grep -E "Aprovado em|Aprovado por" "$CONTRACT" || true
  exit 0
fi

# Verifica se está em RASCUNHO
if ! grep -q "RASCUNHO" "$CONTRACT"; then
  echo "Aviso: contrato não está em status RASCUNHO."
  echo "Verifique o arquivo antes de aprovar."
  exit 1
fi

APPROVE_TS="$(date +"%Y-%m-%d %H:%M:%S")"
CONTRACT_NAME="$(basename "$CONTRACT")"

# Atualiza o status no arquivo
if command -v sed >/dev/null 2>&1; then
  sed -i.bak \
    "s/RASCUNHO — não executar. Aguarda preenchimento e aprovação./APROVADO/" \
    "$CONTRACT"
  sed -i.bak \
    "s/| Aprovado em   | —/| Aprovado em   | $APPROVE_TS/" \
    "$CONTRACT"
  sed -i.bak \
    "s/| Aprovado por  | —/| Aprovado por  | $OPERATOR/" \
    "$CONTRACT"
  rm -f "$CONTRACT.bak"
fi

echo "Contrato aprovado: $CONTRACT_NAME"
echo "Aprovado por: $OPERATOR em $APPROVE_TS"
echo ""
echo "Próximo passo:"
echo "  Execute a mudança usando o prompt:"
echo "  .codex-agent/prompts/99-template-correcao-segura.md"

_audit "CONTRACT_APPROVED" "file=$CONTRACT_NAME operator=$OPERATOR"
