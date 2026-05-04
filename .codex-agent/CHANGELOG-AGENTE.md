# Changelog do Agente

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
