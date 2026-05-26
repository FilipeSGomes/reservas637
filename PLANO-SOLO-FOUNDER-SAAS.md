# Plano solo founder para transformar em SaaS

Este documento assume a realidade operacional: uma pessoa vendendo, implantando, desenvolvendo e dando suporte. O objetivo e reduzir risco enquanto o produto evolui rapido.

## Tese

O produto nao precisa nascer como SaaS perfeito. Ele precisa nascer como uma operacao vendavel, repetivel e honesta.

A ordem correta e:

1. Vender uma solucao de reservas que ja funciona.
2. Implantar primeiros clientes com processo controlado.
3. Endurecer seguranca e operacao dos pilotos.
4. Migrar para plataforma SaaS quando houver validacao comercial.

## O que vender agora

Vender:

- sistema de reservas online para quadras
- pagina publica de agenda
- fluxo de pre-reserva
- pagamento PIX/faturamento
- painel admin para confirmacao e bloqueios
- personalizacao por cliente
- implantacao assistida

Nao vender ainda:

- SaaS self-service completo
- login multiusuario avancado
- relatorios sofisticados
- integracao automatica com gateways
- escala para centenas de clientes
- SLA formal alto

Frase comercial segura:

"Hoje temos uma solucao pronta para implantacao assistida. A plataforma multi-cliente esta no roadmap e ja estamos preparando a base para escalar sem reescrever a operacao."

## Risco principal

O maior risco nao e tecnico. E vender como plataforma madura algo que ainda opera como produto assistido.

Como mitigar:

- chamar os primeiros clientes de piloto assistido
- limitar escopo do contrato
- definir janela de suporte
- cobrar implantacao e mensalidade coerentes com maturidade
- manter checklist de go-live
- registrar gaps no FISAM governance

## Plano de 30 dias

### Semana 1 - Vender e organizar piloto

Objetivo: conseguir conversar com cliente sem aumentar risco.

Fazer:

- mostrar main estavel
- usar feature microSaaS como prova de evolucao
- coletar requisitos reais do cliente
- preencher checklist de dados minimos
- documentar escopo do piloto

Nao fazer:

- prometer migracao completa para Next.js antes de fechar
- prometer automacoes que nao existem
- alterar main durante negociacao

### Semana 2 - Implantacao assistida

Objetivo: subir cliente novo com processo repetivel.

Fazer:

- criar config do cliente
- criar planilha do cliente
- publicar Apps Script
- validar reserva real assistida
- registrar evidencias no governance

Entregavel:

- cliente operando com agenda publica e admin

### Semana 3 - Reduzir riscos dos pilotos

Objetivo: melhorar estabilidade percebida sem grande reescrita.

Fazer:

- roteiro manual de regressao
- mascaramento de PII no admin
- runbook Apps Script
- cache PWA/versionamento revisado
- procedimento de rollback

Entregavel:

- piloto mais seguro para 2-3 clientes

### Semana 4 - Decidir SaaS v1

Objetivo: decidir se ja existe sinal comercial suficiente para investir em plataforma.

Gatilhos para iniciar Next.js + banco:

- 2 clientes querendo usar
- demanda por login real
- demanda por historico/relatorio
- risco crescente de suporte manual
- necessidade de isolamento de dados forte

Se nao bater os gatilhos:

- continuar endurecendo piloto assistido
- vender mais uma implantacao controlada

## Backlog P0 para uma pessoa so

P0 significa: sem isso, vender/implantar fica arriscado.

1. Checklist de go-live por cliente.
2. Template de config por cliente.
3. Roteiro manual de regressao.
4. Runbook de Apps Script.
5. Mascaramento basico de PII.
6. Registro de incidentes/gaps no governance.
7. Backup simples da planilha por cliente.

## Backlog P1

1. Login real no admin.
2. Auditoria de acoes administrativas.
3. Banco PostgreSQL.
4. API propria.
5. Importador de Sheets.
6. Multi-tenant real.

## Backlog P2

1. Onboarding self-service.
2. Billing/assinatura.
3. Relatorios avancados.
4. Multiunidade.
5. Gateway de pagamento integrado.

## Arquitetura recomendada quando migrar

Escolha pragmatica para SaaS v1:

- Next.js App Router
- PostgreSQL gerenciado
- Prisma para acelerar modelagem e migracoes
- Auth.js ou Supabase Auth, dependendo do deploy
- API interna no proprio Next.js
- storage simples para logos/assets
- audit_events desde o primeiro dia

Evitar no inicio:

- microservicos
- filas complexas
- billing antes de validar recorrencia
- permissao granular demais
- multi-regiao

## Modelo comercial inicial

Para nao vender instabilidade como maturidade:

- cobrar taxa de implantacao
- cobrar mensalidade menor no piloto
- deixar claro que e implantacao assistida
- limitar customizacoes
- prazo de estabilizacao pos-go-live
- evolucoes grandes viram proposta separada

## Checklist de conversa comercial

Perguntar:

- Quantas quadras?
- Quais modalidades?
- Horario de funcionamento?
- Como recebem pagamento hoje?
- Quem confirma reservas?
- Precisa CPF?
- Precisa faturamento/mensalista?
- Usa WhatsApp como canal oficial?
- Quer dominio proprio?
- Qual dor principal: agenda, pagamento, organizacao ou atendimento?

Validar expectativa:

- piloto assistido ou plataforma self-service?
- urgencia de go-live?
- volume esperado de reservas?
- nivel de suporte esperado?

## Criterio para dizer sim

Dizer sim quando:

- cliente aceita implantacao assistida
- escopo cabe no fluxo atual
- nao exige login complexo no dia 1
- aceita planilha/Apps Script no piloto
- entende que evolucoes entram no roadmap

## Criterio para segurar ou cobrar mais

Segurar ou cobrar mais quando:

- exige integracao de pagamento real imediata
- exige multiplos perfis/usuarios ja no piloto
- exige relatorios complexos
- exige SLA forte
- exige migracao/importacao grande
- exige customizacao visual pesada

## Proxima acao recomendada

Depois da reuniao, preencher um documento de requisitos do cliente e transformar em contrato FISAM pequeno. O primeiro contrato pos-reuniao deve ser apenas: criar cliente piloto com configuracao isolada e checklist de go-live.
