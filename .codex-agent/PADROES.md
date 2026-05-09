# Padrões Detectados

> Atualizado em 2026-05-08.

## Padrões de implementação
- Estado global em `app.js` (`state` + `elements`).
- UI, regra de negócio e integração concentradas em arquivo único JS.
- Leitura de planilha via `gviz/tq` com parser próprio.
- Escrita remota por `submitMutation(action, payload)`.
- Modais com elemento nativo `dialog`.

## Padrões de domínio
- Quadras padronizadas por IDs (`BT1`, `BT2`, `TN1`, `TN2`).
- Status operacionais: `pendente`, `confirmado`, `faturado`, `bloqueado`.
- Pagamento: `pix` e `faturamento`.

## Padrões operacionais
- Deploy estático em GitHub Pages.
- PWA com cache versionado manualmente.
- Configuração híbrida: `config/637.config.js` + aba `config` do Sheets.

## Anti-padrões
- Controle admin e integrações sensíveis expostos no frontend.
- Sem testes automatizados.
- Sem trilha de auditoria para ações administrativas.
