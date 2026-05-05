# Gaps do Projeto

> Atualizado em 2026-05-05.

## Testes
- Não há testes unitários/integrados/E2E.
- Não há suíte de regressão para fluxo reserva -> planilha -> admin.

## Segurança e dados
- Falta política LGPD operacional (finalidade, retenção, exclusão, acesso).
- Falta política de rotação de senha admin e resposta a incidente.
- Falta mascaramento de CPF no painel admin por padrão.

## Operação
- Falta runbook de deploy e rollback no GitHub Pages.
- Falta checklist formal para atualização de `CACHE_NAME` e invalidação PWA.
- Falta procedimento documentado para publicação/versão do Apps Script.

## Qualidade técnica
- `app.js` centraliza responsabilidades em excesso.
- Falta documentação de contrato de erro/resposta do webhook para suporte.

## Observabilidade
- Falta telemetria mínima de erro e trilha auditável de ações admin.

- Persistência de `copy.*` no `config:update` está incompleta: payload recebido não é escrito de volta na aba `config` para chaves novas/alteradas.
- Admin possui duas fontes de configuração de preço (`pricingByCourt` e `pricingConfig`) sem regra única de precedência.
