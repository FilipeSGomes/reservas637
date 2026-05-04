# PROMPT 02 — Auditoria de Apps Script e Planilhas

## Modo

SOMENTE LEITURA para runtime/código-fonte.
ESCRITA permitida apenas em `.codex-agent/`.

## Dependências

- Executar após `00-descoberta-inicial`.
- Recomenda-se executar após `01-auditoria-fluxo-reserva`.

## Escopo Exato

Arquivos para leitura:

- `app.js`
- `google-sheets-template/apps-script.gs`
- `google-sheets-template/README.md`
- `google-sheets-template/reservas.csv`
- `google-sheets-template/bloqueios.csv`

## Objetivo

Auditar contrato entre frontend, Apps Script e Google Sheets:

- Actions aceitas.
- Payloads esperados.
- Validações obrigatórias.
- Consistência contra reservas duplicadas.
- Tratamento de bloqueios.
- Ordem e nomes de colunas.
- Formatos de data/hora.

## Atualizar em `.codex-agent/`

- `.codex-agent/index/MODULES.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/DECISOES.md`
- `.codex-agent/PADROES.md`
- `.codex-agent/SCORECARD.md`
- `.codex-agent/CHANGELOG-AGENTE.md`

## Entrega

- Matriz action -> payload -> validação -> efeito na planilha.
- Riscos de concorrência e abuso.
- Perguntas para confirmar diferenças entre template e produção.
- Nenhuma alteração em código.
