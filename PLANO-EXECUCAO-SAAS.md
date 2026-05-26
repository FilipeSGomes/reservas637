# Plano de execucao para SaaS real

Este plano organiza a evolucao do sistema em fases. A regra central e simples: vender com o que funciona, implantar rapido com baixo risco, e evoluir para SaaS real sem reescrita impulsiva.

## Principios

- Main continua sendo demonstracao estavel.
- Feature microSaaS e laboratorio e kit de implantacao.
- Google Sheets/Apps Script pode sustentar piloto, mas nao deve ser vendido como arquitetura final.
- Next.js + PostgreSQL entra como SaaS v1, com migracao planejada.
- Toda mudanca relevante deve passar pelo FISAM governance: gap, decisao, contrato, validacao.
- Como Filipe esta tocando sozinho, priorizar escopo vendavel e repetivel antes de arquitetura ideal.
- Primeiros clientes devem ser tratados como implantacao assistida, nao self-service maduro.

## Fase A - Comercial e piloto rapido

Objetivo: fechar cliente e conseguir subir uma primeira versao operavel em pouco tempo.

Escopo:

- Config por cliente.
- Planilha e Apps Script por cliente.
- Dominio/subdominio por cliente.
- Tenant resolvido por subdominio em producao.
- Publico e admin parametrizados.
- Checklist de go-live.
- Roteiro manual de validacao.

Entregaveis:

- Cliente criado em config/cliente.config.js.
- Cliente registrado em config/clients.js.
- Subdominio registrado em hostnameMap.
- Planilha criada a partir do template.
- Apps Script publicado.
- Admin validado.
- Primeira reserva assistida.

Criterio de pronto:

- Cliente consegue receber reserva real.
- Admin consegue confirmar pagamento e bloquear horarios.
- Dados entram na planilha correta.
- Rollback basico documentado.

## Fase B - Piloto endurecido

Objetivo: reduzir risco operacional dos primeiros clientes sem ainda migrar tudo.

Escopo:

- Mascaramento de CPF/telefone no admin.
- Roteiro de regressao manual.
- Checklist de publicacao Apps Script.
- Revisao LGPD minima.
- Padronizacao de cache PWA.
- Correcoes documentais do projeto.

Entregaveis:

- TESTES-MANUAIS.md.
- RUNBOOK-APPS-SCRIPT.md.
- LGPD-MINIMO.md.
- Ajustes pequenos de seguranca no frontend.
- Gaps atualizados no governance.

Criterio de pronto:

- Operador consegue publicar e reverter Apps Script.
- Fluxo reserva -> planilha -> admin tem checklist repetivel.
- Dados pessoais nao ficam expostos sem necessidade.

## Fase C - SaaS v1 com Next.js e banco

Objetivo: criar plataforma multi-tenant de verdade.

Escopo:

- Next.js para frontend publico, admin e API.
- PostgreSQL como fonte de verdade.
- Login real.
- Usuarios e papeis.
- Tenant isolado por banco/API.
- Auditoria de acoes administrativas.
- Importador da planilha atual.

Entregaveis:

- App Next.js versionado.
- Schema inicial do banco.
- APIs de agenda, reserva, bloqueio, config e admin.
- Login e permissoes.
- Migrador/importador Google Sheets.
- Deploy com ambiente de preview.

Criterio de pronto:

- Dois tenants operam no mesmo backend sem vazamento de dados.
- Admin exige login real.
- Toda acao sensivel gera audit_event.
- Reserva salva no banco com snapshot de preco.
- O sistema atual ainda pode ser usado como fallback/legado durante transicao.

## Fase D - SaaS v2 produto

Objetivo: transformar plataforma em produto escalavel.

Escopo:

- Onboarding guiado.
- Multiunidade.
- Relatorios.
- Planos e cobranca.
- Dominio customizado por cliente.
- Exportacao e descarte LGPD.
- Observabilidade e alertas.

Entregaveis:

- Tela de onboarding.
- Painel de tenants.
- Dashboard operacional.
- Exportacao CSV/relatorio.
- Monitoramento de erros.
- Playbook de suporte.

Criterio de pronto:

- Criar cliente novo nao exige commit manual.
- Suporte consegue diagnosticar falha de reserva/webhook/API.
- Produto tem caminho claro para cobrar recorrencia.

## Matriz de prioridade

| Item | Impacto comercial | Risco tecnico | Prioridade |
|------|-------------------|---------------|------------|
| Config multi-cliente | Alto | Medio | P0 |
| Checklist go-live | Alto | Baixo | P0 |
| Roteiro testes manuais | Alto | Baixo | P0 |
| Mascaramento PII admin | Medio | Medio | P1 |
| Runbook Apps Script | Medio | Baixo | P1 |
| Login real | Alto | Alto | P1 SaaS |
| PostgreSQL multi-tenant | Alto | Alto | P1 SaaS |
| Auditoria admin | Medio | Alto | P1 SaaS |
| Onboarding self-service | Alto | Medio | P2 |
| Billing/assinatura | Alto | Medio | P2 |

## Arquitetura alvo resumida

- Next.js App Router.
- PostgreSQL.
- Prisma ou Drizzle como camada de schema/migration.
- Auth com usuarios por tenant.
- API interna por tenant.
- Storage de assets por cliente.
- Audit log obrigatorio.
- Jobs/cron para manutencao, lembretes e backups.

## Modelo de dados inicial

- tenants
- tenant_domains
- tenant_settings
- users
- memberships
- courts
- reservations
- blocks
- payments
- audit_events

## Decisoes em aberto

- Prisma ou Drizzle.
- Vercel, VPS ou outro deploy.
- Auth.js, Clerk, Supabase Auth ou autenticacao propria.
- PostgreSQL gerenciado ou self-hosted.
- Gateway de pagamento inicial.
- Nivel de LGPD exigido no primeiro cliente fora da 637.

## Sequencia recomendada depois da reuniao

1. Registrar requisitos reais do cliente.
2. Criar config do cliente na feature.
3. Validar piloto com planilha.
4. Abrir contratos FISAM para gaps P0/P1.
5. Decidir stack do SaaS v1.
6. Criar branch/projeto Next.js somente depois de confirmar demanda.

## Plano solo founder

O plano operacional para vender a base estavel com implantacao assistida esta em PLANO-SOLO-FOUNDER-SAAS.md.
