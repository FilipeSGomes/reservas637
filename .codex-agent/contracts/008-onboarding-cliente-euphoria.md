# Contrato 008 - Onboarding do cliente Euphoria

## Status

PARCIAL - tenant tecnico criado; dados comerciais, planilha, Apps Script e go-live ainda pendentes.

## Objetivo

Preparar o tenant Euphoria para piloto assistido em euphoria.fisamtech.com, usando o kit multi-cliente da feature microSaaS.

## Dados pendentes

- Nome publico exato do espaco.
- Logo/asset aprovado.
- WhatsApp de atendimento.
- Chave PIX.
- Horario de funcionamento.
- Modalidades e quadras.
- Precos por modalidade/periodo.
- Regra de cancelamento.
- Forma de pagamento aceita.
- Senha temporaria do admin.
- Planilha/Apps Script do cliente.

## Arquivos permitidos para leitura

- config/_client-template.config.js
- config/clients.js
- GO-LIVE-NOVO-CLIENTE.md
- MULTICLIENTE.md
- google-sheets-template/README.md
- google-sheets-template/apps-script.gs

## Arquivos permitidos para alteracao

- config/euphoria.config.js
- config/clients.js
- GO-LIVE-NOVO-CLIENTE.md
- .codex-agent/CHANGELOG-AGENTE.md
- .codex-agent/DECISOES.md

## Arquivos proibidos

- config/637.config.js
- main branch
- producao 637 sem validacao explicita.

## Plano de execucao

1. Coletar dados minimos do cliente.
2. Criar config/euphoria.config.js a partir do template. [feito com placeholders seguros]
3. Registrar euphoria.fisamtech.com em config/clients.js. [feito]
4. Criar/copiar planilha do cliente.
5. Publicar Apps Script do cliente.
6. Validar fluxo publico e admin com euphoria.fisamtech.com ou preview por query.
7. Registrar evidencias no governance.

## Plano de teste

1. Abrir agenda do Euphoria.
2. Criar reserva PIX teste.
3. Criar reserva faturamento/mensalista teste, se aplicavel.
4. Login admin.
5. Confirmar reserva.
6. Bloquear horario.
7. Conferir que dados nao entram na planilha da 637.

## Rollback

1. Remover euphoria do hostnameMap.
2. Remover ou desativar config/euphoria.config.js.
3. Reverter DNS/subdominio para pagina temporaria.
4. Preservar planilha para auditoria.

## Criterios de aceite

- euphoria.fisamtech.com carrega tenant Euphoria.
- Reserva teste vai para planilha Euphoria.
- Admin Euphoria nao mostra dados da 637.
- Checklist de go-live preenchido.
