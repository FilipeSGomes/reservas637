# Scorecard Técnico

> Notas de 0 a 5. Atualizado em 2026-05-08.

| Área | Nota | Observação |
|---|---:|---|
| Arquitetura | 2 | Simples e funcional, mas `app.js` concentra responsabilidades. |
| Testes | 0 | Nenhum teste automatizado detectado. |
| Segurança | 1 | Admin hardcoded no cliente + PII sensível. |
| Documentação | 3 | Memória viva existe, porém com divergências documentais abertas. |
| Deploy | 2 | GitHub Pages sem pipeline e sem runbook formal de rollback. |
| Observabilidade | 1 | Sem telemetria/auditoria operacional. |
| Manutenibilidade | 2 | Projeto pequeno, porém monolítico no JS principal. |
| Risco de alteração | 2 | Fluxo crítico exige validação manual abrangente. |

## Score geral
13/40
