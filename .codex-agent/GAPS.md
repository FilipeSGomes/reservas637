# Gaps do Projeto

> Atualizado em 2026-05-26.

## SaaS e multi-cliente
- Modelo atual permite multi-cliente por arquivo de configuracao, mas ainda nao ha isolamento de tenant em backend.
- Configuracao de cliente ainda exige commit/deploy para alteracoes estruturais.
- Admin continua com senha simples exposta no frontend.
- Nao ha usuarios, papeis ou permissoes por cliente.
- Nao ha auditoria centralizada de acoes administrativas.
- Nao ha onboarding assistido para criar cliente novo sem mexer no repo.
- PWA/manifest ainda e compartilhado e nao totalmente parametrizado por tenant.
- Dados ainda dependem de Google Sheets/Apps Script por cliente.
- Roteamento por subdominio precisa de contrato/validacao para evitar fallback silencioso em tenant errado.
- Risco comercial: vender a base estavel atual como se ja fosse SaaS self-service maduro, quando ainda deve ser posicionada como implantacao assistida.
- Risco operacional: uma pessoa so precisa limitar customizacoes, suporte e promessas de SLA.

## Testes
- Não há testes unitários, integração ou E2E.
- Não há roteiro de regressão automatizada para fluxo reserva -> sheets -> admin.

## Segurança e dados
- Falta política documentada de LGPD para CPF/telefone.
- Falta estratégia de rotação da senha admin.
- Falta mascaramento padrão de CPF/telefone no admin.

## Operação
- Sem runbook formal de deploy/rollback GitHub Pages + Apps Script.
- Sem checklist formal de invalidação/versionamento de cache PWA.
- Sem procedimento versionado para publicação e auditoria de Apps Script.

## Qualidade técnica
- `PROJECT-SCAN.md` está truncado/incompleto e não lista os arquivos de configuração corretamente.
- Divergência documental: `AGENTS.md` menciona `style.css`/`manifest.json`, mas código usa `styles.css`/`manifest.webmanifest`.
- Divergência de regras: `AGENTS.md` exige horário 07h–22h, enquanto `config/637.config.js` define 06h–20h.

## Observabilidade
- Sem métricas de erro, sem logs de auditoria admin e sem alerta de falhas de webhook.
