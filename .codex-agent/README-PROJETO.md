# README Técnico Vivo do Projeto

> Atualizado pelo agente em 2026-04-27 durante a descoberta inicial.

## Visão Geral

Sistema estático de reserva de quadras para a 637 Cervejaria, publicado em GitHub Pages no domínio `637.fisamtech.com`.

O frontend é composto por HTML, CSS e JavaScript puro. A persistência operacional ocorre fora do repositório, via Google Sheets para leitura pública por `gviz/tq` e Apps Script para mutações por webhook.

## Stack Detectada

- HTML5 em `index.html` e `instalar.html`.
- CSS3 em `styles.css`.
- JavaScript ES6+ sem bundler em `app.js`.
- Service Worker em `sw.js`.
- PWA via `manifest.webmanifest`.
- Bootstrap 5.3.0 via CDN em `index.html` e `instalar.html`.
- Google Fonts via CDN.
- Google Sheets público via endpoint `gviz/tq`.
- Google Apps Script como webhook de escrita.
- GitHub Pages com domínio definido em `CNAME`.

## Como Rodar

Não há script de execução detectado. O projeto pode ser servido como arquivos estáticos.

Formas prováveis:

- Abrir `index.html` diretamente para inspeção visual simples.
- Servir a pasta com servidor estático local para validar PWA/service worker.

## Como Testar

Não há testes automatizados detectados.

Teste manual mínimo recomendado antes de qualquer alteração:

1. Carregar a agenda do dia.
2. Criar pré-reserva em horário disponível.
3. Preencher nome, telefone e CPF.
4. Escolher PIX e enviar reserva.
5. Entrar no painel admin.
6. Confirmar PIX pendente.
7. Criar bloqueio em horário sem reserva.
8. Recarregar agenda e validar estados visuais.

## Como Fazer Build

Não há build. O artefato de produção é a própria árvore estática.

## Como Fazer Deploy

Deploy presumido por GitHub Pages. O arquivo `CNAME` aponta o domínio customizado.

Rollback ainda não está definido. Qualquer alteração em produção deve incluir plano de reversão no contrato de mudança.

PWA/cache: `sw.js` usa cache `app-637-v2`. Alterações em arquivos estáticos devem considerar atualização de `CACHE_NAME` e teste em navegador com service worker já instalado.

## Estrutura de Pastas

- `/index.html`: tela principal, grade de horários, modais de reserva e painel admin.
- `/instalar.html`: instruções de instalação PWA.
- `/app.js`: configuração, estado, leitura da agenda, mutações, renderização e admin.
- `/styles.css`: layout, tema visual e responsividade.
- `/sw.js`: cache de app shell e fallback cache-first.
- `/manifest.webmanifest`: manifesto PWA.
- `/icons/`: ícones PWA/favicon.
- `/images/`: imagem principal da marca.
- `/google-sheets-template/`: CSVs e Apps Script modelo.
- `/.codex-agent/`: memória técnica viva.

## Arquitetura Real

Aplicação client-side monolítica:

- `index.html` define a estrutura da experiência pública e admin.
- `app.js` centraliza configuração, estado em memória, leitura de planilhas, parsing de `gviz`, submissão ao Apps Script e fallback local.
- `styles.css` implementa o design visual e responsividade.
- `sw.js` adiciona cache offline para arquivos estáticos.

Não há backend próprio, roteamento SPA, pacote npm, pipeline de build ou ORM.

## Módulos Críticos

- Reserva pública: fluxo de pré-reserva, formulário, pagamento e envio.
- Leitura de agenda: consulta às abas `reservas` e `bloqueios`.
- Escrita de dados: webhook Apps Script com ações `reservation:create`, `reservation:confirm` e `block:create`.
- Admin: autenticação por senha simples hardcoded e operações de confirmação/bloqueio.
- Dados pessoais: nome, telefone e CPF trafegam pelo frontend e planilha.
- Pagamento: escolha entre PIX e faturamento, com status derivados no cliente.
- PWA/cache: service worker pode manter arquivos antigos em cache.

## Banco de Dados

Banco real: Google Sheets.

Abas detectadas:

- `reservas`: `data`, `quadra`, `horario`, `nome`, `telefone`, `cpf`, `status`, `pagamento`, `observacao`.
- `bloqueios`: `data`, `quadra`, `horario`, `motivo`.

ORM: não aplicável.

## Integrações

- Google Sheets via leitura pública `gviz/tq`.
- Google Apps Script via POST JSON. A URL presente no código foi confirmada como produção.
- GitHub Pages/domínio customizado.
- CDN Bootstrap.
- CDN Google Fonts.
- API de Service Worker/Cache do navegador.
- WhatsApp é mencionado na instrução de pagamento, mas não há integração técnica direta detectada.
- Confirmação PIX será operacional/manual pelo proprietário olhando a conta destino; não haverá integração bancária neste ciclo.

## Autenticação e Autorização

Admin usa senha simples hardcoded no JavaScript e `window.prompt`.

Não há autenticação forte, sessão persistente, autorização server-side ou segregação real entre usuário comum e admin no frontend. A proteção efetiva das mutações depende do Apps Script publicado.

A senha pode ser mantida por enquanto. Possível ofuscação/criptografia no frontend deve ser tratada apenas como redução superficial de exposição, não como segurança forte.

## Regras de Negócio Confirmadas

- Reservas em datas passadas devem ser bloqueadas.
- `faturado` exige ação posterior, mas essa ação não será implementada por enquanto.
- Suporte principal: Android, iOS, Chrome e Safari em celulares e computadores.
- Apps Script de produção é igual ao código versionado no repositório.

## Observabilidade

Observabilidade técnica mínima:

- Mensagens em banner para o usuário.
- `console.error` em falhas de leitura, envio e service worker.

Não há logging centralizado, auditoria de ações admin, métricas, tracing ou alertas.

## Riscos

Resumo dos riscos principais:

- Segredos/configurações sensíveis hardcoded no frontend.
- Dados pessoais trafegando e renderizados no cliente/admin.
- Apps Script público pode ser abusado se não houver validações suficientes fora do frontend.
- Ausência total de testes automatizados.
- Divergências entre documentação/instruções e implementação real.

## Gaps

Resumo dos gaps principais:

- Sem testes automatizados.
- Sem contrato formal de ambiente/produção para Apps Script.
- Sem política documentada de LGPD/retenção de CPF/telefone.
- Sem processo de validação manual documentado com evidências.
- Sem documentação operacional de cache/PWA e rollback.
- Sem backup periódico próprio fora do histórico automático do Google Sheets.

## Próximos Passos

1. Executar prompt de auditoria do fluxo de reserva.
2. Executar prompt de auditoria de Apps Script e planilhas.
3. Executar prompt de segurança e dados sensíveis.
4. Executar prompt de PWA/deploy/cache.
5. Executar prompt de documentação e testes manuais.

## Checklist Manual PWA/Deploy

1. Abrir `index.html` no domínio final e confirmar registro do service worker.
2. Validar manifesto, ícones e nome do app no Android/Chrome.
3. Validar instalação via Safari/iOS seguindo `instalar.html`.
4. Alterar versão de cache em contrato quando houver mudança de asset estático.
5. Testar atualização em navegador que já tinha versão anterior instalada.
6. Testar agenda online após service worker ativo.
7. Testar comportamento offline esperado: app shell pode abrir, mas agenda/mutações dependem de rede.
8. Documentar commit/tag usado como ponto de rollback manual antes de deploy.
