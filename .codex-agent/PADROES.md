# Padrões Detectados

> Atualizado em 2026-05-05.

## Padrões de implementação
- JavaScript puro com estado global (`state`) e mapa de elementos (`elements`).
- Arquivo único principal (`app.js`) para regras, UI e integração.
- Leitura de dados via `gviz/tq` com parsing próprio.
- Escrita via `submitMutation` por actions do webhook.
- Uso de `dialog` nativo para modais.

## Padrões de domínio
- Quadras fixas: `BT1`, `BT2`, `TN1`, `TN2`.
- Status: `pendente`, `confirmado`, `faturado`, `bloqueado`.
- Pagamento: `pix` e `faturamento`.

## Padrões operacionais
- Sem build step; deploy de estáticos.
- PWA com cache versionado manualmente.
- Configuração operacional centralizada em aba `config` (Sheets).

## Anti-padrões relevantes
- Segredos e controles de acesso no cliente.
- Ausência de testes automatizados e de observabilidade real.
