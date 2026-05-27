# Contrato 008 - Onboarding Genérico de Novo Cliente (SaaS v1)

## Status

ATIVO — substitui o contrato anterior (Euphoria-específico). A Euphoria ainda não fechou negócio.

## Objetivo

Definir o processo repetível e documentado para adicionar qualquer novo cliente ao SaaS, usando Next.js + Supabase como plataforma.

## Dados mínimos para onboarding

Coletar estes dados antes de iniciar qualquer criação de tenant:

| Campo | Obrigatório | Exemplo |
|---|---|---|
| Nome público do espaço | Sim | "Espaço Euphoria" |
| Slug (subdomínio) | Sim | `euphoria` |
| Logo (arquivo) | Sim | `logo.png` |
| WhatsApp de atendimento | Sim | `5511944554650` |
| Chave PIX | Sim | `email@dominio.com` |
| Horário de funcionamento | Sim | 07:00–22:00 |
| Quadras (id, nome, tipo) | Sim | BT1, BT2 (beach tennis) |
| Preços por quadra/período | Sim | R$ 80 diurno / R$ 100 noturno |
| E-mail do admin | Sim | `admin@espaco.com.br` |
| Senha temporária do admin | Sim | Gerada, trocada no primeiro acesso |
| Formas de pagamento | Sim | PIX, Faturamento |
| Domínio customizado | Não | `reservas.espaco.com.br` |
| Mensagem WhatsApp padrão | Não | Template de comprovante |

## Plano de execução (com Supabase)

1. **Criar tenant no banco**
   - INSERT em `tenants` (slug, name, short_name, timezone)
   - INSERT em `tenant_domains` (hostname: `{slug}.fisamtech.com`)

2. **Criar configuração inicial**
   - INSERT em `tenant_settings` com valores comerciais coletados
   - Upload da logo para Supabase Storage (`logos/{tenant_id}/logo.*`)
   - Preencher `logo_url` em `tenant_settings`

3. **Criar quadras**
   - INSERT em `courts` para cada quadra do cliente

4. **Criar usuário admin**
   - Criar usuário no Supabase Auth (email + senha)
   - INSERT em `tenant_memberships` (user_id, tenant_id, role='admin')

5. **Configurar DNS**
   - Apontar `{slug}.fisamtech.com` para Vercel/host do Next.js

6. **Validar end-to-end**
   - Abrir agenda pública em `{slug}.fisamtech.com`
   - Criar reserva PIX teste
   - Login admin, confirmar reserva
   - Verificar que dados ficam isolados no Supabase (RLS)

7. **Registrar evidências**
   - Anotar no CHANGELOG-AGENTE.md com checklist preenchido

## Critérios de aceite

- `{slug}.fisamtech.com` carrega tenant correto.
- Reserva teste cria registro em `reservations` com o `tenant_id` correto.
- Admin logado no Supabase Auth, não vê dados de outros tenants.
- Aparência (cores, logo) carregada do banco, não de localStorage.
- Checklist de go-live preenchido.

## Rollback

1. Desativar hostname em `tenant_domains`.
2. Desativar tenant_settings (flag `active = false` em tenants).
3. Preservar dados para auditoria — não deletar imediatamente.
4. Revogar usuário admin no Supabase Auth se necessário.

## Arquivos relevantes

- `next-app/supabase/schema.sql` — schema completo
- `next-app/supabase/rls.sql` — políticas RLS
- `next-app/lib/tenant.ts` — resolução de tenant por host
- `GO-LIVE-NOVO-CLIENTE.md` — checklist operacional (a atualizar)
