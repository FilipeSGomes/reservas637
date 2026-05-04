#!/usr/bin/env bash
# show-log.sh — Exibe o audit log de forma legível
#
# Uso:
#   ./.codex-agent/scripts/show-log.sh          # últimas 50 entradas
#   ./.codex-agent/scripts/show-log.sh 100      # últimas N entradas
#   ./.codex-agent/scripts/show-log.sh all      # tudo

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
AUDIT_LOG="$PROJECT_DIR/.codex-agent/logs/audit.log"
LINES="${1:-50}"

if [ ! -f "$AUDIT_LOG" ]; then
  echo "Audit log não encontrado: $AUDIT_LOG"
  exit 1
fi

echo "=================================================================="
echo " FISAM AI Governance — Audit Log"
echo " Projeto: $PROJECT_DIR"
echo "=================================================================="
echo ""

if [ "$LINES" = "all" ]; then
  grep -v "^#" "$AUDIT_LOG"
else
  grep -v "^#" "$AUDIT_LOG" | tail -"$LINES"
fi

echo ""
echo "Total de entradas: $(grep -v "^#" "$AUDIT_LOG" | grep -c . || echo 0)"
