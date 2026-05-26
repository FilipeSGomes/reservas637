# Changelog do Agente

## 2026-05-26 - Base multi-cliente para reuniao comercial

- **Operador**: Codex/OpenClaw
- **Branch**: feature/microSaas
- **Contrato**: .codex-agent/contracts/006-multicliente-config-loader.md
- **Mudanca aplicada**: criado registry de clientes e loader de configuracao para selecionar cliente por query string, localStorage ou hostname; adicionado config/demo.config.js como segundo cliente demonstrativo; admin e pagina de instalacao passaram a carregar a configuracao selecionada; service worker atualizado para cachear loader/configs.
- **Documentacao criada**: MULTICLIENTE.md com operacao atual para dois clientes e NEXTJS-DB-ROADMAP.md com plano de migracao para Next.js + PostgreSQL.
- **Validacao tecnica**: node --check em app.js, sw.js, config/clients.js, config/config-loader.js e config/demo.config.js.
- **Complemento de implantacao**: criado config/_client-template.config.js e GO-LIVE-NOVO-CLIENTE.md para acelerar onboarding quando o comercial fechar novo cliente.

## 2026-05-26 - Planejamento para SaaS real

- **Operador**: Codex/OpenClaw
- **Modo**: planejamento/produto dentro do FISAM governance.
- **Mudanca aplicada**: criado SAAS-PLANEJAMENTO.md com mapa mental, gaps, backlog por fase, decisoes propostas e criterios de sucesso para transformar o sistema em SaaS real.
- **Governance atualizado**: MAPA-MENTAL.md, GAPS.md e DECISOES.md passaram a refletir a direcao multi-cliente, gaps de backend/tenant/admin e decisao de tratar Next.js + PostgreSQL como SaaS v1.
- **Complemento**: criado PLANO-EXECUCAO-SAAS.md com fases A-D, matriz de prioridade, arquitetura alvo, modelo de dados inicial e decisoes em aberto.

> Registro cronológico de sessões de análise e alterações.
> Atualizar ao final de TODA execução, mesmo sem alteração de código.

---

## 2026-04-27 09:26:19 — Bootstrap inicial

- **Operador**: filipe.gomes
- **Cliente/Projeto**: Reservas 637
- **Risco**: R0
- **Modo**: evolve
- **Ação**: Framework implantado. Nenhuma análise realizada ainda.
- **Próximo passo**: Rodar scan e descoberta inicial.

---

## 2026-04-27 — Descoberta inicial do projeto

