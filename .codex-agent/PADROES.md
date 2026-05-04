# Padrões Detectados

> Padrões reais observados no código — não padrões desejados.

## Código

- JavaScript puro com constantes globais e funções nomeadas em `app.js`.
- Estado central em objeto `state`.
- Referências de DOM centralizadas no objeto `elements`.
- Eventos registrados em `attachEvents()`.
- Renderização via criação dinâmica de elementos e `innerHTML` em alguns pontos.
- Mutação remota centralizada em `submitMutation(action, payload, fallbackUpdater)`.
- Parsing de Google Sheets centralizado em `fetchSheetRows()`, `parseGvizResponse()` e normalizadores.
- Mensagens de erro exibidas por `updateBanner()`.
- Fluxos de modal são controlados por classes `.hidden` e métodos nativos `showModal()`/`close()`.
- Botões de envio usam `setButtonLoading()` e `pendingOperations` para reduzir reenvio duplicado no mesmo cliente.
- Validação de formulário combina atributos HTML (`required`, `minlength`) com `reportValidity()`.
- CPF é mascarado no input, mas sem validação semântica.

## Arquitetura

- Frontend monolítico estático.
- Integração direta com serviços Google a partir do navegador.
- Apps Script atua como camada remota de escrita e consistência.
- Fallback local existe para funcionamento sem webhook configurado.
- PWA adiciona cache de app shell.
- Regra visual de disponibilidade é calculada no cliente por `getSlotState()`, priorizando bloqueio sobre reserva.
- Apps Script usa `LockService` como controle de concorrência para mutações.

## Banco de Dados

- Google Sheets como banco tabular.
- Abas com nomes fixos: `reservas` e `bloqueios`.
- Campos dependem de posição de coluna.
- Datas e horários são normalizados por funções dedicadas no cliente e no Apps Script.
- Apps Script usa `getRange(...).getValues()` e procura registros de baixo para cima.
- Apps Script grava reservas por `appendRow()` na aba `reservas` e bloqueios por `appendRow()` na aba `bloqueios`.
- Apps Script confirma reserva alterando diretamente a coluna 7/status.

## Testes

- Nenhum padrão de teste automatizado detectado.
- Validação esperada é manual/fim a fim.

## Deploy

- GitHub Pages presumido por presença de `CNAME`.
- Sem build e sem pipeline CI/CD detectado.
- Assets referenciados por caminhos relativos.
- Domínio customizado definido via `CNAME`.
- PWA usa manifesto em `manifest.webmanifest`.
- Service worker usa cache versionado manualmente por string `CACHE_NAME`.
- Estratégia de cache atual é cache-first para GETs.
- App shell pré-cacheado lista explicitamente HTML/CSS/JS/manifest/imagens/ícones locais.

## Nomenclatura

- IDs de quadras em caixa alta curta: `BT1`, `BT2`, `TN1`, `TN2`.
- Status em português minúsculo: `pendente`, `confirmado`, `faturado`.
- Pagamentos em português minúsculo: `pix`, `faturamento`.
- Actions de webhook em padrão namespace: `reservation:create`, `reservation:confirm`, `block:create`.

## Anti-padrões Críticos

- Senha admin hardcoded no frontend.
- Dados pessoais exibidos integralmente no painel admin.
- URL de webhook e chave PIX hardcoded no cliente.
- `app.js` concentra responsabilidades demais.
- Ausência de testes para regras críticas.
