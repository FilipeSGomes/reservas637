# PROMPT 03 — Auditoria de Segurança e Dados Sensíveis

## Modo

SOMENTE LEITURA para runtime/código-fonte.
ESCRITA permitida apenas em `.codex-agent/`.

## Dependências

- Executar após `00-descoberta-inicial`.
- Usar achados de `01` e `02` se disponíveis.

## Escopo Exato

Arquivos para leitura:

- `app.js`
- `index.html`
- `google-sheets-template/apps-script.gs`
- `google-sheets-template/*.csv`
- `README.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/DECISOES.md`

Não registrar valores de senha, tokens, URLs sensíveis, chaves PIX ou dados pessoais.

## Objetivo

Mapear exposição de:

- Senhas e configurações sensíveis.
- CPF, telefone e nome.
- Pagamento/PIX/faturamento.
- Acesso admin.
- Webhook público.
- Dados de exemplo.

## Atualizar em `.codex-agent/`

- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/DECISOES.md`
- `.codex-agent/SCORECARD.md`
- `.codex-agent/CHANGELOG-AGENTE.md`

## Entrega

- Inventário de dados sensíveis por fluxo.
- Classificação de risco sem valores sensíveis.
- Controles mínimos recomendados.
- Perguntas LGPD/operacionais pendentes.
- Nenhuma alteração em código.