- **Operador**: Codex
- **Modo solicitado**: somente leitura para runtime/código-fonte; escrita permitida apenas em `.codex-agent/`
- **Ação**: descoberta inicial baseada em contexto obrigatório, scan estrutural e amostragem dos entrypoints/configurações.
- **Arquivos de código/configuração lidos**: `index.html`, `instalar.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `README.md`, `CNAME`, `google-sheets-template/README.md`, `google-sheets-template/apps-script.gs`, `google-sheets-template/reservas.csv`, `google-sheets-template/bloqueios.csv`.
- **Principais descobertas**: aplicação estática sem build; persistência via Google Sheets/Apps Script; admin com senha hardcoded; PWA com service worker; ausência de testes automatizados.
- **Memória atualizada**: README técnico, mapa mental, riscos, gaps, decisões, padrões, scorecard, inventário de módulos e prompts incrementais.
- **Código-fonte alterado**: não.
- **Próximo passo**: executar auditorias incrementais começando por fluxo de reserva e Apps Script/planilhas.

---

## 2026-04-27 — Registro de respostas de negócio/operação

- **Operador**: Codex
- **Origem**: respostas fornecidas pelo usuário no chat.
- **Ação**: perguntas pendentes foram convertidas em decisões confirmadas quando aplicável.
- **Decisões registradas**: URL de Apps Script é produção; Apps Script de produção é igual ao versionado; senha admin pode ser mantida por enquanto; PIX será confirmado manualmente pelo proprietário; `faturado` exige ação futura mas fora do escopo atual; datas passadas devem ser bloqueadas; suporte principal é Android/iOS/Chrome/Safari; não há rollback GitHub Pages; não há backup periódico próprio além do histórico do Google Sheets.
- **Código-fonte alterado**: não.
- **Próximo passo**: auditar fluxo de reserva e preparar contrato para bloqueio de reservas em datas passadas.

---

## 2026-04-27 — Prompt 01: Auditoria do fluxo de reserva

- **Modo**: somente leitura para código-fonte; escrita apenas em `.codex-agent/`.
- **Arquivos lidos**: `index.html`, `app.js`, `styles.css`.
- **Ação**: mapeado fluxo público obrigatório da agenda até o envio e recarregamento da agenda.
- **Achados principais**: fluxo está encadeado por `boot()` -> `loadAgenda()` -> `renderSchedule()` -> `openPreBookingModal()` -> `continueToBookingForm()` -> `showPaymentStep()` -> `submitBooking()` -> `submitMutation()` -> `loadAgenda()`; datas passadas não estão bloqueadas; telefone/CPF têm validação fraca; modal pode ter risco de usabilidade em telas pequenas.
- **Código-fonte alterado**: não.
- **Próximo passo**: executar Prompt 02 para auditar contrato frontend/Apps Script/planilhas.

---

## 2026-04-27 — Prompt 02: Auditoria Apps Script e planilhas

- **Modo**: somente leitura para código-fonte; escrita apenas em `.codex-agent/`.
- **Arquivos lidos**: `app.js`, `google-sheets-template/apps-script.gs`, `google-sheets-template/README.md`, `google-sheets-template/reservas.csv`, `google-sheets-template/bloqueios.csv`.
- **Ação**: mapeado contrato action -> payload -> validação -> efeito nas planilhas.
- **Achados principais**: `LockService` reduz concorrência; `reservation:create`, `reservation:confirm` e `block:create` estão versionados; Apps Script não valida listas fechadas de quadra/horário/status/pagamento; não bloqueia datas passadas; `reservation:confirm` pode confirmar `faturado` se chamado diretamente; documentação dos templates possui caminhos absolutos antigos.
- **Código-fonte alterado**: não.
- **Próximo passo**: executar Prompt 03 para auditoria de segurança e dados sensíveis.

---

## 2026-04-27 — Prompt 03: Auditoria de segurança e dados sensíveis

- **Modo**: somente leitura para código-fonte; escrita apenas em `.codex-agent/`.
- **Arquivos lidos**: `app.js`, `index.html`, `google-sheets-template/apps-script.gs`, `google-sheets-template/reservas.csv`, `google-sheets-template/bloqueios.csv`, `README.md`, `.codex-agent/RISCOS.md`, `.codex-agent/GAPS.md`, `.codex-agent/DECISOES.md`.
- **Ação**: inventariado fluxo de segredos/configurações, dados pessoais, pagamento, admin, webhook e dados de exemplo sem registrar valores sensíveis.
- **Achados principais**: configuração sensível permanece no cliente; reserva coleta nome/telefone/CPF; painel admin exibe PII completa; webhook recebe payload completo; fallback local pode persistir dados se usado sem webhook; falta política LGPD formal e procedimento de resposta a exposição/abuso.
- **Código-fonte alterado**: não.
- **Próximo passo**: executar Prompt 04 para auditoria de PWA, deploy e cache.

---

## 2026-04-27 — Prompt 04: Auditoria PWA, deploy e cache

- **Modo**: somente leitura para código-fonte; escrita apenas em `.codex-agent/`.
- **Arquivos lidos**: `index.html`, `instalar.html`, `manifest.webmanifest`, `sw.js`, `styles.css`, `CNAME`, `README.md`.
- **Ação**: mapeado manifesto, registro de service worker, lista de app shell, estratégia de cache, domínio e página de instalação.
- **Achados principais**: manifesto está presente; `sw.js` usa `app-637-v2` e cache-first para todo GET; app shell local é pré-cacheado; Bootstrap/Google Fonts não estão no app shell; `instalar.html` não carrega `app.js` e não registra service worker sozinha; não há rollback GitHub Pages nem política de versionamento de cache.
- **Código-fonte alterado**: não.
- **Próximo passo**: executar Prompt 05 para preparar contrato da primeira correção segura.

---

## 2026-04-27 — Prompt 05: Contrato da primeira correção segura

- **Modo**: alteração controlada somente em `.codex-agent/contracts/` e memória `.codex-agent/`; código-fonte somente leitura.
- **Arquivos lidos**: `.codex-agent/README-PROJETO.md`, `.codex-agent/index/MODULES.md`, `.codex-agent/RISCOS.md`, `.codex-agent/GAPS.md`, `.codex-agent/DECISOES.md`, `.codex-agent/PADROES.md`, `.codex-agent/SCORECARD.md`, `app.js`, `google-sheets-template/apps-script.gs`.
- **Ação**: criado contrato pendente para bloquear reservas públicas em datas passadas no frontend e no Apps Script.
- **Contrato criado**: `.codex-agent/contracts/001-bloquear-reservas-datas-passadas.md`.
- **Justificativa**: regra de negócio confirmada, alto valor operacional, escopo pequeno, sem alteração de estrutura do Sheets.
- **Código-fonte alterado**: não.
- **Próximo passo**: aguardar aprovação explícita do contrato antes de qualquer alteração em código.

---

## 2026-04-27 — Implementação do Contrato 001

- **Aprovação**: usuário autorizou seguir com as alterações necessárias no chat.
- **Contrato**: `.codex-agent/contracts/001-bloquear-reservas-datas-passadas.md`.
- **Arquivos alterados**: `app.js`, `google-sheets-template/apps-script.gs`, `sw.js`, `.codex-agent/contracts/001-bloquear-reservas-datas-passadas.md`, `.codex-agent/DECISOES.md`, `.codex-agent/RISCOS.md`, `.codex-agent/GAPS.md`, `.codex-agent/SCORECARD.md`, `.codex-agent/CHANGELOG-AGENTE.md`.
- **Mudança aplicada**: frontend impede seleção/envio de reserva em data passada; Apps Script versionado recusa `reservation:create` em data passada; cache PWA incrementado para `app-637-v3`.
- **Verificações executadas**: `node --check app.js`; `node --check sw.js`; `node --check` do conteúdo de `google-sheets-template/apps-script.gs` copiado temporariamente para `/tmp/apps-script-check.js`.
- **Pendências**: publicar Apps Script atualizado em produção; testar fluxo completo reserva -> Sheets -> admin; validar atualização de service worker em cliente instalado.

---

## 2026-05-05 — Prompt 00: Descoberta inicial incremental

- **Modo**: leitura para código/runtime; escrita apenas em `.codex-agent/`.
- **Ação**: análise incremental baseada em `PROJECT-SCAN.md` + amostragem dirigida de entrypoints, integração Sheets/Apps Script, PWA e docs.
- **Arquivos lidos**: contexto obrigatório, `index.html`, `admin/index.html`, `instalar.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `README.md`, `google-sheets-template/*`.
- **Achados principais**: stack estática confirmada, ausência de CI/testes confirmada, presença de dados sensíveis/segredos hardcoded confirmada (sem registrar valores), módulo de configuração (`config:update`) ativo, cache PWA atual em `app-637-v4`.
- **Memória atualizada**: `README-PROJETO.md`, `MAPA-MENTAL.md`, `RISCOS.md`, `GAPS.md`, `DECISOES.md`, `PADROES.md`, `SCORECARD.md`, `index/MODULES.md` e novos prompts incrementais.
- **Código-fonte alterado**: não.

