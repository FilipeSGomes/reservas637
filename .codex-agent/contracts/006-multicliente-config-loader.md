# Contrato 006 - Base multi-cliente para MicroSaaS

## Status

IMPLEMENTADO

## Objetivo

Permitir que a mesma base estatica carregue configuracoes diferentes por cliente, viabilizando demonstracao e operacao inicial com mais de um cliente antes da migracao para Next.js + banco.

## Escopo alterado

- config/clients.js
- config/config-loader.js
- config/demo.config.js
- config/_client-template.config.js
- index.html
- admin/index.html
- instalar.html
- app.js
- sw.js
- MULTICLIENTE.md
- GO-LIVE-NOVO-CLIENTE.md
- NEXTJS-DB-ROADMAP.md

## Regras

1. Nao alterar a configuracao real da 637 sem necessidade.
2. Nao quebrar o carregamento padrao da 637.
3. Permitir segundo cliente por client=demo.
4. Manter fallback local para demo sem Sheets/Webhook.
5. Documentar limites do modelo atual e caminho de evolucao.

## Validacao esperada

- Sintaxe JS aprovada.
- Publico carrega cliente padrao sem query.
- Publico carrega cliente demo com client=demo.
- Admin carrega cliente demo com admin/?client=demo.
- Service worker precacheia o loader e configs.
