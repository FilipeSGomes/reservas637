# Riscos Técnicos

> Atualizado em 2026-05-26.

## Críticos — legado (HTML estático / 637)

- Controle de acesso admin com senha hardcoded no frontend (existência detectada). **Mitigado na arquitetura alvo** → Supabase Auth.
- Endpoint de escrita (Apps Script) exposto no cliente (existência detectada). **Mitigado na arquitetura alvo** → Server Actions / API Routes.
- Processamento de PII (nome/telefone/CPF) sem backend próprio. **Mitigado na arquitetura alvo** → backend Next.js + RLS Supabase.
- Ações sensíveis (`reservation:confirm`, `block:create`, `config:update`) iniciadas do cliente. **Mitigado na arquitetura alvo** → auth + RLS.
- Exibição de PII em claro no painel admin. **Pendente** — mascaramento não implementado.

## Críticos — arquitetura alvo (Next.js + Supabase)

- Service role key do Supabase exposta ao browser: **nunca permitir**. Chave vai apenas em Server Actions/API Routes via variáveis de ambiente server-only.
- Tenant resolvido por parâmetro do cliente (não por host): **nunca permitir**. Sempre validar pelo hostname.
- RLS desativada ou mal configurada: toda tabela com tenant_id deve ter RLS ativa.

## Altos

- Ausência total de testes automatizados.
- Ausência de CI/CD e de validações automáticas pré-deploy.
- Sem política formal de LGPD/retenção/minimização documentada no repositório.
- Acoplamento rígido a estrutura de planilha (legado 637).
- Dependência operacional de publicação correta do Apps Script (legado 637).
- Paridade funcional entre HTML estático e Next.js deve ser alcançada antes de desligar o legado.

## Médios

- Observabilidade operacional insuficiente (sem trilha auditável).
- Fallback local em `localStorage` pode divergir de estado remoto (legado).
- Dependência de CDNs externas para renderização ideal (legado).
- Supabase free tier tem limites (500 MB DB, 1 GB storage, 50 MB file size); monitorar conforme cresce.

## Baixos

- `app.js` monolítico reduz legibilidade (legado — a eliminar na migração para Next.js).

## Segredos e dados sensíveis

- Detectado no HTML estático: **sim** (existência registrada sem exposição de valores).
- Next.js: variáveis `SUPABASE_SERVICE_ROLE_KEY` e `SUPABASE_URL` devem ser server-only (`NEXT_PUBLIC_` apenas para anon key).
