# Planejamento para SaaS real

Objetivo: transformar o Reservas 637 em uma plataforma de reservas multi-cliente, sem perder a capacidade de implantar rapido quando o comercial fechar um novo cliente.

## Norte do produto

O produto deve resolver a operacao diaria de arenas, clubes e quadras:

- agenda publica simples para o cliente final
- pre-reserva e pagamento
- painel operacional para atendimento/admin
- bloqueios, aulas, eventos e manutencao
- configuracao por cliente sem mexer em codigo
- dados isolados por cliente
- subdominio por cliente como rota oficial de tenant
- caminho de implantacao em horas, nao semanas

## Visao em camadas

### Camada 1 - Implantacao rapida

Estado desejado para vender agora:

- usar a branch microSaaS como kit de implantacao
- criar cliente por arquivo de config
- usar Google Sheets/Apps Script por cliente
- validar fluxo publico/admin
- publicar dominio/subdominio

Essa camada e suficiente para pilotos e primeiros clientes pagos.

### Camada 2 - Plataforma SaaS

Estado desejado para escala:

- Next.js para publico, admin e API
- PostgreSQL como banco principal
- autenticacao real
- tenants isolados
- auditoria de operacoes
- configuracao salva no banco
- deploy padronizado
- observabilidade minima

### Camada 3 - Produto comercial

Estado desejado para crescer:

- onboarding guiado de cliente
- planos/cobranca
- usuarios e permissoes
- multiunidade
- relatorios
- exportacao LGPD
- integracoes de pagamento
- suporte e rollback operacional

## Mapa mental do SaaS

SaaS de Reservas
- Tenant: marca, subdominio/dominio, horarios, politicas, configuracoes comerciais
- Agenda: quadras, horarios, bloqueios, aulas, eventos
- Reserva: cliente final, contato, documento, status, pagamento, snapshot de preco
- Admin: reservas do dia, confirmar pagamento, bloquear horario, configurar textos/precos, auditoria
- Plataforma: autenticacao, usuarios, permissoes, banco, API, logs
- Operacao: onboarding, deploy, backup, rollback, suporte

## Gaps para virar SaaS

### Criticos

- Admin ainda usa senha no frontend.
- Dados de tenants ainda nao ficam isolados por backend.
- Configuracao sensivel fica exposta no cliente.
- Google Sheets/Apps Script nao escala bem como backend unico.
- Nao ha trilha de auditoria confiavel para admin.

### Altos

- Ausencia de testes automatizados.
- Ausencia de CI/CD.
- Sem modelo formal de usuario/permissao.
- Sem backup/restore documentado por cliente.
- Sem monitoramento de falhas de webhook/API.

### Medios

- Manifest/PWA ainda e unico para todos os clientes.
- Assets/logos ainda dependem de arquivo no repo.
- Config por arquivo exige commit/deploy para mudar cliente.
- Sem tela interna de onboarding.
- Sem relatorios comerciais.

## Backlog recomendado

### Agora - fechar comercial e subir rapido

1. Manter main como demonstracao estavel.
2. Usar microSaaS como branch de implantacao multi-cliente.
3. Criar template de cliente e checklist de go-live.
4. Validar segundo cliente com config isolada.
5. Preparar roteiro comercial de implantacao.

### Proxima sprint - endurecer piloto

1. Corrigir divergencias documentais de horario/arquivos.
2. Adicionar roteiro manual de regressao executavel.
3. Mascarar PII no admin por padrao.
4. Padronizar planilha modelo por cliente.
5. Criar checklist de publicacao de Apps Script.

### SaaS v1 - Next.js + banco

1. Criar projeto Next.js separado ou subdiretorio versionado.
2. Modelar PostgreSQL com tenants, courts, reservations, blocks, users, audit_events.
3. Criar API propria mantendo compatibilidade com contratos atuais.
4. Migrar admin para login real.
5. Criar importador de Google Sheets para banco.

### SaaS v2 - produto

1. Onboarding self-service assistido.
2. Multiunidade.
3. Cobranca/plano.
4. Relatorios.
5. Observabilidade e suporte.

## Plano operacional

O detalhamento de fases, prioridades e criterios de pronto esta em PLANO-EXECUCAO-SAAS.md.

O recorte pragmatico para uma pessoa so vender, implantar e evoluir esta em PLANO-SOLO-FOUNDER-SAAS.md.

## Decisoes propostas

- Nao reescrever antes da reuniao.
- Nao vender Google Sheets como arquitetura final.
- Usar a branch atual como ponte comercial.
- Tratar Next.js + PostgreSQL como SaaS v1.
- Manter FISAM governance como controle de mudancas, gaps, riscos e contratos.

## Criterios de sucesso

- Novo cliente configurado sem alterar logica central.
- Reserva publica e admin funcionando por cliente.
- Dados de um cliente nao aparecem no outro.
- Go-live documentado e repetivel.
- Roadmap tecnico claro para reduzir risco depois da venda.
