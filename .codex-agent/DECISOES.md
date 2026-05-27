# Decisões, Hipóteses e Perguntas

> Atualizado em 2026-05-26.

## Confirmado

- [CONFIRMADO] Stack é estática: HTML/CSS/JS + Bootstrap CDN + Google Fonts.
- [CONFIRMADO] Persistência principal depende de Google Sheets + Apps Script.
- [CONFIRMADO] Não há pipeline CI/CD nem testes automatizados no repositório.
- [CONFIRMADO] `sw.js` usa cache nomeado (`app-637-v5-config`).
- [CONFIRMADO] Existe fallback de dados em `localStorage` quando integração remota falha.
- [CONFIRMADO] Branch `feature/microSaas` possui kit inicial multi-cliente por registry/loader/config.
- [CONFIRMADO] Main deve permanecer como demonstração estável para demonstração comercial.
- [CONFIRMADO] Next.js + Supabase (PostgreSQL) é a direção técnica confirmada para SaaS v1.
- [CONFIRMADO] Primeiros clientes devem ser tratados como implantação assistida enquanto a plataforma SaaS v1 não estiver pronta.
- [CONFIRMADO] Escopo comercial deve evitar prometer self-service, SLA alto, integrações complexas e relatórios avançados no piloto.
- [CONFIRMADO] O tenant de produção deve ser resolvido por subdomínio: 637.fisamtech.com, euphoria.fisamtech.com e futuros clientes em subdomínios próprios.
- [CONFIRMADO] Supabase escolhido como backend: PostgreSQL gerenciado + Auth + Storage numa conta só, free tier, Row Level Security para isolamento de tenant.
- [CONFIRMADO] Escopo do banco inclui tudo junto: tenants, tenant_settings, courts, reservations, blocks, audit_events. Google Sheets fica como legado para 637 até migrar.
- [CONFIRMADO] Admin autenticado via Supabase Auth (email + senha real), com JWT contendo tenant_id como claim. RLS garante isolamento — admin de um tenant não acessa dados de outro.
- [CONFIRMADO] Frontend migra para Next.js App Router junto com o banco. HTML estático atual permanece como legado para 637 até migrar.
- [CONFIRMADO] Aparência (cores, fontes, logo) será salva por tenant no banco (tabela tenant_settings), não mais apenas em localStorage.
- [CONFIRMADO] Logo armazenada no Supabase Storage (não mais como base64 em localStorage).
- [CONFIRMADO] Contrato 008 (onboarding Euphoria) transformado em contrato genérico de onboarding de novo cliente. Euphoria ainda não fechou negócio.
- [CONFIRMADO] As regras de negócio e parâmetros do 637 estão em `config/637.config.js` e essa é a única fonte de verdade para este cliente enquanto ele não migrar para o Supabase.
- [CONFIRMADO] Os dados do `config/637.config.js` são os dados de migração do 637: quando for migrar, usa-se o seed em `next-app/supabase/seed-637.sql`, derivado diretamente desse config.
- [CONFIRMADO] Onboarding genérico cobre: criar tenant no DB, configurar quadras/preços, upload de logo, aparência, criar usuário admin no Supabase Auth, configurar subdomínio, validar e go-live.

## Hipóteses

- [HIPÓTESE] Apps Script em produção está alinhado ao arquivo `google-sheets-template/apps-script.gs` atual.
- [HIPÓTESE] Configuração da aba `config` é considerada fonte operacional para textos/preços/contato no dia a dia.

## Perguntas pendentes

- [PENDENTE] Qual regra oficial prevalece para horário de funcionamento: 07h–22h (AGENTS) ou 06h–20h (`config/637.config.js`)?
- [PENDENTE] Qual documento oficial deve prevalecer para estrutura de arquivos (`style.css`/`manifest.json` vs `styles.css`/`manifest.webmanifest`)?
- [PENDENTE] Há requisito de mascaramento de CPF/telefone no painel admin?
- [PENDENTE] Qual política de retenção e descarte de PII será adotada?
- [PENDENTE] Qual fluxo oficial de rollback para incidentes de Apps Script?
- [PENDENTE] Quando 637 migra da planilha para o Supabase?
- [PENDENTE] Qual provedor de hospedagem do Next.js? (Vercel recomendado para deploy rápido)
- [PENDENTE] Domínio customizado para tenants além de fisamtech.com? (tabela tenant_domains prevista no schema)
- [PENDENTE] Billing/assinatura: quando entra no produto? Qual gateway?

## Assunções proibidas

- Não assumir que validação client-side é suficiente para regra crítica.
- Não assumir publicação de Apps Script sem evidência operacional.
- Não assumir que cache PWA vai invalidar corretamente sem processo.
- Não assumir que divergência documental é intencional; tratar como gap até decisão.
- Não assumir que chave de serviço Supabase pode ir para o frontend — sempre server-side.
