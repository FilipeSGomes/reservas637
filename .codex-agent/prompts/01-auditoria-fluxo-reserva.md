# PROMPT 01 — Auditoria do Fluxo de Reserva

## Modo

SOMENTE LEITURA para runtime/código-fonte.
ESCRITA permitida apenas em `.codex-agent/`.

## Dependências

- Executar após `00-descoberta-inicial`.
- Ler antes de analisar:
  - `.codex-agent/PROJECT-CONTEXT.md`
  - `.codex-agent/AGENTS.md`
  - `.codex-agent/README-PROJETO.md`
  - `.codex-agent/index/MODULES.md`

## Escopo Exato

Arquivos para leitura:

- `index.html`
- `app.js`
- `styles.css`

Não ler Apps Script neste prompt, exceto se necessário para registrar uma pergunta pendente.

## Objetivo

Auditar o fluxo público obrigatório:

1. Ver grade.
2. Clicar em horário disponível.
3. Pré-reserva.
4. Formulário nome/telefone/CPF.
5. Escolha PIX/faturamento.
6. Envio da reserva.
7. Atualização visual da agenda.

## Atualizar em `.codex-agent/`

- `.codex-agent/index/MODULES.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/DECISOES.md`
- `.codex-agent/PADROES.md`
- `.codex-agent/CHANGELOG-AGENTE.md`

## Entrega

- Mapa do fluxo com funções e elementos DOM envolvidos.
- Riscos de quebra por etapa.
- Gaps de validação e UX mobile.
- Perguntas pendentes de regra de negócio.
- Nenhuma alteração em código.
