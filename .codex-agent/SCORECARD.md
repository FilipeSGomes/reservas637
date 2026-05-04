# Scorecard Técnico

> Notas de 0 a 5. Atualizar com justificativa a cada revisão.
> 0 = ausente/crítico | 5 = maduro/sólido

| Área               | Nota | Observação | Última atualização |
|--------------------|-----:|------------|-------------------|
| Arquitetura        |    2 | Simples e coerente para estático, mas `app.js` concentra muitas responsabilidades e acopla frontend à planilha/webhook. | 2026-04-27 |
| Testes             |    0 | Nenhum teste automatizado ou checklist com evidências detectado. | 2026-04-27 |
| Segurança          |    1 | Senha admin, webhook e chave PIX hardcoded; PII completa no painel; Apps Script ainda aceita payload direto sem autenticação, mas passou a validar data passada no código versionado. | 2026-04-27 |
| Documentação       |    2 | README e template existem, mas contêm links desatualizados e faltam runbooks/decisões críticas. | 2026-04-27 |
| Deploy             |    2 | GitHub Pages provável e sem build, mas sem pipeline, rollback ou política de cache documentada. | 2026-04-27 |
| Observabilidade    |    1 | Apenas banners e `console.error`; sem logs/auditoria/métricas ou trilha de acesso/admin. | 2026-04-27 |
| Manutenibilidade   |    2 | Código pequeno e legível, porém com responsabilidades concentradas e regras críticas divididas entre cliente e Apps Script. | 2026-04-27 |
| Risco de alteração |    2 | Primeira alteração controlada implementada; ainda exige publicação do Apps Script e teste fim a fim por tocar agenda e webhook de produção. | 2026-04-27 |

## Score Geral: 12/40

## Classificação

Baixa maturidade operacional, com risco controlável por ser um projeto pequeno, mas sensível por lidar com dados pessoais, pagamento e agenda de produção.

## Histórico de Scores

| Data | Score | Responsável |
|------|------:|-------------|
| 2026-04-27 | 12/40 | Codex |