---

## 2026-05-05 — Scan de configuração do admin (não refletindo)

- **Modo**: leitura de código + escrita em `.codex-agent/`.
- **Ação**: varredura ponta a ponta do fluxo de configuração (formulários admin -> webhook `config:update` -> leitura/aplicação em runtime).
- **Diagnóstico confirmado**:
  1. `settings.copy` é enviado pelo frontend, mas não é persistido corretamente no Apps Script.
  2. Existe duplicidade de fonte de preço (`pricingByCourt` vs `pricingConfig`) e o motor usa `pricingConfig`.
- **Entrega**: contrato criado em `.codex-agent/contracts/002-correcao-config-admin-nao-reflete.md`.
- **Código-fonte alterado**: não.

## 2026-05-05 — Implementação do Contrato 002 (config admin refletindo)

- **Aprovação**: usuário aprovou execução no chat.
- **Arquivos alterados**: `app.js`, `google-sheets-template/apps-script.gs`, `.codex-agent/contracts/002-correcao-config-admin-nao-reflete.md`, `.codex-agent/CHANGELOG-AGENTE.md`.
- **Correções aplicadas**:
  1. `config:update` agora persiste chaves `copy.*` recebidas em `settings.copy`.
  2. `updatePaymentView()` passou a usar `copy.bookingBillingNotice` (com suporte a placeholder `{amount}`) em vez de texto hardcoded.
  3. `applySettings()` agora aplica `bookingBillingSubtitle` diretamente.
  4. `showBookingConfirmation()` usa `copy.billingStatusText` no status de faturamento.
