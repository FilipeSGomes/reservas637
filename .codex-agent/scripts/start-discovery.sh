#!/usr/bin/env bash
# start-discovery.sh — Inicia descoberta inicial com o Codex
# Pré-requisito: scan-project.sh já deve ter sido executado

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
AGENT_DIR="$PROJECT_DIR/.codex-agent"
AUDIT_LOG="$AGENT_DIR/logs/audit.log"
OPERATOR="${USER:-unknown}"
PROMPT_FILE="$AGENT_DIR/prompts/00-descoberta-inicial.md"
SCAN_FILE="$AGENT_DIR/index/PROJECT-SCAN.md"

_audit() {
  printf "%s | %s | %s | %s\n" "$(date +"%Y-%m-%dT%H:%M:%S")" "$OPERATOR" "$1" "${2:-}" >> "$AUDIT_LOG"
}

cd "$PROJECT_DIR"

if ! command -v codex >/dev/null 2>&1; then
  echo "Erro: Codex CLI não encontrado no PATH."
  echo "Instale o Codex CLI antes de rodar."
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "Erro: prompt inicial não encontrado: $PROMPT_FILE"
  exit 1
fi

if [ ! -f "$SCAN_FILE" ]; then
  echo "Aviso: scan não encontrado. Rodando scan primeiro..."
  echo ""
  bash "$AGENT_DIR/scripts/scan-project.sh"
  echo ""
fi

echo "Iniciando descoberta inicial com Codex..."
echo "Projeto: $PROJECT_DIR"
echo ""

_audit "DISCOVERY_START" "prompt=$PROMPT_FILE"

codex "$(< "$PROMPT_FILE")"

_audit "DISCOVERY_END" "status=completed"
