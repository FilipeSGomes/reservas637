# Scorecard Técnico

> Notas de 0 a 5. Atualizado em 2026-05-05.

| Área | Nota | Observação |
|---|---:|---|
| Arquitetura | 2 | Simples e funcional, porém com alto acoplamento no `app.js`. |
| Testes | 0 | Nenhum teste automatizado detectado. |
| Segurança | 1 | Segredos e acesso admin no frontend + PII sensível. |
| Documentação | 3 | Boa memória viva em `.codex-agent`, mas faltam runbooks operacionais formais. |
| Deploy | 2 | GitHub Pages sem pipeline/rollback operacional documentado. |
| Observabilidade | 1 | Sem trilha auditável e sem telemetria mínima. |
| Manutenibilidade | 2 | Projeto pequeno, porém responsabilidades concentradas. |
| Risco de alteração | 2 | Mudanças em fluxo crítico exigem contrato e testes E2E manuais. |

## Score geral
13/40