- **Validação técnica**: `node --check app.js` aprovado; sintaxe do Apps Script validada via cópia temporária `.js`.
- **Pendência residual**: coexistência de `pricingByCourt` e `pricingConfig` permanece para decisão de produto/UX em próximo contrato.

## 2026-05-05 — Implementação do Contrato 003 (unificação de preço)

- **Aprovação**: derivada da solicitação explícita do usuário para resolver a pendência residual.
- **Arquivos alterados**: `app.js`, `admin/index.html`, `.codex-agent/contracts/003-unificacao-fonte-preco-admin.md`, `.codex-agent/DECISOES.md`, `.codex-agent/CHANGELOG-AGENTE.md`.
- **Resultado**: eliminada ambiguidade de edição de preços no admin; `pricingConfig` é a fonte oficial e `pricingByCourt` tornou-se representação derivada/informativa.

## 2026-05-05 — Implementação do Contrato 004 (agenda em cards expansíveis)

- **Aprovação**: usuário aprovou execução no chat.
- **Arquivos alterados**: `app.js`, `styles.css`.
- **Mudanças**:
  1. Agenda por quadra passou a renderizar cabeçalho de card com controle expandir/recolher.
  2. Horários ficam visíveis apenas dentro do corpo expandido da quadra correspondente.
  3. Resumo no cabeçalho por quadra com disponibilidade e próximo horário.
  4. Mantido comportamento existente de clique em horário disponível para abrir pré-reserva.
- **Validação técnica**: `node --check app.js` aprovado.

## 2026-05-05 — Implementação do Contrato 005 (overflow campo de data mobile)

- **Aprovação**: usuário aprovou execução no chat.
- **Arquivo alterado**: `styles.css`.
- **Correções aplicadas**:
  1. Wrapper do campo na toolbar com `width/max-width: 100%`, `min-width: 0`, `box-sizing: border-box`.
  2. Inputs/selects/textarea com `max-width: 100%`, `min-width: 0`, `box-sizing: border-box`.
  3. `#date-input` explicitamente limitado a 100% da largura disponível.
  4. Ajustes mobile para manter toque/ícone sem overflow.
- **Impacto funcional**: nenhum (somente CSS).

## 2026-05-05 — Hardening responsivo mobile real (iPhone Safari/Chrome)

- **Escopo**: ajustes visuais/CSS somente.
- **Arquivo alterado**: `styles.css`.
- **Ajustes principais**:
  1. Reforço global de contenção horizontal em `html/body`.
  2. Safe-area inferior reforçada para evitar sobreposição da barra inferior iOS.
  3. `#date-input` com sizing estável para iOS real.
  4. `toolbar` e wrappers com `min-width: 0` e contenção de largura.
  5. `legend-chip` com quebra controlada em 2 colunas e 1 coluna <=390px.
  6. Botão principal do card de próximo horário com margem segura inferior.
- **Impacto funcional**: nenhum (sem alteração de regra de reserva/preço/status).

## 2026-05-08 — Prompt 00: Descoberta inicial (rodada atual)

- **Operador**: Codex
- **Modo**: somente leitura para runtime/código-fonte; escrita apenas em `.codex-agent/`.
- **Ação**: amostragem técnica orientada por scan + validação de entrypoints, configuração, PWA, integração Sheets/Apps Script e documentação viva.
- **Arquivos lidos**: `.codex-agent/PROJECT-CONTEXT.md`, `.codex-agent/AGENTS.md`, `.codex-agent/index/PROJECT-SCAN.md`, `README.md`, `AGENTS.md`, `README-agents.md`, `index.html`, `admin/index.html`, `instalar.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `sw.js`, `config/637.config.js`, `google-sheets-template/README.md`, `google-sheets-template/apps-script.gs`, `CNAME`.
- **Principais achados**:
  1. Stack estática confirmada (HTML/CSS/JS + Bootstrap CDN + PWA).
  2. Sem testes automatizados, sem CI/CD e sem observabilidade operacional.
  3. Segredos/dados sensíveis detectados (existência registrada sem valores).
  4. Divergências entre documentação e configuração operacional (arquivos e horário).
- **Memória atualizada**: `README-PROJETO.md`, `MAPA-MENTAL.md`, `RISCOS.md`, `GAPS.md`, `DECISOES.md`, `PADROES.md`, `SCORECARD.md`, `index/MODULES.md`, novos prompts incrementais.
- **Código-fonte alterado**: não.
