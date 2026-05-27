# Gaps do Projeto

> Atualizado em 2026-05-26.

## SaaS e multi-cliente

### Resolvidos nesta sessão (feature/microSaas)
- ~~Modelo atual permite multi-cliente por arquivo de configuração, mas ainda não há isolamento de tenant em backend.~~ → **Em andamento**: Next.js + Supabase com RLS por tenant.
- ~~Admin continua com senha simples exposta no frontend.~~ → **Resolvido na arquitetura**: Supabase Auth (email + senha real) com JWT e RLS.
- ~~Não há onboarding assistido para criar cliente novo sem mexer no repo.~~ → **Resolvido na arquitetura**: onboarding genérico via painel admin + criação de tenant no DB.
- ~~Dados ainda dependem de Google Sheets/Apps Script por cliente.~~ → **Em andamento**: migração para Supabase (tenants, reservations, blocks, tenant_settings).
- ~~Aparência/cores configuráveis apenas em localStorage.~~ → **Resolvido**: tenant_settings no Supabase guarda aparência por tenant.
- ~~Logo depende de arquivo no repo.~~ → **Resolvido na arquitetura**: logo no Supabase Storage.
- ~~Config por arquivo exige commit/deploy para mudar cliente.~~ → **Resolvido na arquitetura**: tudo no banco, sem config files por cliente.

### Ainda abertos

- Não há usuários, papéis ou permissões por cliente além do owner/admin inicial.
- Não há auditoria centralizada de ações administrativas (tabela prevista mas não implementada ainda).
- PWA/manifest ainda compartilhado e não totalmente parametrizado por tenant.
- Roteamento por subdomínio precisa de validação para evitar fallback silencioso em tenant errado.
- Risco operacional: uma pessoa só precisa limitar customizações, suporte e promessas de SLA.
- 637 ainda opera em Google Sheets; migração para Supabase está pendente.

## Testes
- Não há testes unitários, integração ou E2E.
- Não há roteiro de regressão automatizada para fluxo reserva → banco → admin.

## Segurança e dados
- Falta política documentada de LGPD para CPF/telefone.
- Falta mascaramento padrão de CPF/telefone no admin.
- No Next.js, garantir que service role key do Supabase nunca vá ao browser.

## Operação
- Sem runbook formal de deploy/rollback (GitHub Pages legado + Vercel Next.js).
- Sem checklist formal de invalidação/versionamento de cache PWA (HTML estático legado).
- Sem procedimento versionado para publicação e auditoria de Apps Script (legado 637).

## Qualidade técnica
- `PROJECT-SCAN.md` está truncado/incompleto e não lista arquivos de configuração corretamente.
- Divergência documental: `AGENTS.md` menciona `style.css`/`manifest.json`, mas código usa `styles.css`/`manifest.webmanifest`.
- Divergência de regras: `AGENTS.md` exige horário 07h–22h, enquanto `config/637.config.js` define 06h–20h.

## Observabilidade
- Sem métricas de erro, sem logs de auditoria admin e sem alerta de falhas de webhook (legado).
- Next.js: Supabase fornece logs básicos de Auth/DB, mas falta observabilidade de erros da aplicação.
